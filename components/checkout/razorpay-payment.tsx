"use client";

import { useState } from "react";
import { CreditCard } from "lucide-react";
import { clientEnv } from "@/lib/config/client-env";
import { Button } from "@/components/ui/button";

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpaySuccessResponse) => void;
  modal: { ondismiss: () => void };
};

type RazorpaySuccessResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type RazorpayFailureResponse = {
  error?: {
    code?: string;
    description?: string;
  };
};

type RazorpayCheckout = {
  open: () => void;
  on: (event: "payment.failed", handler: (response: RazorpayFailureResponse) => void) => void;
};

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayCheckout;
  }
}

async function loadRazorpay(): Promise<boolean> {
  if (window.Razorpay) return true;
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function RazorpayPayment({ checkoutSessionId, disabled }: { checkoutSessionId?: string; disabled: boolean }) {
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const gatewayConfigured = Boolean(clientEnv.NEXT_PUBLIC_RAZORPAY_KEY_ID);

  async function pay() {
    if (!gatewayConfigured) {
      setMessage("Payment gateway is being configured.");
      return;
    }
    if (!checkoutSessionId) {
      setMessage("Create checkout first.");
      return;
    }
    setLoading(true);
    setMessage(null);
    const ready = await loadRazorpay();
    if (!ready || !window.Razorpay) {
      setLoading(false);
      setMessage("Payment gateway could not be loaded.");
      return;
    }

    const orderResponse = await fetch("/api/checkout/razorpay/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ checkoutSessionId }),
    });
    if (!orderResponse.ok) {
      setLoading(false);
      setMessage("Unable to start payment.");
      return;
    }
    const order = (await orderResponse.json()) as {
      orderId: string;
      amount: number;
      currency: string;
    };
    const checkout = new window.Razorpay({
      key: clientEnv.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "FIT & MATCH",
      description: "FIT & MATCH checkout",
      order_id: order.orderId,
      handler: async (response) => {
        const verify = await fetch("/api/checkout/razorpay/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ checkoutSessionId, ...response }),
        });
        setLoading(false);
        setMessage(verify.ok ? "Payment successful. Your order draft is secured." : "Payment verification failed.");
      },
      modal: { ondismiss: () => setLoading(false) },
    });
    checkout.on("payment.failed", async (response) => {
      await fetch("/api/checkout/razorpay/failure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          checkoutSessionId,
          razorpay_order_id: order.orderId,
          errorCode: response.error?.code,
          errorDescription: response.error?.description,
        }),
      });
      setLoading(false);
      setMessage("Payment failed. You can retry when ready.");
    });
    checkout.open();
  }

  return (
    <div className="grid gap-3">
      <Button className="w-full" disabled={disabled || loading || !gatewayConfigured} onClick={pay} size="lg" type="button">
        <CreditCard className="mr-2 h-5 w-5" />
        {loading ? "Starting Payment..." : gatewayConfigured ? "Pay Securely with Razorpay" : "Payment Setup Pending"}
      </Button>
      {message ? <p className="text-sm font-semibold text-[#9f125d]" role="status">{message}</p> : null}
    </div>
  );
}
