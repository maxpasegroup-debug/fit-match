import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  Camera,
  Gem,
  Heart,
  MapPin,
  Palette,
  Ruler,
  Scissors,
  ShieldCheck,
  Shirt,
  Sparkles,
  Truck,
} from "lucide-react";

export type LandingImage = {
  src: string;
  alt: string;
};

export type HeroSlide = {
  eyebrow: string;
  headline: string;
  subtitle: string;
  cta: string;
  href: string;
  image: LandingImage;
};

export type JourneyStep = {
  title: string;
  text: string;
  icon: LucideIcon;
};

export type ImageCard = {
  title: string;
  subtitle: string;
  image: LandingImage;
};

export type CollectionBanner = ImageCard & {
  label: string;
  href: string;
};

export type ProductCard = {
  name: string;
  price: string;
  originalPrice: string;
  discount: string;
  rating: string;
  fit: string;
  colors: string[];
  aiRecommended: boolean;
  image: LandingImage;
};

export type JournalCard = ImageCard & {
  readTime: string;
};

export type CustomerStory = {
  name: string;
  location: string;
  purchased: string;
  text: string;
  rating: string;
  image: LandingImage;
};

export const heroSlides: HeroSlide[] = [
  {
    eyebrow: "AI custom fashion",
    headline: "Perfect Fit Starts Here",
    subtitle: "Measure once, choose your style, and receive a dress stitched beautifully for your body.",
    cta: "Start AI Measurement",
    href: "/fit/measurement",
    image: {
      src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1600&q=84",
      alt: "Luxury editorial fashion model in a custom dress",
    },
  },
  {
    eyebrow: "Wedding edit",
    headline: "Wedding Luxury Collection",
    subtitle: "Graceful silhouettes, rich colours, and premium stitching for every celebration.",
    cta: "Explore Wedding",
    href: "/collections",
    image: {
      src: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1600&q=84",
      alt: "Editorial wedding fashion collection",
    },
  },
  {
    eyebrow: "Workwear atelier",
    headline: "Office Elegance",
    subtitle: "Polished looks that feel comfortable, confident, and made for long workdays.",
    cta: "Shop Office",
    href: "/collections",
    image: {
      src: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1600&q=84",
      alt: "Premium office fashion editorial",
    },
  },
  {
    eyebrow: "Festive room",
    headline: "Festival Glamour",
    subtitle: "Celebrate in radiant colours, soft shine, and a fit that feels personal.",
    cta: "Shop Festival",
    href: "/collections",
    image: {
      src: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&q=84",
      alt: "Premium festive fashion editorial",
    },
  },
  {
    eyebrow: "Silk story",
    headline: "Premium Silk Collection",
    subtitle: "Affordable luxury in rich silk-inspired pieces tailored around your measurements.",
    cta: "Discover Silks",
    href: "/collections",
    image: {
      src: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1600&q=84",
      alt: "Premium silk fashion editorial",
    },
  },
];

export const journeySteps: JourneyStep[] = [
  { title: "Take AI Measurement", text: "Start from home with a simple guided flow.", icon: Camera },
  { title: "Choose Design", text: "Pick dresses, kurtis, sarees, and occasion looks.", icon: Shirt },
  { title: "Customize Your Dress", text: "Select fabric, colour, length, sleeve, and finish.", icon: Palette },
  { title: "Delivered Anywhere in India", text: "Your made-for-you outfit arrives at your door.", icon: Truck },
];

export const brandPromise: JourneyStep[] = [
  { title: "AI Perfect Fit", text: "Made around your saved measurements.", icon: Ruler },
  { title: "Premium Fabrics", text: "Soft, elegant, occasion-ready materials.", icon: Sparkles },
  { title: "Expert Tailors", text: "Neat stitching and careful finishing.", icon: Scissors },
  { title: "Affordable Luxury", text: "Designer feeling without the stress.", icon: Gem },
  { title: "Made for Women", text: "Built for college, work, home, weddings, and festivals.", icon: Heart },
  { title: "Pan India Delivery", text: "Beautifully packed and delivered to your door.", icon: MapPin },
  { title: "Easy Alteration Support", text: "Fit support when your outfit needs care.", icon: BadgeCheck },
  { title: "Secure Payments", text: "Safe checkout when commerce is enabled.", icon: ShieldCheck },
];

