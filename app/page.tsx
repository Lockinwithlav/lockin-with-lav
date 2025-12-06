// app/page.tsx (React component)
"use client";

"use client";

import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [age, setAge] = useState(26);
  const [gender, setGender] = useState("female");
  const [weight, setWeight] = useState(65);
  const [height, setHeight] = useState(165);
  const [activity, setActivity] = useState("moderate");
  const [goal, setGoal] = useState("lose");
  const [daysPerWeek, setDaysPerWeek] = useState(4);
  const [dietPreference, setDietPreference] = useState("vegetarian");

  const handleCheckout = async () => {
    const res = await fetch("/api/create-checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID,
        email,
        userData: { age, gender, weight, height, activity, goal, daysPerWeek, dietPreference },
      }),
    });
    const data = await res.json();
    window.location.href = data.url;
  };

  return (
    <main style={{ maxWidth: 600, margin: "0 auto", padding: 24, fontFamily: "sans-serif" }}>
      <h1 style={{ textAlign: "center", marginBottom: 24 }}>Lock In With Lav</h1>
      <p style={{ textAlign: "center", marginBottom: 24 }}>
        Answer the following questions to receive your personalized plan.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <label>
          What is your email?
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ display: "block", width: "100%", padding: 10, marginTop: 4, borderRadius: 6, border: "1px solid #ccc" }}
          />
        </label>

        <label>
          How old are you?
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
            style={{ display: "block", width: "100%", padding: 10, marginTop: 4, borderRadius: 6, border: "1px solid #ccc" }}
          />
        </label>

        <label>
          What is your gender?
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            style={{ display: "block", width: "100%", padding: 10, marginTop: 4, borderRadius: 6 }}
          >
            <option value="female">Female</option>
            <option value="male">Male</option>
          </select>
        </label>

        <label>
          What is your weight (kg)?
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(Number(e.target.value))}
            style={{ display: "block", width: "100%", padding: 10, marginTop: 4, borderRadius: 6, border: "1px solid #ccc" }}
          />
        </label>

        <label>
          What is your height (cm)?
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(Number(e.target.value))}
            style={{ display: "block", width: "100%", padding: 10, marginTop: 4, borderRadius: 6, border: "1px solid #ccc" }}
          />
        </label>

        <label>
          How active are you?
          <select
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            style={{ display: "block", width: "100%", padding: 10, marginTop: 4, borderRadius: 6 }}
          >
            <option value="low">Low</option>
            <option value="moderate">Moderate</option>
            <option value="high">High</option>
          </select>
        </label>

        <label>
          What is your goal?
          <select
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            style={{ display: "block", width: "100%", padding: 10, marginTop: 4, borderRadius: 6 }}
          >
            <option value="lose">Lose Weight</option>
            <option value="maintain">Maintain</option>
            <option value="gain">Gain Muscle</option>
          </select>
        </label>

        <label>
          How many days per week do you work out?
          <input
            type="number"
            value={daysPerWeek}
            onChange={(e) => setDaysPerWeek(Number(e.target.value))}
            style={{ display: "block", width: "100%", padding: 10, marginTop: 4, borderRadius: 6, border: "1px solid #ccc" }}
          />
        </label>

        <label>
          What is your diet preference?
          <select
            value={dietPreference}
            onChange={(e) => setDietPreference(e.target.value)}
            style={{ display: "block", width: "100%", padding: 10, marginTop: 4, borderRadius: 6 }}
          >
            <option value="vegetarian">Vegetarian</option>
            <option value="vegan">Vegan</option>
            <option value="omnivore">Omnivore</option>
          </select>
        </label>

        <button
          onClick={handleCheckout}
          style={{
            marginTop: 24,
            padding: "12px 24px",
            backgroundColor: "#ff6b6b",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            fontSize: 16,
          }}
        >
          Get My Plan
        </button>
      </div>
    </main>
  );
}
