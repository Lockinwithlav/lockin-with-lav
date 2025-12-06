//stripe-webhook/route.js

import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { generateUserPlan } from "../../plan/generatePlan";
import recipes from "../../plan/recipes.json";

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: process.env.ETHEREAL_USER,
    pass: process.env.ETHEREAL_PASS,
  },
});

export async function POST(req) {
  const event = await req.json();

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    // Retrieve user data from session metadata
    const userData = session.metadata;
    const plan = generateUserPlan(userData, recipes);

    await transporter.sendMail({
      from: '"Lock In With Lav" <no-reply@lockin.com>',
      to: session.customer_email,
      subject: "Your Personalized Plan",
      html: `
        <h1>Your Personalized Plan</h1>
        <h2>Calories & Macros</h2>
        <p>Calories: ${plan.macros.calories}</p>
        <p>Protein: ${plan.macros.protein}g</p>
        <p>Fat: ${plan.macros.fat}g</p>
        <p>Carbs: ${plan.macros.carbs}g</p>
        <h2>Workout Plan</h2>
        <ul>${plan.workout.map(day => `<li>${day}</li>`).join("")}</ul>
        <h2>Meal Plan</h2>
        <ul>${plan.meals.map(meal => `<li>${meal.name}</li>`).join("")}</ul>
      `,
    });

    console.log(`Plan emailed to ${session.customer_email}`);
  }

  return NextResponse.json({ received: true });
}