export const occasions: ImageCard[] = [
  ["Wedding", "For ceremonies, photos, and family moments"],
  ["Office", "Clean, confident workday elegance"],
  ["College", "Fresh styles that feel easy"],
  ["Daily Wear", "Soft fits for everyday comfort"],
  ["Temple", "Modest, graceful, and simple"],
  ["Party", "Statement looks with quiet shine"],
  ["Travel", "Light outfits that move with you"],
  ["Festival", "Rich colour for celebrations"],
  ["Birthday", "Pretty looks made for your day"],
  ["Vacation", "Relaxed pieces with a premium feel"],
].map(([title, subtitle], index) => ({
  title,
  subtitle,
  image: {
    src: [
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1543087903-1ac2ec7aa8c5?auto=format&fit=crop&w=900&q=80",
    ][index],
    alt: `${title} premium fashion occasion`,
  },
}));

export const categories: ImageCard[] = [
  "Designer Dresses",
  "Kurtis",
  "Salwar Sets",
  "Sarees",
  "Lehengas",
  "Anarkali",
  "Co-ord Sets",
  "Gowns",
  "Western Wear",
  "Office Wear",
  "Party Wear",
  "Bridal Wear",
  "Handbags",
  "Jewellery",
  "Footwear",
  "Accessories",
  "Beauty",
].map((title, index) => ({
  title,
  subtitle: index % 3 === 0 ? "Custom fit ready" : index % 3 === 1 ? "Premium edit" : "New season",
  image: {
    src: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=520&q=78",
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=520&q=78",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=520&q=78",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=520&q=78",
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=520&q=78",
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=520&q=78",
    ][index % 6],
    alt: `${title} category thumbnail`,
  },
}));

export const collectionBanners: CollectionBanner[] = [
  ["Wedding Edit", "Ceremony pieces with graceful colour, drape, and custom stitching."],
  ["Summer Collection", "Light fabrics, fresh tones, and breathable everyday polish."],
  ["Office Edit", "Quiet luxury pieces for meetings, commutes, and long days."],
  ["Luxury Silks", "Soft shine and rich fall for premium custom looks."],
  ["Festive Glamour", "Beautiful colours and silhouettes for every celebration."],
  ["Designer Picks", "Editorial looks curated for women who love detail."],
  ["Premium Cotton", "Comfortable custom pieces for everyday confidence."],
].map(([title, subtitle], index) => ({
  title,
  subtitle,
  label: index % 2 === 0 ? "Limited edit" : "New campaign",
  href: "/collections",
  image: {
    src: [
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1500&q=82",
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1500&q=82",
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1500&q=82",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1500&q=82",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1500&q=82",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1500&q=82",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1500&q=82",
    ][index],
    alt: `${title} luxury collection banner`,
  },
}));

const productNames = [
  "Rose Silk Kurti",
  "Elegant Office Saree",
  "Premium Floral Dress",
  "Classic Cotton Kurti",
  "Ivory Anarkali Set",
  "Blush Wedding Lehenga",
  "Pearl Workwear Co-ord",
  "Festival Organza Dress",
  "Magenta Silk Tunic",
  "Soft Linen Kurti",
  "Bridal Rose Set",
  "Midnight Party Gown",
  "Temple Cotton Dress",
  "Summer Pastel Saree",
  "Designer Draped Dress",
  "Golden Festive Suit",
  "College Day Kurti",
  "Travel Linen Co-ord",
  "Office Pearl Saree",
  "Vacation Floral Dress",
];

const productImages = [
  "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=760&q=80",
  "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=760&q=80",
  "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=760&q=80",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=760&q=80",
  "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=760&q=80",
  "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=760&q=80",
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=760&q=80",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=760&q=80",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=760&q=80",
  "https://images.unsplash.com/photo-1543087903-1ac2ec7aa8c5?auto=format&fit=crop&w=760&q=80",
];

const colorSets = [
  ["#c21874", "#f6c7dc", "#2a1722"],
  ["#efe1cf", "#8d6e63", "#f7f0ea"],
  ["#103f3a", "#d4af37", "#ffffff"],
  ["#6b1f3a", "#f4d6dd", "#2b2026"],
  ["#0f4c81", "#f4f0ec", "#d9b08c"],
];

export const demoProducts: ProductCard[] = Array.from({ length: 60 }, (_, index) => {
  const price = 1599 + (index % 12) * 350;
  const originalPrice = price + 900 + (index % 5) * 260;
  const discount = Math.round(((originalPrice - price) / originalPrice) * 100);
  return {
    name: `${productNames[index % productNames.length]} ${index > 19 ? `Edit ${Math.floor(index / 20) + 1}` : ""}`.trim(),
    price: `₹${price.toLocaleString("en-IN")}`,
    originalPrice: `₹${originalPrice.toLocaleString("en-IN")}`,
    discount: `${discount}% off`,
    rating: (4.5 + (index % 5) / 10).toFixed(1),
    fit: index % 4 === 0 ? "FIT Match 98%" : index % 4 === 1 ? "Custom Fit" : index % 4 === 2 ? "Best Seller" : "New Look",
    colors: colorSets[index % colorSets.length],
    aiRecommended: index % 3 === 0,
    image: {
      src: productImages[index % productImages.length],
      alt: `${productNames[index % productNames.length]} product image`,
    },
  };
});

