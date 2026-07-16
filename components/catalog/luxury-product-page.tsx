import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  CheckCircle2,
  Gem,
  Heart,
  Maximize2,
  Scissors,
  Share2,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
  WandSparkles,
  ZoomIn,
} from "lucide-react";
import type { getProductBySlug, getRelatedProducts, getWishlistProductIds } from "@/features/catalog/data";
import type { getProductFitRecommendation } from "@/features/fit/recommendations";
import { ProductSection } from "@/components/catalog/product-section";
import { FitRecommendationPanel } from "@/components/fit/fit-recommendation-panel";
import { Button } from "@/components/ui/button";
import { addToCartAction } from "@/features/checkout/actions";
import { toggleWishlistAction } from "@/features/catalog/actions";
import { mediaUrl } from "@/lib/media/asset";
import { siteConfig } from "@/lib/config/site";

type ProductDetailData = NonNullable<Awaited<ReturnType<typeof getProductBySlug>>>;
type RelatedProductsData = Awaited<ReturnType<typeof getRelatedProducts>>;
type WishlistIdsData = Awaited<ReturnType<typeof getWishlistProductIds>>;
type FitRecommendationData = Awaited<ReturnType<typeof getProductFitRecommendation>>;

type LuxuryProductPageProps = {
  product: ProductDetailData;
  related: RelatedProductsData;
  wishlistIds: WishlistIdsData;
  fitRecommendation: FitRecommendationData;
};

const editorialImages = [
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1400&q=84",
  "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1400&q=84",
  "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1400&q=84",
  "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1400&q=84",
] as const;

const accessoryRecommendations = [
  { title: "Pearl Jewellery", text: "Soft shine for a premium finish", icon: Gem },
  { title: "Mini Handbag", text: "Elegant carry for day or evening", icon: ShoppingBag },
  { title: "Block Heels", text: "Comfortable height and graceful posture", icon: Sparkles },
  { title: "Soft Dupatta", text: "Adds movement and traditional polish", icon: Scissors },
  { title: "Hair Pins", text: "Simple detail for styled occasions", icon: WandSparkles },
] as const;

const customerGallery = [
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80",
] as const;

const faqs = [
  ["Can I customise this dress?", "Yes. Fabric, colour, neckline, sleeve, length, embroidery, and border choices can be prepared for custom stitching."],
  ["How does FIT Match help?", "FIT Match uses your measurement profile and style preferences to recommend a size, fit direction, and better custom choices."],
  ["Can I use my saved measurements?", "Yes. Your saved measurement profile can be selected during cart or checkout for custom-fit products."],
  ["Is alteration support available?", "Alteration support is planned as part of the custom stitching experience."],
] as const;

function money(value: unknown): string {
  return `₹${Number(value).toLocaleString("en-IN")}`;
}

export function LuxuryProductPage({ product, related, wishlistIds, fitRecommendation }: LuxuryProductPageProps) {
  const primaryImage = mediaUrl(product.images[0]);
  const gallery = product.images.length > 0
    ? product.images.map((image) => ({ src: mediaUrl(image), alt: image.alt ?? product.name }))
    : [{ src: primaryImage, alt: product.name }];
  const enrichedGallery = [...gallery, ...editorialImages.map((src, index) => ({ src, alt: `${product.name} editorial view ${index + 1}` }))];
  const selectedFabric = product.fabrics[0]?.name ?? "Premium Silk";
  const selectedColour = product.colors[0]?.name ?? "Rose Pink";
  const selectedColourHex = product.colors[0]?.hexCode ?? "#c21874";
  const selectedSize = fitRecommendation?.recommendation.recommendedSize ?? product.sizes[0]?.name ?? "Custom Fit";

  return (
    <main className="bg-[#fffafd] pb-24 pt-6 md:pb-14 md:pt-10">
      <div className={`${siteConfig.maxWidthClass} grid gap-12`}>
        <section className="grid gap-8 xl:grid-cols-[1.08fr_0.92fr]">
          <EditorialGallery productName={product.name} images={enrichedGallery} />
          <OrderPanel
            product={product}
            wishlistIds={wishlistIds}
            fitRecommendation={fitRecommendation}
            selectedSize={selectedSize}
            selectedFabric={selectedFabric}
            selectedColour={selectedColour}
          />
        </section>

        <FitMatchConsultation fitRecommendation={fitRecommendation} selectedSize={selectedSize} />
        <WhyThisFitsYou product={product} selectedFabric={selectedFabric} selectedColour={selectedColour} />
        <ProductDetails product={product} />
        <FabricStory product={product} selectedFabric={selectedFabric} />
        <ColourStory selectedColour={selectedColour} selectedColourHex={selectedColourHex} />
        <StyleDetails product={product} />
        <CustomiseYourDress product={product} />
        <CompleteTheLook />
        <RecommendedAccessories />
        <CustomerGallery productName={product.name} />
        <Reviews product={product} />
        <FaqSection />
        <DeliveryPromise product={product} />
        <ProductSection title="More From This Edit" products={related} wishlistIds={wishlistIds} />
      </div>
    </main>
  );
}

