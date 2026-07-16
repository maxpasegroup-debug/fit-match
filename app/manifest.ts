import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FIT & MATCH",
    short_name: "FIT & MATCH",
    description: "FIT & MATCH. Truly Stylish.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#fffafd",
    theme_color: "#c21874",
    categories: ["shopping", "fashion", "lifestyle"],
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/icon.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icon.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      { name: "Search styles", short_name: "Search", url: "/search", icons: [{ src: "/icon.svg", sizes: "512x512" }] },
      { name: "FIT & MATCH", short_name: "FIT", url: "/fit-match", icons: [{ src: "/icon.svg", sizes: "512x512" }] },
      { name: "My Orders", short_name: "Orders", url: "/orders", icons: [{ src: "/icon.svg", sizes: "512x512" }] },
    ],
    screenshots: [
      { src: "/icon.svg", sizes: "512x512", type: "image/svg+xml", form_factor: "narrow" },
      { src: "/icon.svg", sizes: "512x512", type: "image/svg+xml", form_factor: "wide" },
    ],
  };
}
