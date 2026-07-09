import { env } from "@/lib/config/env";
import { siteConfig } from "@/lib/config/site";

export function StructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.brandName,
    url: env.APP_URL,
    slogan: siteConfig.tagline,
    brand: {
      "@type": "Brand",
      name: siteConfig.productName,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function ProductStructuredData({
  name,
  description,
  slug,
  image,
  price,
  currency = "INR",
  availability,
}: {
  name: string;
  description: string;
  slug: string;
  image: string;
  price: number;
  currency?: string;
  availability: "InStock" | "OutOfStock";
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image,
    brand: { "@type": "Brand", name: siteConfig.brandName },
    url: `${env.APP_URL}/products/${slug}`,
    offers: {
      "@type": "Offer",
      priceCurrency: currency,
      price,
      availability: `https://schema.org/${availability}`,
      url: `${env.APP_URL}/products/${slug}`,
    },
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export function BreadcrumbStructuredData({ items }: { items: Array<{ name: string; url: string }> }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