function EditorialGallery({ productName, images }: { productName: string; images: { src: string; alt: string }[] }) {
  return (
    <section className="grid gap-4">
      <div className="flex snap-x gap-4 overflow-x-auto rounded-[2rem]">
        {images.slice(0, 5).map((image, index) => (
          <div key={`${image.src}-${index}`} className="relative min-h-[70svh] min-w-full snap-start overflow-hidden rounded-[2rem] bg-[#241820] shadow-[0_28px_90px_rgba(112,36,73,0.14)]">
            <Image src={image.src} alt={image.alt} fill priority={index === 0} sizes="(min-width: 1280px) 56vw, 100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#241820]/72 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-white/20 bg-white/14 p-4 text-white backdrop-blur-xl">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/60">Editorial Gallery</p>
                <h1 className="mt-2 text-3xl font-semibold">{productName}</h1>
              </div>
              <div className="flex gap-2">
                <Link href={image.src} target="_blank" className="inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-primary">
                  <ZoomIn className="mr-2 h-4 w-4" />
                  Zoom
                </Link>
                <Link href={image.src} target="_blank" className="inline-flex items-center rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white">
                  <Maximize2 className="mr-2 h-4 w-4" />
                  Fullscreen
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-4 gap-2 md:grid-cols-5">
        {images.slice(0, 5).map((image, index) => (
          <a href={image.src} target="_blank" className="relative aspect-square overflow-hidden rounded-2xl bg-white shadow-sm" key={`${image.alt}-${index}`}>
            <Image src={image.src} alt={image.alt} fill sizes="20vw" className="object-cover" />
          </a>
        ))}
      </div>
    </section>
  );
}

function OrderPanel({
  product,
  wishlistIds,
  fitRecommendation,
  selectedSize,
  selectedFabric,
  selectedColour,
}: {
  product: ProductDetailData;
  wishlistIds: WishlistIdsData;
  fitRecommendation: FitRecommendationData;
  selectedSize: string;
  selectedFabric: string;
  selectedColour: string;
}) {
  return (
    <aside className="sticky top-20 h-fit rounded-[2rem] border border-primary/10 bg-white p-5 shadow-[0_24px_70px_rgba(112,36,73,0.1)] lg:p-7">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">{product.brand}</p>
      <h2 className="mt-3 text-4xl font-semibold leading-tight text-[#241820]">{product.name}</h2>
      <p className="mt-4 text-sm leading-7 text-[#725f69]">{product.shortDescription}</p>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <span className="text-3xl font-bold text-[#241820]">{money(product.offerPrice ?? product.price)}</span>
        {product.offerPrice ? <span className="text-lg text-[#756871] line-through">{money(product.price)}</span> : null}
        {product.discountPercent > 0 ? <span className="rounded-full bg-[#fde8f3] px-3 py-1 text-sm font-bold text-[#9f125d]">{product.discountPercent}% OFF</span> : null}
      </div>
      <div className="mt-5 rounded-3xl bg-[#fff8fb] p-4">
        <p className="text-sm font-semibold text-[#241820]">Preview summary</p>
        <div className="mt-3 grid gap-2 text-sm text-[#725f69]">
          <PanelLine label="Size" value={selectedSize} />
          <PanelLine label="Fabric" value={selectedFabric} />
          <PanelLine label="Colour" value={selectedColour} />
          <PanelLine label="Stitching" value={product.estimatedStitchingTime ?? "7-10 days"} />
          <PanelLine label="Delivery" value={product.estimatedDelivery ?? "Pan India delivery"} />
        </div>
      </div>
      <div className="mt-5 flex flex-col gap-3">
        <form action={addToCartAction}>
          <input name="productId" type="hidden" value={product.id} />
          <input name="quantity" type="hidden" value="1" />
          {fitRecommendation?.recommendedVariant?.id ? <input name="productVariantId" type="hidden" value={fitRecommendation.recommendedVariant.id} /> : null}
          {fitRecommendation?.fitProfile.measurementProfileId ? <input name="measurementProfileId" type="hidden" value={fitRecommendation.fitProfile.measurementProfileId} /> : null}
          <Button className="min-h-12 w-full rounded-full" type="submit">
            <ShoppingBag className="mr-2 h-5 w-5" />
            Add to Cart
          </Button>
        </form>
        <div className="grid grid-cols-2 gap-3">
          <form action={toggleWishlistAction}>
            <input name="productId" type="hidden" value={product.id} />
            <Button className="min-h-12 w-full rounded-full" type="submit" variant="secondary">
              <Heart className={`mr-2 h-5 w-5 ${wishlistIds.has(product.id) ? "fill-white" : ""}`} />
              Wishlist
            </Button>
          </form>
          <Button className="min-h-12 rounded-full" type="button" variant="secondary">
            <Share2 className="mr-2 h-5 w-5" />
            Share
          </Button>
        </div>
      </div>
    </aside>
  );
}

function FitMatchConsultation({ fitRecommendation, selectedSize }: { fitRecommendation: FitRecommendationData; selectedSize: string }) {
  const score = fitRecommendation?.recommendation.score ? `${fitRecommendation.recommendation.score}%` : "96%";
  return (
    <section className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
      <div className="rounded-[2rem] bg-[#241820] p-6 text-white shadow-[0_24px_70px_rgba(36,24,32,0.18)]">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/55">FIT Match Score</p>
        <p className="mt-5 text-7xl font-semibold">{score}</p>
        <p className="mt-3 text-white/68">Recommended size: <span className="font-semibold text-white">{selectedSize}</span></p>
        <p className="mt-2 text-white/68">Alternative size: Custom Fit</p>
      </div>
      <div className="rounded-[2rem] border border-primary/10 bg-white p-6 shadow-[0_18px_50px_rgba(112,36,73,0.08)]">
        <h2 className="text-3xl font-semibold text-[#241820]">Why This Fits You</h2>
        <div className="mt-5">
          <FitRecommendationPanel data={fitRecommendation} />
        </div>
      </div>
    </section>
  );
}

function WhyThisFitsYou({ product, selectedFabric, selectedColour }: { product: ProductDetailData; selectedFabric: string; selectedColour: string }) {
  const reasons = [
    `The ${selectedFabric} finish supports graceful movement and comfort.`,
    `${selectedColour} works beautifully for premium day-to-evening styling.`,
    product.estimatedStitchingTime ?? "Custom stitching is planned around your selected measurements.",
  ];
  return (
    <EditorialSection eyebrow="Consultation" title="Why This Fits You" subtitle="A boutique-style explanation before you customise or add to cart.">
      <div className="grid gap-4 md:grid-cols-3">
        {reasons.map((reason) => (
          <div className="rounded-3xl border border-primary/10 bg-white p-5 shadow-sm" key={reason}>
            <CheckCircle2 className="h-6 w-6 text-primary" />
            <p className="mt-4 text-sm leading-7 text-[#725f69]">{reason}</p>
          </div>
        ))}
      </div>
    </EditorialSection>
  );
}

function ProductDetails({ product }: { product: ProductDetailData }) {
  return (
    <EditorialSection eyebrow="Product details" title="Made for Elegant Everyday Luxury" subtitle={product.longDescription ?? product.shortDescription}>
      <div className="grid gap-4 md:grid-cols-4">
        <Metric title="Brand" value={product.brand} />
        <Metric title="Category" value={product.category.name} />
        <Metric title="Collection" value={product.collection?.name ?? "FIT & MATCH edit"} />
        <Metric title="SKU" value={product.sku} />
      </div>
    </EditorialSection>
  );
}

function FabricStory({ product, selectedFabric }: { product: ProductDetailData; selectedFabric: string }) {
  const fabric = product.fabrics[0];
  const story = [
    ["Feel", "Soft touch with an elegant fall"],
    ["Texture", fabric?.description ?? "Premium texture selected by FIT & MATCH"],
    ["Weight", "Light to medium"],
    ["Breathability", "Comfortable for long wear"],
    ["Maintenance", fabric?.careInstructions ?? "Gentle care recommended"],
    ["Occasion", "Office, festival, party, and custom events"],
    ["Weather", "Best for mild to warm Indian weather"],
  ] as const;
  return (
    <EditorialSection eyebrow="Fabric story" title={`${selectedFabric} Story`} subtitle="Understand the feel before you choose the final custom finish.">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {story.map(([label, value]) => <Metric key={label} title={label} value={value} />)}
      </div>
    </EditorialSection>
  );
}

function ColourStory({ selectedColour, selectedColourHex }: { selectedColour: string; selectedColourHex: string }) {
  const suggestions = [
    ["Best occasions", "Wedding brunch, office event, festival evening"],
    ["Jewellery", "Pearls, gold hoops, soft kundan"],
    ["Footwear", "Nude heels, gold flats, block sandals"],
    ["Season", "Spring, festive winter, evening summer"],
  ] as const;
  return (
    <EditorialSection eyebrow="Colour story" title={`${selectedColour} Styling Notes`} subtitle="A stylist-ready guide for completing the outfit beautifully.">
      <div className="grid gap-4 lg:grid-cols-[0.75fr_1.25fr]">
        <div className="rounded-[2rem] border border-primary/10 bg-white p-6 shadow-sm">
          <span className="block h-32 rounded-[1.5rem] shadow-inner" style={{ backgroundColor: selectedColourHex }} />
          <h3 className="mt-5 text-2xl font-semibold text-[#241820]">{selectedColour}</h3>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {suggestions.map(([label, value]) => <Metric key={label} title={label} value={value} />)}
        </div>
      </div>
    </EditorialSection>
  );
}

function StyleDetails({ product }: { product: ProductDetailData }) {
  const tags = product.tags.length ? product.tags.map((tag) => tag.name) : ["Premium", "Custom Fit", "Elegant", "Occasion Ready"];
  return (
    <EditorialSection eyebrow="Style details" title="Designed Around Your Moment" subtitle="Use these cues to understand where this piece belongs in your wardrobe.">
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span className="rounded-full border border-primary/10 bg-white px-4 py-2 text-sm font-semibold text-[#3a2530]" key={tag}>{tag}</span>
        ))}
      </div>
    </EditorialSection>
  );
}

