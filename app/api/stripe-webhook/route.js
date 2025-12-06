//stripe-webhook/route.js
import { NextResponse } from "next/server";
import Stripe from "stripe";
import nodemailer from "nodemailer";
import { generateUserPlan } from "../../plan/generatePlan";
import recipes from "../../plan/recipes.json";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2022-11-15" });
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const config = { api: { bodyParser: false } };

export async function POST(req) {
  const buf = await req.arrayBuffer();
  const sig = req.headers.get("stripe-signature");

  let event;
  try {
    event = stripe.webhooks.constructEvent(Buffer.from(buf), sig, endpointSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return new NextResponse("Webhook Error", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userData = JSON.parse(session.metadata.userData);
    const plan = generateUserPlan(userData, recipes);

    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: process.env.ETHEREAL_USER,
        pass: process.env.ETHEREAL_PASS,
      },
    });

    const html = `
      <h1>Your Personalized Plan</h1>
      <h2>Calories & Macros</h2>
      <p>Calories: ${plan.macros.calories}</p>
      <p>Protein: ${plan.macros.protein}g</p>
      <p>Fat: ${plan.macros.fat}g</p>
      <p>Carbs: ${plan.macros.carbs}g</p>
      <h2>Workout Plan</h2>
      <ul>${plan.workout.map((day) => `<li>${day}</li>`).join("")}</ul>
      <h2>Meal Plan</h2>
      <ul>${plan.meals.map((meal) => `<li>${meal.name}</li>`).join("")}</ul>
    `;

    await transporter.sendMail({
      from: `"Lock In With Lav" <${process.env.ETHEREAL_USER}>`,
      to: session.customer_email,
      subject: "Your Personalized Plan",
      html,
    });

    console.log(`Plan sent to ${session.customer_email}`);
  }

  return new NextResponse("Received", { status: 200 });
}
