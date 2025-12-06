const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.generatePlan = functions.https.onRequest(async (req, res) => {
  try {
    const { uid, profile } = req.body || {};
    // Example simple generated plan
    const plan = {
      workouts: ["squat 3x8", "deadlift 3x5"],
      meals: [
        { name: "Breakfast", calories: 400, items: ["oats", "banana"] }
      ]
    };

    // Save to Firestore under users/{uid}/plans
    if (uid) {
      const db = admin.firestore();
      await db.collection("users").doc(uid).collection("plans").add({
        plan,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }

    res.json({ ok: true, plan });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});
