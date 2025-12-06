import Stripe from "stripe";
import { NextResponse } from "next/server";
import { buffer } from "micro";
import nodemailer from "nodemailer";
import { generateUserPlan } from "../../plan/generatePlan";
import recipes from "../../plan/recipes.json";

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!; // from Stripe dashboard

export async function POST(req: Request) {
  const buf = await buffer(req);
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return new NextResponse("Webhook Error", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const email = session.customer_email!;
    
    // Generate user plan (you could pull extra info from session metadata)
    const userData = {
      age: 25,
      gender: "female",
      weight: 65,
      height: 165,
      activity: "moderate",
      goal: "lose",
      daysPerWeek: 4,
      dietPreference: "vegetarian"
    };
    const plan = generateUserPlan(userData, recipes);

    // Send email
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: process.env.ETHEREAL_USER,
        pass: process.env.ETHEREAL_PASS,
      },
    });

    const emailHtml = `
      <h1>Your Personalized Plan</h1>
      <h2>Calories & Macros</h2>
      <p>Calories: ${plan.macros.calories}</p>
      <p>Protein: ${plan.macros.protein}g</p>
      <p>Fat: ${plan.macros.fat}g</p>
      <p>Carbs: ${plan.macros.carbs}g</p>

      <h2>Workout Plan</h2>
      <ul>${plan.workout.map((day: string) => `<li>${day}</li>`).join("")}</ul>

      <h2>Meal Plan</h2>
      <ul>${plan.meals.map((meal: any) => `<li>${meal.name}</li>`).join("")}</ul>
    `;

    await transporter.sendMail({
      from: `"Lock In With Lav" <${process.env.ETHEREAL_USER}>`,
      to: email,
      subject: "Your Personalized Plan",
      html: emailHtml,
    });

    console.log(`Plan sent to ${email}`);
  }

  return new NextResponse("Received", { status: 200 });
}
