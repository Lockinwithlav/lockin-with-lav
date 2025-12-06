"use client";
import { useState, useEffect } from "react";
import { generateUserPlan } from "../plan/generatePlan";
import recipes from "../plan/recipes.json";

export default function Dashboard() {
  const [plan, setPlan] = useState<any>(null);

  useEffect(() => {
    const userData = {
      age: 25,
      gender: "female",
      weight: 65,
      height: 165,
      activity: "moderate",
      goal: "lose",
      daysPerWeek: 4,
      dietPreference: "vegetarian"
    };
    setPlan(generateUserPlan(userData, recipes));
  }, []);

  if (!plan) return <p>Generating your plan...</p>;

  return (
    <main style={{ padding: 24 }}>
      <h1>Your Personalized Plan</h1>

      <h2>Calories & Macros</h2>
      <p>Calories: {plan.macros.calories}</p>
      <p>Protein: {plan.macros.protein}g</p>
      <p>Fat: {plan.macros.fat}g</p>
      <p>Carbs: {plan.macros.carbs}g</p>

      <h2>Workout Plan</h2>
      <ul>{plan.workout.map((day, i) => <li key={i}>{day}</li>)}</ul>

      <h2>Meal Plan</h2>
      <ul>{plan.meals.map((meal, i) => <li key={i}>{meal.name}</li>)}</ul>

      {/* Test Email Button */}
      <button
        onClick={async () => {
          const res = await fetch("/api/send-plan", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: "your_real_email@example.com" }),
          });
          const data = await res.json();
          console.log(data);
          alert(data.success ? "Email sent!" : "Email failed, check console");
        }}
        style={{ marginTop: 20, padding: "10px 20px", cursor: "pointer" }}
      >
        Send Test Email
      </button>
    </main>
  );
}
