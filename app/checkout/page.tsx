import Link from "next/link";
import { MapPin, Ruler, ShieldCheck } from "lucide-react";
import { RazorpayPayment } from "@/components/checkout/razorpay-payment";
import { OrderSummary } from "@/components/checkout/order-summary";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createCheckoutSessionAction } from "@/features/checkout/actions";
import { getCheckoutView } from "@/features/checkout/data";
import { formatMoney } from "@/features/checkout/price-engine";
import { siteConfig } from "@/lib/config/site";

export const metadata = { title: "Checkout" };
export const dynamic = "force-dynamic";

const steps = ["Cart Review", "Delivery Address", "Billing Address", "Measurement Profile", "Order Summary", "Payment"];

export default async function CheckoutPage() {
  const { activeItems, price, addresses, measurements, checkoutSession } = await getCheckoutView();
  const defaultAddress = addresses[0];
  const defaultMeasurement = measurements.find((item) => item.isDefault) ?? measurements[0];

  return (
    <main className="py-8 md:py-12">
      <div className={`${siteConfig.maxWidthClass} grid gap-8 lg:grid-cols-[1fr_360px]`}>
        <section className="grid gap-5">
          <div>
            <p className="text-sm font-semibold text-[#c21874]">Secure Checkout</p>
            <h1 className="text-3xl font-semibold text-[#241820]">Complete your FIT & Match checkout</h1>
          </div>
          <ol className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {steps.map((step, index) => (
              <li className="rounded-full border border-[#eadde6] bg-white px-3 py-2 text-xs font-semibold text-[#756871]" key={step}>
                {index + 1}. {step}
              </li>
            ))}
          </ol>
          <Card className="grid gap-3 p-5">
            <h2 className="text-lg font-semibold text-[#241820]">1. Cart Review</h2>
            {activeItems.length === 0 ? (
              <p className="text-sm text-[#756871]">Your cart is empty. <Link className="font-semibold text-[#c21874]" href="/search">Continue shopping</Link>.</p>
            ) : (
              activeItems.map((item) => (
                <div className="flex items-center justify-between gap-3 border-b border-[#f4eaf0] py-3 last:border-0" key={item.id}>
                  <div>
                    <p className="font-semibold text-[#241820]">{item.product.name}</p>
                    <p className="text-sm text-[#756871]">Qty {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-[#241820]">{formatMoney(Number(item.unitPrice) * item.quantity)}</p>
                </div>
              ))
            )}
          </Card>
          <form action={createCheckoutSessionAction} className="grid gap-5">
            <Card className="grid gap-4 p-5">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-[#241820]"><MapPin className="h-5 w-5 text-[#c21874]" />2. Delivery Address</h2>
              {addresses.length === 0 ? (
                <p className="text-sm text-[#756871]">Add an address from <Link className="font-semibold text-[#c21874]" href="/profile">My Profile</Link> before checkout.</p>
              ) : (
                <div className="grid gap-3">
                  {addresses.map((address) => (
                    <label className="flex gap-3 rounded-2xl border border-[#eadde6] p-4" key={address.id}>
                      <input defaultChecked={address.id === defaultAddress?.id} name="deliveryAddressId" type="radio" value={address.id} />
                      <span className="text-sm text-[#756871]">
                        <strong className="block text-[#241820]">{address.fullName}</strong>
                        {address.house}, {address.street}, {address.city}, {address.state} - {address.pincode}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </Card>
            <Card className="grid gap-4 p-5">
              <h2 className="text-lg font-semibold text-[#241820]">3. Billing Address</h2>
              <label className="flex items-center gap-3 text-sm font-semibold text-[#241820]">
                <input defaultChecked name="billingSameAsDelivery" type="checkbox" />
                Billing same as delivery
              </label>
              <p className="text-sm text-[#756871]">Separate billing address fields are supported by the server and can be expanded in Phase 6 order workflows.</p>
            </Card>
            <Card className="grid gap-4 p-5">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-[#241820]"><Ruler className="h-5 w-5 text-[#c21874]" />4. Measurement Profile</h2>
              {measurements.length === 0 ? (
                <p className="text-sm text-[#756871]">No saved measurements yet. <Link className="font-semibold text-[#c21874]" href="/profile">Create a measurement profile</Link>.</p>
              ) : (
                <div className="grid gap-3">
                  {measurements.map((measurement) => (
                    <label className="rounded-2xl border border-[#eadde6] p-4" key={measurement.id}>
                      <span className="flex items-center gap-3">
                        <input defaultChecked={measurement.id === defaultMeasurement?.id} name="measurementProfileId" type="radio" value={measurement.id} />
                        <strong className="text-[#241820]">{measurement.profileName}</strong>
                      </span>
                      <span className="mt-2 block text-sm text-[#756871]">
                        Bust {measurement.bust ? `${measurement.bust}` : "-"} · Waist {measurement.waist ? `${measurement.waist}` : "-"} · Hip {measurement.hip ? `${measurement.hip}` : "-"}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </Card>
            <Card className="grid gap-4 p-5">
              <h2 className="text-lg font-semibold text-[#241820]">Gift Note</h2>
              <textarea className="min-h-24 rounded-3xl border border-[#eadde6] p-4 outline-none focus:border-[#c21874] focus:ring-4 focus:ring-[#fde8f3]" maxLength={280} name="giftMessage" placeholder="Optional note" />
            </Card>
            <Button disabled={!defaultAddress || activeItems.length === 0} size="lg" type="submit">
              Save Checkout Details
            </Button>
          </form>
        </section>
        <aside className="grid content-start gap-4 lg:sticky lg:top-24">
          <OrderSummary price={price} />
          <Card className="grid gap-4 p-5">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-[#241820]"><ShieldCheck className="h-5 w-5 text-[#c21874]" />6. Payment</h2>
            <p className="text-sm leading-6 text-[#756871]">Payments are verified server-side with Razorpay signatures before any payment is marked successful.</p>
            <RazorpayPayment checkoutSessionId={checkoutSession?.id} disabled={!checkoutSession || activeItems.length === 0} />
          </Card>
        </aside>
      </div>
    </main>
  );
}
