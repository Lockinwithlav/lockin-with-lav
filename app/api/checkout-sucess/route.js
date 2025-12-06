import stripe from "../../../lib/stripe";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) return NextResponse.json({ error: "no session" }, { status:400 });

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  // Here you would verify payment status and create records (Firestore) or call a generator function
  if (session.payment_status === "paid") {
    // For example: call your Firebase cloud function /generatePlan to create the plan with user data
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.json({ status: session.payment_status });
}
