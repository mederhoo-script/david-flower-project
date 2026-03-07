/**
 * FLOWER CATALOGUE PRODUCT DATA
 * ==============================
 * Categories: "Late Spring & Early Summer" | "Summer" | "Autumn" | "Winter" | "All Year"
 */

export type FlowerCategory =
  | "All"
  | "Late Spring & Early Summer"
  | "Summer"
  | "Autumn"
  | "Winter"
  | "All Year";

export type FlowerSeason = "Spring" | "Summer" | "Autumn" | "Winter" | "All Year";

export interface FlowerProduct {
  id: string;
  title: string;
  description: string;
  symbolism?: string;
  category: Exclude<FlowerCategory, "All">;
  badge?: "New" | "Popular" | "Trending" | null;
  image: string;
  images?: { front?: string; left?: string; right?: string; back?: string };
  stemPrice: string;
  bunchPrice: string;
  stemPriceValue?: number;
  bunchPriceValue?: number;
  colors?: string[];
  seasons?: FlowerSeason[];
  featured?: boolean;
  isNew?: boolean;
  isTrending?: boolean;
}

export const flowerCategories: FlowerCategory[] = [
  "All",
  "Late Spring & Early Summer",
  "Summer",
  "Autumn",
  "Winter",
  "All Year",
];

export const flowers: FlowerProduct[] = [
  {
    id: "fiorella",
    title: "Fiorella",
    category: "Late Spring & Early Summer",
    badge: "New",
    image: "/images/david/fiorella.jpeg",
    stemPrice: "$5.50",
    bunchPrice: "$48.99",
    stemPriceValue: 5.5,
    bunchPriceValue: 48.99,
    description:
      "Fiorella is a soft, romantic garden rose with delicate petals that unfold in gentle waves of blush and cream. Its lush, full blooms and fresh, subtle fragrance make it a favourite for weddings, anniversaries, and everyday luxury arrangements.",
    symbolism:
      "Fiorella represents tenderness and new beginnings — the perfect bloom to celebrate life's most cherished moments.",
    colors: ["Blush", "Cream"],
    seasons: ["Spring", "Summer"],
    featured: true,
    isNew: true,
  },
  {
    id: "white-athena",
    title: "White Athena",
    category: "Late Spring & Early Summer",
    badge: "Popular",
    image: "/images/david/white-athena.jpeg",
    stemPrice: "$5.50",
    bunchPrice: "$48.99",
    stemPriceValue: 5.5,
    bunchPriceValue: 48.99,
    description:
      "White Athena is a classic, pure-white rose prized by florists worldwide for its perfectly formed blooms and exceptional vase life. Its pristine petals and elegant high-centre form make it the go-to choice for bridal bouquets, sympathy arrangements, and sophisticated table centrepieces.",
    symbolism:
      "White roses symbolise purity, innocence, and eternal love — a timeless tribute to life's most meaningful occasions.",
    colors: ["White"],
    seasons: ["Spring", "Summer"],
    featured: true,
    isTrending: true,
  },
  {
    id: "yellow-bassanti",
    title: "Yellow Bassanti",
    category: "Late Spring & Early Summer",
    badge: "Trending",
    image: "/images/david/yellow-bassanti.jpeg",
    stemPrice: "$5.50",
    bunchPrice: "$48.99",
    stemPriceValue: 5.5,
    bunchPriceValue: 48.99,
    description:
      "Yellow Bassanti is a radiant, sunshine-yellow rose with a warm, uplifting presence. Its bold colour and large, full blooms bring instant cheer to any space. An excellent choice for birthday bouquets, get-well wishes, and cheerful seasonal arrangements.",
    symbolism:
      "Yellow roses symbolise friendship, joy, and warm wishes — the perfect way to brighten someone's day.",
    colors: ["Yellow"],
    seasons: ["Spring", "Summer"],
    isTrending: true,
  },
  {
    id: "cerise",
    title: "Cerise",
    category: "Late Spring & Early Summer",
    badge: "Popular",
    image: "/images/david/cerise.jpeg",
    stemPrice: "$5.50",
    bunchPrice: "$48.99",
    stemPriceValue: 5.5,
    bunchPriceValue: 48.99,
    description:
      "Cerise is a striking deep-pink to cherry-red rose with richly coloured, velvety petals. Its intense hue and strong stems make it a statement flower in any arrangement.",
    symbolism:
      "Cerise roses convey deep appreciation, admiration, and heartfelt gratitude.",
    colors: ["Cerise", "Deep Pink"],
    seasons: ["Spring", "Summer"],
  },
  {
    id: "ever-red",
    title: "Ever Red",
    category: "Late Spring & Early Summer",
    badge: "Popular",
    image: "/images/david/ever-red.jpeg",
    stemPrice: "$5.50",
    bunchPrice: "$48.99",
    stemPriceValue: 5.5,
    bunchPriceValue: 48.99,
    description:
      "Ever Red is a premium dark-red rose with velvety, deep-crimson petals and a long, strong stem. Its luxurious colour and classic form make it the ultimate romantic gesture.",
    symbolism:
      "Deep red roses are the universal symbol of passionate love, desire, and devotion.",
    colors: ["Dark Red", "Crimson"],
    seasons: ["All Year"],
    featured: true,
  },
  {
    id: "sparta",
    title: "Sparta",
    category: "Late Spring & Early Summer",
    badge: "New",
    image: "/images/david/sparta.jpeg",
    stemPrice: "$5.50",
    bunchPrice: "$48.99",
    stemPriceValue: 5.5,
    bunchPriceValue: 48.99,
    description:
      "Sparta is a bold, striking rose with rich, jewel-toned blooms and exceptional stem strength. Its vivid colour and long vase life make it a top pick for high-impact event floristry.",
    symbolism:
      "Sparta symbolises strength, passion, and boldness — a rose that commands attention and admiration.",
    colors: ["Jewel Red"],
    seasons: ["Spring", "Summer"],
    isNew: true,
  },
];
