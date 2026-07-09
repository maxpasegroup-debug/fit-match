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
  Star,
  Truck,
  WandSparkles,
} from "lucide-react";

export type LandingImage = {
  src: string;
  alt: string;
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

export type ProductCard = {
  name: string;
  price: string;
  originalPrice: string;
  discount: string;
  rating: string;
  fit: string;
  image: LandingImage;
};

export const heroImage: LandingImage = {
  src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=82",
  alt: "Woman wearing a premium tailored dress in an editorial fashion setting",
};

export const journeySteps: JourneyStep[] = [
  { title: "AI Measurement", text: "Measure at home in minutes.", icon: Camera },
  { title: "Choose Design", text: "Pick the look you love.", icon: Shirt },
  { title: "Select Fabric", text: "Choose colour and comfort.", icon: Palette },
  { title: "Custom Stitching", text: "Made to fit your body.", icon: Scissors },
  { title: "Home Delivery", text: "Delivered across India.", icon: Truck },
];

export const trustBadges: JourneyStep[] = [
  { title: "Perfect Fit", text: "Made around you", icon: Ruler },
  { title: "AI Measurements", text: "Quick and simple", icon: WandSparkles },
  { title: "Premium Fabrics", text: "Soft, rich, elegant", icon: Sparkles },
  { title: "Expert Tailors", text: "Careful finishing", icon: Scissors },
  { title: "Pan India Delivery", text: "To your doorstep", icon: MapPin },
  { title: "Secure Payments", text: "Protected checkout", icon: ShieldCheck },
];

export const measurementSteps = [
  "No measuring tape",
  "No tailor visit",
  "Just your phone",
] as const;

export const occasions: ImageCard[] = [
  {
    title: "Wedding",
    subtitle: "Graceful looks for every ceremony",
    image: {
      src: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&q=80",
      alt: "Elegant wedding fashion look",
    },
  },
  {
    title: "Office",
    subtitle: "Polished outfits for work",
    image: {
      src: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80",
      alt: "Premium office fashion for women",
    },
  },
  {
    title: "College",
    subtitle: "Fresh, easy everyday style",
    image: {
      src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80",
      alt: "Young woman in stylish college fashion",
    },
  },
  {
    title: "Daily Wear",
    subtitle: "Soft fits for every day",
    image: {
      src: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80",
      alt: "Everyday premium women fashion",
    },
  },
  {
    title: "Temple",
    subtitle: "Simple, modest, beautiful",
    image: {
      src: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80",
      alt: "Elegant traditional fashion style",
    },
  },
  {
    title: "Party",
    subtitle: "Statement styles with shine",
    image: {
      src: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=900&q=80",
      alt: "Party wear fashion editorial",
    },
  },
  {
    title: "Travel",
    subtitle: "Light, stylish, comfortable",
    image: {
      src: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80",
      alt: "Comfortable travel fashion for women",
    },
  },
  {
    title: "Festival",
    subtitle: "Rich colours for celebrations",
    image: {
      src: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80",
      alt: "Festive women fashion collection",
    },
  },
];

export const categories: ImageCard[] = [
  "Designer Dresses",
  "Kurtis",
  "Salwar Sets",
  "Sarees",
  "Lehengas",
  "Anarkali",
  "Gowns",
  "Co-ord Sets",
  "Office Wear",
  "Party Wear",
  "Bridal Wear",
  "Accessories",
  "Footwear",
  "Handbags",
  "Jewellery",
].map((title, index) => ({
  title,
  subtitle: index % 2 === 0 ? "Custom fit ready" : "Premium edit",
  image: {
    src: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=500&q=78",
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=500&q=78",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=500&q=78",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=500&q=78",
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=500&q=78",
    ][index % 5],
    alt: `${title} fashion category`,
  },
}));

export const collectionBanners: ImageCard[] = [
  {
    title: "Wedding Season",
    subtitle: "Dresses made for ceremonies, photos, and family moments",
    image: {
      src: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1400&q=82",
      alt: "Wedding season premium collection",
    },
  },
  {
    title: "Office Elegance",
    subtitle: "Clean silhouettes, calm colours, and all-day comfort",
    image: {
      src: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1400&q=82",
      alt: "Office elegance fashion banner",
    },
  },
  {
    title: "Festival Glamour",
    subtitle: "Rich festive shades with a soft designer finish",
    image: {
      src: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1400&q=82",
      alt: "Festival glamour fashion banner",
    },
  },
  {
    title: "Premium Silk Collection",
    subtitle: "Elegant shine, beautiful fall, and made-for-you tailoring",
    image: {
      src: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1400&q=82",
      alt: "Premium silk fashion banner",
    },
  },
];

