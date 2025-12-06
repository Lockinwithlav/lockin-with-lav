import stripe from "../../lib/stripe";

export async function POST(req) {
  const { priceId, email } = await req.json();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${baseUrl}/onboarding?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/pricing`,
    customer_email: email
  });
  return new Response(JSON.stringify({ url: session.url }), { status: 200 });
}
