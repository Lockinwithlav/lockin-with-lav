// app/page.tsx (React component)
"use client";
import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [age, setAge] = useState(25);
  const [gender, setGender] = useState("female");
  const [weight, setWeight] = useState(65);
  const [height, setHeight] = useState(165);
  const [activity, setActivity] = useState("moderate");
  const [goal, setGoal] = useState("lose");
  const [daysPerWeek, setDaysPerWeek] = useState(4);
  const [dietPreference, setDietPreference] = useState("vegetarian");

  async function handleCheckout() {
    const res = await fetch("/api/create-checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        age,
        gender,
        weight,
        height,
        activity,
        goal,
        daysPerWeek,
        dietPreference,
        price: 1999, // in cents
      }),
    });
    const data = await res.json();
    window.location.href = data.url;
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Lock In With Lav</h1>
      <p>Enter your information to get your personalized plan.</p>

      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />

      <input type="number" placeholder="Age" value={age} onChange={e => setAge(Number(e.target.value))} />
      <select value={gender} onChange={e => setGender(e.target.value)}>
        <option value="female">Female</option>
        <option value="male">Male</option>
      </select>
      <input type="number" placeholder="Weight (kg)" value={weight} onChange={e => setWeight(Number(e.target.value))} />
      <input type="number" placeholder="Height (cm)" value={height} onChange={e => setHeight(Number(e.target.value))} />
      <select value={activity} onChange={e => setActivity(e.target.value)}>
        <option value="low">Low</option>
        <option value="moderate">Moderate</option>
        <option value="high">High</option>
      </select>
      <select value={goal} onChange={e => setGoal(e.target.value)}>
        <option value="lose">Lose Weight</option>
        <option value="maintain">Maintain</option>
        <option value="gain">Gain Muscle</option>
      </select>
      <input type="number" placeholder="Workout Days/Week" value={daysPerWeek} onChange={e => setDaysPerWeek(Number(e.target.value))} />
      <select value={dietPreference} onChange={e => setDietPreference(e.target.value)}>
        <option value="vegetarian">Vegetarian</option>
        <option value="vegan">Vegan</option>
        <option value="omnivore">Omnivore</option>
      </select>

      <button onClick={handleCheckout} style={{ marginTop: 20, padding: "10px 20px", cursor: "pointer" }}>
        Get My Plan
      </button>
    </main>
  );
}