export const homepageProductRows = [
  { eyebrow: "Trending now", title: "Trending Styles", subtitle: "The looks women are saving, sharing, and loving this week.", products: demoProducts.slice(0, 8) },
  { eyebrow: "For your profile", title: "Recommended For You", subtitle: "Demo recommendations based on measurements and style preferences.", products: demoProducts.slice(8, 16) },
  { eyebrow: "New season", title: "New Arrivals", subtitle: "Fresh pieces ready for custom stitching and premium styling.", products: demoProducts.slice(16, 24) },
  { eyebrow: "Wedding edit", title: "Wedding Collection", subtitle: "Rich ceremony looks made to fit beautifully.", products: demoProducts.slice(24, 32) },
  { eyebrow: "Workwear", title: "Office Collection", subtitle: "Elegant workwear that feels comfortable all day.", products: demoProducts.slice(32, 40) },
  { eyebrow: "Everyday", title: "Daily Wear", subtitle: "Soft fabrics, easy movement, and simple beauty.", products: demoProducts.slice(40, 48) },
  { eyebrow: "Celebration", title: "Festival Collection", subtitle: "Radiant colour, graceful detail, and premium custom fit.", products: demoProducts.slice(48, 56) },
  { eyebrow: "Designer edit", title: "Premium Designer Picks", subtitle: "Investor-ready showroom pieces with rich editorial appeal.", products: demoProducts.slice(52, 60) },
];

export const styleJournal: JournalCard[] = [
  {
    title: "Top Summer Colors",
    subtitle: "Soft shades that feel fresh, calm, and expensive.",
    readTime: "3 min read",
    image: {
      src: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80",
      alt: "Summer fashion colour editorial",
    },
  },
  {
    title: "How to Style Sarees",
    subtitle: "Simple ways to make a classic saree feel modern.",
    readTime: "4 min read",
    image: {
      src: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80",
      alt: "Saree styling editorial",
    },
  },
  {
    title: "Office Fashion Guide",
    subtitle: "Looks that feel polished without feeling heavy.",
    readTime: "5 min read",
    image: {
      src: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80",
      alt: "Office fashion guide editorial",
    },
  },
  {
    title: "Wedding Trends",
    subtitle: "Elegant details bridesmaids and guests are choosing.",
    readTime: "4 min read",
    image: {
      src: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&q=80",
      alt: "Wedding trends fashion editorial",
    },
  },
  {
    title: "Festival Styling",
    subtitle: "Colour, shine, and comfort for long celebration days.",
    readTime: "3 min read",
    image: {
      src: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80",
      alt: "Festival styling editorial",
    },
  },
];

export const customerStories: CustomerStory[] = [
  {
    name: "Aaradhya",
    location: "Bengaluru",
    purchased: "Pearl Workwear Set",
    text: "My office outfit fit perfectly and felt premium without being loud.",
    rating: "5.0",
    image: {
      src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=500&q=78",
      alt: "Customer story portrait",
    },
  },
  {
    name: "Meera",
    location: "Kochi",
    purchased: "Wedding Rose Anarkali",
    text: "I chose the look from home and the stitching felt made exactly for me.",
    rating: "5.0",
    image: {
      src: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=500&q=78",
      alt: "Customer story portrait",
    },
  },
  {
    name: "Nisha",
    location: "Pune",
    purchased: "Birthday Floral Dress",
    text: "The recommendations were simple. I found my birthday dress in minutes.",
    rating: "4.9",
    image: {
      src: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=500&q=78",
      alt: "Customer story portrait",
    },
  },
];

export const stylistOccasions = ["Wedding", "Office", "Temple", "Party", "Travel", "Birthday", "College"] as const;

export const footerColumns = [
  { title: "Shop", links: ["Occasions", "Categories", "Collections", "Designer Picks"] },
  { title: "FIT & Match", links: ["AI Measurement", "Custom Stitching", "Style Preferences", "Measurement Profiles"] },
  { title: "Support", links: ["Shipping Policy", "Return Policy", "Refund Policy", "Contact"] },
] as const;
