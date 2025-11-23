import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { API_URL } from '../api';

// Best practice: .env se key! (REACT_APP_STRIPE_PUBLIC_KEY MUST BE PRESENT in frontend/.env!)
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

function CheckoutForm({ onSuccess, couponId, userEmail }) {
  const stripe = useStripe();
  const elements = useElements();
  const [msg, setMsg] = useState("");
  const [paying, setPaying] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPaying(true);
    setMsg("Processing...");

    // 1. ALWAYS use absolute API_URL in production!
    const res = await fetch(`${API_URL}/api/create-payment-intent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: 199 }) // or coupon.price if dynamic!
    });
    const json = await res.json();
    const clientSecret = json.clientSecret;
    if (!clientSecret) {
      setMsg("Backend error: Stripe client secret missing!");
      setPaying(false);
      return;
    }

    // 2. Confirm the payment!
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: elements.getElement(CardElement) }
    });

    if (result.error) {
      setMsg("Payment failed: " + result.error.message);
      setPaying(false);
    } else if (result.paymentIntent.status === "succeeded") {
      setMsg("Payment Success!");

      // 3. Mark coupon as purchased in DB
      await fetch(`${API_URL}/api/user-purchased`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: userEmail,
          couponId: couponId
        }),
      });

      setPaying(false);
      if (onSuccess) onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit}
      style={{ maxWidth: 360, margin: "40px auto", background: "#f7f6fb", padding: 22, borderRadius: 12 }}>
      <CardElement />
      <button
        disabled={!stripe || paying}
        style={{ marginTop: 16, padding: "10px 28px", borderRadius: 6, background: "#635bff", color: "#fff", border: "none" }}
      >
        {paying ? "Processing..." : "Pay ₹199"}
      </button>
      {msg && <div style={{ marginTop: 12, fontWeight: 700 }}>{msg}</div>}
    </form>
  );
}

export default function Payment({ onSuccess, couponId, userEmail }) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm onSuccess={onSuccess} couponId={couponId} userEmail={userEmail} />
    </Elements>
  );
}