function CustomiseYourDress({ product }: { product: ProductDetailData }) {
  const fabrics = product.fabrics.length ? product.fabrics.map((fabric) => fabric.name) : ["Cotton", "Silk", "Linen", "Georgette"];
  const colours = product.colors.length ? product.colors.map((color) => ({ name: color.name, hex: color.hexCode })) : [{ name: "Rose Pink", hex: "#c21874" }];
  return (
    <EditorialSection eyebrow="Customise your dress" title="Choose Every Beautiful Detail" subtitle="Demo selectors show how the final custom product consultation will feel.">
      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="grid gap-4 md:grid-cols-2">
          <SelectorGroup title="Fabric" items={fabrics} />
          <SelectorGroup title="Neck" items={["Round", "V Neck", "Boat", "Square", "Sweetheart"]} />
          <SelectorGroup title="Sleeves" items={["Sleeveless", "Half", "Three Quarter", "Full", "Bell"]} />
          <SelectorGroup title="Length" items={["Knee", "Calf", "Ankle", "Floor Length"]} />
          <SelectorGroup title="Embroidery" items={["None", "Light", "Premium", "Festive"]} />
          <SelectorGroup title="Border" items={["Clean", "Silk", "Lace", "Contrast"]} />
        </div>
        <div className="rounded-[2rem] bg-[#241820] p-6 text-white">
          <p className="text-sm font-semibold">Preview summary</p>
          <div className="mt-5 grid gap-3">
            <PanelLine label="Fabric" value={fabrics[0] ?? "Silk"} />
            <div className="flex flex-wrap gap-2">
              {colours.map((color) => (
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-sm" key={color.name}>
                  <span className="h-4 w-4 rounded-full border border-white/20" style={{ backgroundColor: color.hex }} />
                  {color.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </EditorialSection>
  );
}

function CompleteTheLook() {
  return (
    <EditorialSection eyebrow="Complete the look" title="Stylist Pairings" subtitle="Demo recommendations for a complete boutique consultation.">
      <div className="grid gap-4 md:grid-cols-5">
        {accessoryRecommendations.map((item) => {
          const Icon = item.icon;
          return (
            <div className="rounded-3xl border border-primary/10 bg-white p-5 shadow-sm" key={item.title}>
              <Icon className="h-6 w-6 text-primary" />
              <h3 className="mt-4 font-semibold text-[#241820]">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#725f69]">{item.text}</p>
            </div>
          );
        })}
      </div>
    </EditorialSection>
  );
}

function RecommendedAccessories() {
  return (
    <EditorialSection eyebrow="Recommended accessories" title="Accessories Chosen for This Look" subtitle="Small finishing pieces that make the outfit feel styled, not just purchased.">
      <div className="grid gap-4 md:grid-cols-5">
        {accessoryRecommendations.map((item) => {
          const Icon = item.icon;
          return (
            <div className="rounded-3xl border border-primary/10 bg-white p-5 shadow-sm" key={`recommended-${item.title}`}>
              <Icon className="h-6 w-6 text-primary" />
              <h3 className="mt-4 font-semibold text-[#241820]">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#725f69]">{item.text}</p>
            </div>
          );
        })}
      </div>
    </EditorialSection>
  );
}

function CustomerGallery({ productName }: { productName: string }) {
  return (
    <EditorialSection eyebrow="Customer gallery" title="Styled by Women Across India" subtitle="Demo gallery with different styling moods and body types.">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {customerGallery.map((src, index) => (
          <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-white shadow-sm" key={src}>
            <Image src={src} alt={`${productName} customer styling ${index + 1}`} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
          </div>
        ))}
      </div>
    </EditorialSection>
  );
}

function Reviews({ product }: { product: ProductDetailData }) {
  const reviews = product.reviews.length
    ? product.reviews.map((review) => ({ title: review.title ?? "Beautiful fit", text: review.comment ?? "Loved the finish and fit.", rating: review.rating }))
    : [
        { title: "Perfect boutique feeling", text: "The style feels premium and the fit guidance is easy to understand.", rating: 5 },
        { title: "Elegant fabric", text: "Soft, polished, and comfortable for long events.", rating: 5 },
      ];
  return (
    <EditorialSection eyebrow="Reviews" title="Customer Notes" subtitle="Real reviews appear here when available; demo notes preserve the premium presentation.">
      <div className="grid gap-4 md:grid-cols-2">
        {reviews.map((review) => (
          <div className="rounded-3xl border border-primary/10 bg-white p-5 shadow-sm" key={`${review.title}-${review.text}`}>
            <div className="flex gap-1 text-[#c58a00]">
              {Array.from({ length: review.rating }).map((_, index) => <Star className="h-4 w-4 fill-current" key={index} />)}
            </div>
            <h3 className="mt-4 font-semibold text-[#241820]">{review.title}</h3>
            <p className="mt-2 text-sm leading-6 text-[#725f69]">{review.text}</p>
          </div>
        ))}
      </div>
    </EditorialSection>
  );
}

function FaqSection() {
  return (
    <EditorialSection eyebrow="Frequently asked questions" title="Before You Customise" subtitle="Simple answers for the boutique product consultation.">
      <div className="grid gap-3">
        {faqs.map(([question, answer]) => (
          <details className="rounded-3xl border border-primary/10 bg-white p-5 shadow-sm" key={question}>
            <summary className="cursor-pointer font-semibold text-[#241820]">{question}</summary>
            <p className="mt-3 text-sm leading-7 text-[#725f69]">{answer}</p>
          </details>
        ))}
      </div>
    </EditorialSection>
  );
}

function DeliveryPromise({ product }: { product: ProductDetailData }) {
  const promises = [
    ["Custom Stitching", product.estimatedStitchingTime ?? "7-10 days"],
    ["Estimated Delivery", product.estimatedDelivery ?? "Pan India delivery"],
    ["Easy Alteration", "Support prepared for custom-fit orders"],
    ["Secure Experience", "Protected wishlist, cart, and checkout"],
  ] as const;
  return (
    <EditorialSection eyebrow="Delivery promise" title="From Boutique to Doorstep" subtitle="A calm, premium delivery promise for custom-made fashion.">
      <div className="grid gap-4 md:grid-cols-4">
        {promises.map(([title, value]) => (
          <div className="rounded-3xl border border-primary/10 bg-white p-5 shadow-sm" key={title}>
            <Truck className="h-6 w-6 text-primary" />
            <h3 className="mt-4 font-semibold text-[#241820]">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-[#725f69]">{value}</p>
          </div>
        ))}
      </div>
    </EditorialSection>
  );
}

function SelectorGroup({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-3xl border border-primary/10 bg-white p-5 shadow-sm">
      <p className="font-semibold text-[#241820]">{title}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((item, index) => (
          <label className="cursor-pointer" key={item}>
            <input className="peer sr-only" type="radio" name={title} defaultChecked={index === 0} />
            <span className="block rounded-full border border-primary/10 px-4 py-2 text-sm font-semibold text-[#3a2530] peer-checked:bg-primary peer-checked:text-white">
              {item}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

function EditorialSection({ eyebrow, title, subtitle, children }: { eyebrow: string; title: string; subtitle: string; children: ReactNode }) {
  return (
    <section className="grid gap-6">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">{eyebrow}</p>
        <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#241820] md:text-5xl">{title}</h2>
        <p className="mt-3 text-sm leading-7 text-[#725f69] md:text-base">{subtitle}</p>
      </div>
      {children}
    </section>
  );
}

function Metric({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-3xl border border-primary/10 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{title}</p>
      <p className="mt-3 text-sm leading-7 text-[#725f69]">{value}</p>
    </div>
  );
}

function PanelLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span>{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
