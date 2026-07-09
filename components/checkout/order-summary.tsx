import { formatMoney, type PriceSummary } from "@/features/checkout/price-engine";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function OrderSummary({
  price,
  checkoutHref,
}: {
  price: PriceSummary;
  checkoutHref?: string;
}) {
  return (
    <Card className="grid gap-4 p-5">
      <h2 className="text-lg font-semibold text-[#241820]">Order Summary</h2>
      <SummaryLine label="Subtotal" value={formatMoney(price.subtotal)} />
      <SummaryLine label="Discount" value={`-${formatMoney(price.discount)}`} />
      <SummaryLine label="Coupon" value={`-${formatMoney(price.couponDiscount)}`} />
      <SummaryLine label="Delivery" value={price.deliveryCharge === 0 ? "Free" : formatMoney(price.deliveryCharge)} />
      <SummaryLine label="Tax" value={price.tax === 0 ? "Future-ready" : formatMoney(price.tax)} />
      <div className="border-t border-[#eadde6] pt-4">
        <SummaryLine strong label="Grand total" value={formatMoney(price.grandTotal)} />
      </div>
      {checkoutHref ? (
        <ButtonLink className="w-full" href={checkoutHref} size="lg">
          Continue to Checkout
        </ButtonLink>
      ) : null}
    </Card>
  );
}

function SummaryLine({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={`flex items-center justify-between gap-3 ${strong ? "text-lg font-bold text-[#241820]" : "text-sm text-[#756871]"}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
