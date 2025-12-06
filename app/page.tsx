// app/page.tsx (React component)
"use client";
import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  async function handleCheckout() {
    const res = await fetch("/api/create-checkout", {
      method: "POST",
      headers: { "Content-Type":"application/json"},
      body: JSON.stringify({ priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID, email })
    });
    const data = await res.json();
    window.location.href = data.url;
  }
  return (
    <main>
      <h1>Lock In With Lav</h1>
      <p>Your discipline starts here.</p>
      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" />
      <button onClick={handleCheckout}>Get My Plan</button>
    </main>
  )
}
