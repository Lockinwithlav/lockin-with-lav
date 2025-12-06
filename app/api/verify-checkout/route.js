import stripe from "../../../lib/stripe";

export async function POST(req) {
  const { session_id } = await req.json();
  const session = await stripe.checkout.sessions.retrieve(session_id);
  const paid = session.payment_status === "paid";
  return new Response(JSON.stringify({ paid, email: session.customer_details.email }), { status: 200 });
}
