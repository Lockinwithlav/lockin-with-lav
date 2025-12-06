//dashboard/page.jsx

"use client";

import { useState } from "react";
import { generateUserPlan } from "../plan/generatePlan";
import recipes from "../plan/recipes.json";

export default function Dashboard() {
  const [age, setAge] = useState(25);
  const [gender, setGender] = useState("female");
  const [weight, setWeight] = useState(65);
  const [height, setHeight] = useState(165);
  const [activity, setActivity] = useState("moderate");
  const [goal, setGoal] = useState("lose");
  const [daysPerWeek, setDaysPerWeek] = useState(4);
  const [dietPreference, setDietPreference] = useState("vegetarian");

  const [plan, setPlan] = useState(null);

  const generateAndSetPlan = () => {
    const userData = { age, gender, weight, height, activity, goal, daysPerWeek, dietPreference };
    setPlan(generateUserPlan(userData, recipes));
  };

  const sendEmail = async () => {
    const res = await fetch("/api/send-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "your_real_email@example.com",
        userData: { age, gender, weight, height, activity, goal, daysPerWeek, dietPreference },
      }),
    });
    const data = await res.json();
    alert(data.success ? "Email sent!" : "Email failed, check console");
  };

  return (
    <main style={{ padding: 24 }}>
      <h1>Your Personalized Plan</h1>

      <div style={{ marginBottom: 20, padding: 20, border: "1px solid #ccc", borderRadius: 8 }}>
        <h2>Enter Your Information</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            generateAndSetPlan();
          }}
        >
          <input type="number" placeholder="Age" value={age} onChange={(e) => setAge(Number(e.target.value))} />
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="female">Female</option>
            <option value="male">Male</option>
          </select>
          <input type="number" placeholder="Weight (kg)" value={weight} onChange={(e) => setWeight(Number(e.target.value))} />
          <input type="number" placeholder="Height (cm)" value={height} onChange={(e) => setHeight(Number(e.target.value))} />
          <select value={activity} onChange={(e) => setActivity(e.target.value)}>
            <option value="low">Low</option>
            <option value="moderate">Moderate</option>
            <option value="high">High</option>
          </select>
          <select value={goal} onChange={(e) => setGoal(e.target.value)}>
            <option value="lose">Lose Weight</option>
            <option value="maintain">Maintain</option>
            <option value="gain">Gain Muscle</option>
          </select>
          <input type="number" placeholder="Workout Days/Week" value={daysPerWeek} onChange={(e) => setDaysPerWeek(Number(e.target.value))} />
          <select value={dietPreference} onChange={(e) => setDietPreference(e.target.value)}>
            <option value="vegetarian">Vegetarian</option>
            <option value="vegan">Vegan</option>
            <option value="omnivore">Omnivore</option>
          </select>
          <button type="submit">Generate Plan</button>
        </form>
      </div>

      {!plan && <p>No plan generated yet.</p>}
      {plan && (
        <>
          <h2>Calories & Macros</h2>
          <p>Calories: {plan.macros.calories}</p>
          <p>Protein: {plan.macros.protein}g</p>
          <p>Fat: {plan.macros.fat}g</p>
          <p>Carbs: {plan.macros.carbs}g</p>

          <h2>Workout Plan</h2>
          <ul>{plan.workout.map((day, i) => <li key={i}>{day}</li>)}</ul>

          <h2>Meal Plan</h2>
          <ul>{plan.meals.map((meal, i) => <li key={i}>{meal.name}</li>)}</ul>
        </>
      )}

      <button onClick={sendEmail}>Send Test Email</button>
    </main>
  );
}
