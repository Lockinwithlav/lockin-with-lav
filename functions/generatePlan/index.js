const functions = require("firebase-functions");
const admin = require("firebase-admin");
const fetch = require("node-fetch"); // or use openai client
admin.initializeApp();

exports.generatePlan = functions.https.onCall(async (data, context) => {
  const { uid, profile } = data;
  if (!uid || !profile) throw new functions.https.HttpsError('invalid-argument', 'Missing uid/profile');

  // Build the prompt using the profile (see earlier assistant prompt)
  const system = `You are a certified nutrition and fitness coach. ... format as JSON ...`;
  const userPrompt = `
  Profile: ${JSON.stringify(profile)}
  Required: JSON with calories, macros_g, weekly_workout_plan, 7_day_meal_plan, grocery_list, notes
  `;

  // Call OpenAI
  const resp = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-5-thinking-mini",
      messages: [{ role: "system", content: system }, { role: "user", content: userPrompt }],
      max_tokens: 2000,
      temperature: 0.0
    })
  });

  const jsonResp = await resp.json();
  const assistantContent = jsonResp.choices?.[0]?.message?.content;

  let plan;
  try { plan = JSON.parse(assistantContent); }
  catch(e) { plan = { raw: assistantContent, error: "parse_failed" }; }

  const planRef = admin.firestore().collection('users').doc(uid).collection('plans').doc();
  await planRef.set({ profile, plan, generatedAt: admin.firestore.FieldValue.serverTimestamp() });

  return { ok: true, planId: planRef.id, plan };
});
