import stripe from "../../../lib/stripe";
import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();
  const domain = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  // Only store essential user info in metadata
  const metadata = {
    email: body.email,
    age: body.age.toString(),
    gender: body.gender,
    weight: body.weight.toString(),
    height: body.height.toString(),
    activity: body.activity,
    goal: body.goal,
    daysPerWeek: body.daysPerWeek.toString(),
    dietPreference: body.dietPreference,
  };

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "cad",
          product_data: { name: "Personalized Plan" },
          unit_amount: body.price || 1999,
        },
        quantity: 1,
      },
    ],
    metadata,
    success_url: `${domain}/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${domain}/checkout`,
  });

  return NextResponse.json({ url: session.url });
}
