"use client";

import { useEffect, useState } from "react";

export default function CheckoutSuccess() {
  const [sessionId, setSessionId] = useState(null);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("session_id");
    setSessionId(id);

    if (id) {
      // Call your API to send the plan email
      fetch("/api/send-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: id }),
      })
        .then(res => res.json())
        .then(data => setEmailSent(data.success))
        .catch(() => setEmailSent(false));
    }
  }, []);

  return (
    <main style={{ padding: 24 }}>
      <h1>Payment Successful!</h1>
      {sessionId && <p>Session ID: {sessionId}</p>}
      <p>
        {emailSent
          ? "Your personalized plan has been emailed to you."
          : "Preparing your personalized plan..."}
      </p>
    </main>
  );
}
