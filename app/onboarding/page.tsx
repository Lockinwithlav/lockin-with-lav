"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Onboarding() {
  const [form, setForm] = useState({ height:"", weight:"", goal:"" });
  const router = useRouter();

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({...form, [e.target.name]: e.target.value});
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    // Save answers to Firestore or localStorage, then send user to checkout or dashboard
    localStorage.setItem("onboard", JSON.stringify(form));
    router.push("/checkout");
  }

  return (
    <form onSubmit={submit} style={{padding:24}}>
      <h2>Tell us about you</h2>
      <label>Height<input name="height" onChange={handleChange} /></label>
      <label>Weight<input name="weight" onChange={handleChange} /></label>
      <label>Goal
        <select name="goal" onChange={handleChange}>
          <option value="">Choose</option>
          <option value="lose">Lose weight</option>
          <option value="glutes">Grow glutes</option>
          <option value="tone">Tone</option>
        </select>
      </label>
      <button type="submit">Continue</button>
    </form>
  );
}