export const trendingProducts: ProductCard[] = [
  {
    name: "Rose Silk Kurti",
    price: "₹2,499",
    originalPrice: "₹3,499",
    discount: "29% off",
    rating: "4.8",
    fit: "FIT Match 96%",
    image: {
      src: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=700&q=80",
      alt: "Rose silk kurti product",
    },
  },
  {
    name: "Elegant Office Saree",
    price: "₹3,899",
    originalPrice: "₹4,999",
    discount: "22% off",
    rating: "4.7",
    fit: "FIT Match 94%",
    image: {
      src: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=700&q=80",
      alt: "Elegant office saree product",
    },
  },
  {
    name: "Premium Floral Dress",
    price: "₹2,999",
    originalPrice: "₹4,199",
    discount: "28% off",
    rating: "4.9",
    fit: "FIT Match 98%",
    image: {
      src: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=700&q=80",
      alt: "Premium floral dress product",
    },
  },
  {
    name: "Classic Cotton Kurti",
    price: "₹1,799",
    originalPrice: "₹2,499",
    discount: "28% off",
    rating: "4.6",
    fit: "FIT Match 92%",
    image: {
      src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=700&q=80",
      alt: "Classic cotton kurti product",
    },
  },
];

export const recommendedProducts: ProductCard[] = [
  {
    name: "Soft Magenta Anarkali",
    price: "₹4,299",
    originalPrice: "₹5,799",
    discount: "26% off",
    rating: "4.9",
    fit: "Best for you",
    image: {
      src: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=700&q=80",
      alt: "Soft magenta anarkali recommendation",
    },
  },
  {
    name: "Pearl Workwear Set",
    price: "₹2,699",
    originalPrice: "₹3,299",
    discount: "18% off",
    rating: "4.7",
    fit: "Office ready",
    image: {
      src: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=700&q=80",
      alt: "Pearl workwear set recommendation",
    },
  },
  {
    name: "Ivory Festival Dress",
    price: "₹3,499",
    originalPrice: "₹4,599",
    discount: "24% off",
    rating: "4.8",
    fit: "Custom fit",
    image: {
      src: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=700&q=80",
      alt: "Ivory festival dress recommendation",
    },
  },
];

export const occasionRows = [
  { title: "Wedding Collection", subtitle: "Rich colours, graceful silhouettes, and a made-for-you finish.", items: trendingProducts },
  { title: "Office Collection", subtitle: "Elegant workwear that feels comfortable from morning to evening.", items: recommendedProducts },
  { title: "Daily Wear", subtitle: "Soft fabrics, easy movement, and simple beauty for everyday life.", items: trendingProducts.slice().reverse() },
  { title: "Festival Collection", subtitle: "Celebrate in premium pieces stitched around your exact fit.", items: recommendedProducts.slice().reverse() },
];

export const designerPicks: ProductCard[] = [
  {
    name: "Designer Party Wear",
    price: "₹5,499",
    originalPrice: "₹7,299",
    discount: "25% off",
    rating: "4.9",
    fit: "Designer pick",
    image: {
      src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=700&q=82",
      alt: "Designer party wear product",
    },
  },
  {
    name: "Bridal Rose Lehenga",
    price: "₹8,999",
    originalPrice: "₹11,999",
    discount: "25% off",
    rating: "4.9",
    fit: "Premium pick",
    image: {
      src: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=700&q=82",
      alt: "Bridal rose lehenga product",
    },
  },
  {
    name: "Silk Temple Set",
    price: "₹3,299",
    originalPrice: "₹4,399",
    discount: "25% off",
    rating: "4.8",
    fit: "Elegant pick",
    image: {
      src: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=700&q=82",
      alt: "Silk temple set product",
    },
  },
];

export const stylistOccasions = ["Wedding", "Office", "Temple", "Party", "Travel", "Birthday", "College"] as const;

export const whyCards: JourneyStep[] = [
  { title: "Perfect Fit", text: "Made with your saved size profile.", icon: BadgeCheck },
  { title: "Custom Stitching", text: "Every detail prepared for you.", icon: Scissors },
  { title: "AI Measurements", text: "Simple guided measuring at home.", icon: WandSparkles },
  { title: "Premium Fabrics", text: "Soft choices for every occasion.", icon: Sparkles },
  { title: "Expert Tailors", text: "Careful work and neat finishing.", icon: Shirt },
  { title: "Affordable Luxury", text: "Designer feeling without the stress.", icon: Gem },
  { title: "Pan India Delivery", text: "Delivered beautifully to your door.", icon: Truck },
  { title: "Secure Payments", text: "Safe checkout for every order.", icon: ShieldCheck },
  { title: "Easy Alteration", text: "Support ready when your fit needs care.", icon: Heart },
];

export const customerStories = [
  {
    name: "Aaradhya",
    location: "Bengaluru",
    text: "My office kurti fit perfectly the first time. It felt simple, premium, and very personal.",
    rating: "5.0",
    image: {
      src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=500&q=78",
      alt: "Customer story portrait",
    },
  },
  {
    name: "Meera",
    location: "Kochi",
    text: "I chose my wedding-event look from home and the stitching felt made exactly for me.",
    rating: "5.0",
    image: {
      src: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=500&q=78",
      alt: "Customer story portrait",
    },
  },
  {
    name: "Nisha",
    location: "Pune",
    text: "The style suggestions were easy to understand. I found a dress for my birthday in minutes.",
    rating: "4.9",
    image: {
      src: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=500&q=78",
      alt: "Customer story portrait",
    },
  },
];

export const sectionEyebrow = "SIGN SILKS FIT & Match";
export const starIcon = Star;
