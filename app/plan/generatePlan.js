// app/plan/generatePlan.ts

interface UserData {
  age: number;
  gender: "male" | "female";
  weight: number; // kg
  height: number; // cm
  activity: "sedentary" | "light" | "moderate" | "active" | "veryActive";
  goal: "lose" | "maintain" | "gain";
  daysPerWeek: 3 | 4 | 5 | 6;
  dietPreference?: string;
}

interface Macros {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

interface Meal {
  id: number;
  name: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  dietType?: string;
}

export function calculateCalories(user: UserData): Macros {
  let bmr = user.gender === "male"
    ? 10 * user.weight + 6.25 * user.height - 5 * user.age + 5
    : 10 * user.weight + 6.25 * user.height - 5 * user.age - 161;

  const activityMultiplier: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    veryActive: 1.9,
  };

  let calories = bmr * activityMultiplier[user.activity];

  if (user.goal === "lose") calories -= 500;
  if (user.goal === "gain") calories += 500;

  const protein = user.weight * 2; // grams
  const fat = calories * 0.25 / 9;
  const carbs = (calories - protein * 4 - fat * 9) / 4;

  return {
    calories: Math.round(calories),
    protein: Math.round(protein),
    fat: Math.round(fat),
    carbs: Math.round(carbs),
  };
}

export function generateWorkoutPlan(days: number): string[] {
  const plans: Record<number, string[]> = {
    3: ["Full Body 1", "Full Body 2", "Full Body 3"],
    4: ["Upper Body", "Lower Body", "Upper Body", "Lower Body"],
    5: ["Push", "Pull", "Legs", "Push", "Pull"],
    6: ["Push", "Pull", "Legs", "Push", "Pull", "Legs"],
  };
  return plans[days] || plans[3];
}

export function generateMealPlan(macros: Macros, recipes: Meal[], dietPreference?: string): Meal[] {
  let filtered = dietPreference
    ? recipes.filter(r => r.dietType === dietPreference)
    : recipes;

  let meals: Meal[] = [];
  let remainingCalories = macros.calories;

  for (const meal of filtered) {
    if (remainingCalories <= 0) break;
    meals.push(meal);
    remainingCalories -= meal.calories;
  }

  return meals;
}

export function generateUserPlan(user: UserData, recipes: Meal[]) {
  const macros = calculateCalories(user);
  const workout = generateWorkoutPlan(user.daysPerWeek);
  const meals = generateMealPlan(macros, recipes, user.dietPreference);
  return { macros, workout, meals };
}
