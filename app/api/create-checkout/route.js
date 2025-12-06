import stripe from "../../../lib/stripe"; // relative path from app/api -> lib
import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();
  const price = body.price || 1999; // in cents

  const domain = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "cad",
          product_data: { name: "Personalized Plan" },
          unit_amount: price
        },
        quantity: 1
      }
    ],
    success_url: `${domain}/api/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${domain}/checkout`
  });

  return NextResponse.json({ url: session.url });
}
