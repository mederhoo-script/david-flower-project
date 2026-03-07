/**
 * FLOWER CATALOGUE PRODUCT DATA
 * ==============================
 * Synced with js/data.js — all 52 static products.
 */

export type FlowerCategory =
  | "All"
  | "Late Spring & Early Summer"
  | "Winter & Early Spring"
  | "Late Summer & Fall"
  | "Luxury Bouquets"
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
  badge?: "New" | "Popular" | "Trending" | "Fragrant" | "Premium" | null;
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
  "Winter & Early Spring",
  "Late Summer & Fall",
  "Luxury Bouquets",
  "Summer",
  "Autumn",
  "Winter",
  "All Year",
];

export const flowers: FlowerProduct[] = [
  // ── David Roses ────────────────────────────────────────────────────────────
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

  // ── Fresh Arrangements ─────────────────────────────────────────────────────
  {
    id: "fresh-arrangement-01",
    title: "Fresh Rose Arrangement",
    category: "Late Spring & Early Summer",
    badge: "New",
    image: "/images/david/fresh-arrangement-01.jpeg",
    stemPrice: "$5.50",
    bunchPrice: "$48.99",
    description:
      "A beautifully handcrafted rose arrangement featuring our freshest seasonal blooms. Designed and photographed in our studio, this bouquet showcases the natural beauty of premium roses at their very best.",
    symbolism: "Fresh roses symbolise love, beauty, and the timeless art of giving.",
  },
  {
    id: "fresh-arrangement-02",
    title: "Classic Rose Bouquet",
    category: "Late Spring & Early Summer",
    badge: null,
    image: "/images/david/fresh-arrangement-02.jpeg",
    stemPrice: "$5.50",
    bunchPrice: "$48.99",
    description:
      "A lush, classic rose bouquet handcrafted with our finest premium blooms. Perfect for any celebration, this elegant arrangement combines vibrant colour with expert floral design.",
    symbolism: "Roses have been a symbol of love and beauty for centuries across every culture.",
  },
  {
    id: "fresh-arrangement-03",
    title: "Premium Rose Collection",
    category: "Late Spring & Early Summer",
    badge: null,
    image: "/images/david/fresh-arrangement-03.jpeg",
    stemPrice: "$5.50",
    bunchPrice: "$48.99",
    description:
      "Our Premium Rose Collection brings together the finest varieties from our growers in one stunning arrangement. Each bloom is carefully selected for colour, form, and fragrance.",
    symbolism:
      "Premium roses represent the highest expression of care, beauty, and heartfelt emotion.",
  },
  {
    id: "fresh-arrangement-04",
    title: "Garden Rose Mix",
    category: "Late Spring & Early Summer",
    badge: "Trending",
    image: "/images/david/fresh-arrangement-04.jpeg",
    stemPrice: "$5.50",
    bunchPrice: "$48.99",
    description:
      "A gorgeous mix of garden-style roses in complementary shades, arranged with lush greenery for a naturally abundant look. This arrangement captures the romance of a summer garden in full bloom.",
    symbolism: "Garden roses symbolise abundance, romance, and the carefree beauty of nature.",
  },
  {
    id: "fresh-arrangement-05",
    title: "Rose Bouquet Special",
    category: "Late Spring & Early Summer",
    badge: null,
    image: "/images/david/fresh-arrangement-05.jpeg",
    stemPrice: "$5.50",
    bunchPrice: "$48.99",
    description:
      "A special rose bouquet arrangement carefully crafted for maximum visual impact. Our florists select each stem for its perfect bloom stage, ensuring your arrangement stays beautiful for longer.",
    symbolism: "A carefully chosen rose bouquet is one of life's most sincere expressions of affection.",
  },
  {
    id: "fresh-arrangement-06",
    title: "Luxury Rose Bundle",
    category: "Late Spring & Early Summer",
    badge: "Popular",
    image: "/images/david/fresh-arrangement-06.jpeg",
    stemPrice: "$5.50",
    bunchPrice: "$48.99",
    description:
      "Our Luxury Rose Bundle is designed for those who appreciate the very finest blooms. Generous and spectacular, this arrangement makes an unforgettable impression for weddings, milestones, and grand occasions.",
    symbolism:
      "Luxury roses symbolise sophistication, devotion, and the art of celebrating in style.",
  },
  {
    id: "fresh-arrangement-07",
    title: "Signature Rose Wrap",
    category: "Late Spring & Early Summer",
    badge: null,
    image: "/images/david/fresh-arrangement-07.jpeg",
    stemPrice: "$5.50",
    bunchPrice: "$48.99",
    description:
      "Our Signature Rose Wrap is a hand-tied bouquet showcasing premium roses wrapped in our distinctive style. Ideal as a gift or as part of a larger floral arrangement for events and celebrations.",
    symbolism:
      "A hand-tied rose bouquet represents personal care and the beauty of individual attention.",
  },
  {
    id: "fresh-arrangement-08",
    title: "Seasonal Rose Arrangement",
    category: "Late Spring & Early Summer",
    badge: null,
    image: "/images/david/fresh-arrangement-08.jpeg",
    stemPrice: "$5.50",
    bunchPrice: "$48.99",
    description:
      "A seasonal rose arrangement that celebrates the very best blooms of the moment. Our florists curate this collection fresh each season to bring you nature's finest at its peak.",
    symbolism:
      "Seasonal roses carry the spirit of the present moment — a living reminder to savour life's beauty.",
  },
  {
    id: "fresh-arrangement-09",
    title: "Studio Rose Collection",
    category: "Late Spring & Early Summer",
    badge: null,
    image: "/images/david/fresh-arrangement-09.jpeg",
    stemPrice: "$5.50",
    bunchPrice: "$48.99",
    description:
      "Our Studio Rose Collection features an expertly composed arrangement photographed under natural light to showcase each bloom's true colour and texture. What you see is exactly what you receive.",
    symbolism: "Roses in their natural beauty are an honest and heartfelt expression of emotion.",
  },
  {
    id: "fresh-arrangement-10",
    title: "Morning Rose Bouquet",
    category: "Late Spring & Early Summer",
    badge: "New",
    image: "/images/david/fresh-arrangement-10.jpeg",
    stemPrice: "$5.50",
    bunchPrice: "$48.99",
    description:
      "Photographed in the soft light of the morning, our Morning Rose Bouquet captures roses at their freshest — dewy, vibrant, and full of life. An ideal gift for early celebrations or a thoughtful morning surprise.",
    symbolism: "Morning roses represent a fresh start, new hope, and the joy of a new day.",
  },
  {
    id: "fresh-arrangement-11",
    title: "David Rose Ensemble",
    category: "Late Spring & Early Summer",
    badge: "New",
    image: "/images/david/fresh-arrangement-11.jpeg",
    stemPrice: "$5.50",
    bunchPrice: "$48.99",
    description:
      "The David Rose Ensemble is our signature collection — a curated selection of the finest roses from our growers, arranged by our expert florists. A true showcase of what David Flower Project does best.",
    symbolism:
      "Our signature ensemble represents our commitment to quality, beauty, and the joy of flowers.",
  },
  {
    id: "fresh-arrangement-12",
    title: "David's Pride Rose",
    category: "Late Spring & Early Summer",
    badge: "Popular",
    image: "/images/david/fresh-arrangement-12.jpeg",
    stemPrice: "$5.50",
    bunchPrice: "$48.99",
    description:
      "David's Pride Rose is our flagship arrangement — the bloom that best represents the David Flower Project ethos of quality, elegance, and passion. Every detail, from stem selection to final presentation, reflects our highest standards.",
    symbolism:
      "David's Pride Rose symbolises the pride and joy we take in every flower we deliver to you.",
  },

  // ── Winter & Early Spring ──────────────────────────────────────────────────
  {
    id: "anemone",
    title: "Anemone",
    category: "Winter & Early Spring",
    badge: null,
    image: "/images/anemone.jpeg",
    stemPrice: "$3.50",
    bunchPrice: "$29.99",
    description:
      "I love anemones—their jewel-bright colors are so welcome after a long, dreary winter. Anemones' bold color and shape lend themselves perfectly to a simple, single-flower-type arrangement. They also have a good amount of their own green in the form of a fetching \"ruff,\" which frames their faces. As well as their surprisingly long vase life.",
    symbolism:
      "Anemones represent unfading love—in Greek mythology, anemones grew from the spilled blood.",
  },
  {
    id: "freesia",
    title: "Freesia",
    category: "Winter & Early Spring",
    badge: null,
    image: "/images/freesia.jpeg",
    stemPrice: "$3.50",
    bunchPrice: "$29.99",
    description:
      "Freesia lactea is a strongly scented species. This variety is called 'Double White.' Freesias' dainty blooms adorn the top of their elegant, narrow stems in arching clusters. Native to South Africa, freesias have a gorgeous, fruity fragrance. Their upward-facing trumpets come in a range of bright colors, each color producing a slightly different scent.",
    symbolism: "",
  },
  {
    id: "snapdragon",
    title: "Snapdragon",
    category: "Winter & Early Spring",
    badge: null,
    image: "/images/snapdragon.jpeg",
    stemPrice: "$3.50",
    bunchPrice: "$29.99",
    description:
      "Antirrhinum Snapdragons are a beloved cut flower with tall, elegant spikes covered in ruffled blooms. Their color range is extraordinary — from purest white and soft pastels to rich burgundy and bi-colored varieties. Snapdragons add wonderful vertical structure to arrangements and are long-lasting in the vase. Ideal for early spring bouquets, they bring height and drama to any design.",
    symbolism:
      "Snapdragons symbolize grace and strength. In the language of flowers, they represent deception — their blooms snap open and shut like the jaws of a dragon.",
  },
  {
    id: "hellebore",
    title: "Hellebore",
    category: "Winter & Early Spring",
    badge: null,
    image: "/images/hellebore.jpeg",
    stemPrice: "$3.50",
    bunchPrice: "$29.99",
    description:
      "Helleborus Hellebores have an understated air that suits the soft light of late winter and early spring. The flowers of the Lenten rose (Helleborus orientalis) are the first cut flowers of the season, and one of the longest lasting in the garden. Even after fertilization, the petals do not fall, but remain to protect the ripening seedhead.",
    symbolism: "",
  },
  {
    id: "muscari",
    title: "Muscari",
    category: "Winter & Early Spring",
    badge: null,
    image: "/images/muscari.jpeg",
    stemPrice: "$3.50",
    bunchPrice: "$29.99",
    description:
      "An easy plant to grow, muscari has perfectly formed, conical-shaped clusters of flowers. Muscari's common name, grape hyacinth, refers to the flowers being similar in appearance to a bunch of grapes. The blooms come in shades of blue, white, and sometimes pink, but few varieties have the stem length necessary for use as a cut flower.",
    symbolism: "",
  },

  // ── Late Spring & Early Summer (continued) ─────────────────────────────────
  {
    id: "sweet-william",
    title: "Sweet William",
    category: "Late Spring & Early Summer",
    badge: null,
    image: "/images/sweet-william.jpeg",
    stemPrice: "$4.50",
    bunchPrice: "$38.99",
    description:
      "Easy to grow from seed, sweet Williams are often better quality home grown or locally purchased.",
    symbolism: "",
  },
  {
    id: "iris",
    title: "Iris",
    category: "Late Spring & Early Summer",
    badge: null,
    image: "/images/iris.jpeg",
    stemPrice: "$4.50",
    bunchPrice: "$38.99",
    description: "For Siberian irises. This variety is called 'Sparkling Rose.' \"Iris\" is the Greek word for rainbow.",
    symbolism: "",
  },
  {
    id: "lavender",
    title: "Lavender",
    category: "Late Spring & Early Summer",
    badge: "Fragrant",
    image: "/images/lavender.jpeg",
    stemPrice: "$4.50",
    bunchPrice: "$38.99",
    description: "Cleanse, perfume, and anoint since Ancient Egyptian times.",
    symbolism: "",
  },
  {
    id: "nigella",
    title: "Nigella",
    category: "Late Spring & Early Summer",
    badge: null,
    image: "/images/nigella.jpeg",
    stemPrice: "$4.50",
    bunchPrice: "$38.99",
    description: "Develop into seed pods — use this variety in form to add interest to arrangements.",
    symbolism: "Nigella damascena 'Miss Jekyll Blue' has large, sky-blue, semi-double flowers.",
  },
  {
    id: "rose",
    title: "Rose",
    category: "Late Spring & Early Summer",
    badge: "Popular",
    image: "/images/rose.jpeg",
    stemPrice: "$5.50",
    bunchPrice: "$48.99",
    description:
      "Rosa — the queen of cut flowers, rose's beauty and scent make it many people's favorite flower. This quintessentially English flower comes in a staggering range of varieties. It is available in every color aside from true blue, and its heavenly fragrance is unrivaled.",
    symbolism: "Rosa 'Proper Job' has a quartered-rosette form that is often referred to as an old-fashioned rose.",
  },

  // ── Late Summer & Fall ─────────────────────────────────────────────────────
  {
    id: "yarrow",
    title: "Yarrow",
    category: "Late Summer & Fall",
    badge: null,
    image: "/images/yarrow.jpeg",
    stemPrice: "$4.00",
    bunchPrice: "$34.99",
    description:
      "Achillea Yarrow's color palette reminds me of a Persian rug, with deep reds and pinks to golden yellow.",
    symbolism: "Achillea Yarrow's color palette reminds me of a Persian rug, with deep reds and pinks to golden yellow.",
  },
  {
    id: "cosmos",
    title: "Cosmos",
    category: "Late Summer & Fall",
    badge: null,
    image: "/images/cosmos.jpeg",
    stemPrice: "$4.00",
    bunchPrice: "$34.99",
    description:
      "Cosmos has an understated elegance with its crinkled petals and open flowers. Two types of cosmos are used as cut flowers.",
    symbolism: "",
  },
  {
    id: "dahlia",
    title: "Dahlia",
    category: "Late Summer & Fall",
    badge: "New",
    image: "/images/dahlia.jpeg",
    stemPrice: "$5.00",
    bunchPrice: "$44.99",
    description:
      "Member of the ball group of dahlias. It has good stem length and vase life, so it is an excellent variety for cutting.",
    symbolism:
      "In the language of flowers, dahlias are a symbol of dignity. No other flower is as generous.",
  },
  {
    id: "sunflower",
    title: "Sunflower",
    category: "Late Summer & Fall",
    badge: "Trending",
    image: "/images/sunflower.jpeg",
    stemPrice: "$4.00",
    bunchPrice: "$34.99",
    description:
      "Helianthus annuus — You cannot help but be cheered by the open, sunny face of a sunflower. The best sunflowers for cutting are the annual, pollen-free cultivars. There are many sizes and colors to choose from, including creams, lemons, golds, and reds, as well as bicolored varieties.",
    symbolism:
      "In the language of flowers, tall sunflowers are a symbol of haughtiness, while dwarf sunflowers symbolise adoration.",
  },
  {
    id: "hydrangea",
    title: "Hydrangea",
    category: "Late Summer & Fall",
    badge: "Popular",
    image: "/images/hydrangea.jpeg",
    stemPrice: "$6.00",
    bunchPrice: "$52.99",
    description: "'Grandiflora' is a woody shrub with conical, lace-cap flower heads.",
    symbolism: "Hydrangeas' voluminous flowers change color, aging to beautiful antique shades.",
  },
  {
    id: "ladys-mantle",
    title: "Lady's Mantle",
    category: "Late Summer & Fall",
    badge: null,
    image: "/images/lady-s-mantle.jpeg",
    stemPrice: "$4.00",
    bunchPrice: "$34.99",
    description:
      "Alchemilla Lady's mantle is a classic cottage-garden filler beloved by florists for its cloud-like sprays of tiny chartreuse-yellow flowers and its velvety, scalloped leaves. Its soft frothy texture complements roses and other summer blooms beautifully.",
    symbolism:
      "Lady's mantle symbolizes protection and comfort. Its name — Alchemilla — comes from 'alchemy,' as the dew collected on its leaves was once prized by alchemists.",
  },
  {
    id: "zinnia",
    title: "Zinnia",
    category: "Late Summer & Fall",
    badge: null,
    image: "/images/zinnia.jpeg",
    stemPrice: "$4.00",
    bunchPrice: "$34.99",
    description:
      "The party animals of the cut-flower world, zinnias appear in a festive array of bright colors. Zinnias are single or double daisylike flowers. Their brightly colored, papery petals and intricate, jewel-like centers make them look almost artificial.",
    symbolism:
      "Zinnia elegans 'Benary's Giant Coral' is a fully double, annual form, meaning it has more petals than single or double forms.",
  },
  {
    id: "love-lies-bleeding",
    title: "Love-Lies-Bleeding",
    category: "Late Summer & Fall",
    badge: null,
    image: "/images/love-lies-bleeding.jpeg",
    stemPrice: "$6.50",
    bunchPrice: "$54.99",
    description:
      "Amaranthus caudatus Love-lies-bleeding is one of the most dramatic and theatrical plants in the garden. Its long, drooping, rope-like tassels of tiny crimson flowers cascade down like flowing velvet ribbons. This unusual plant adds movement and dark, romantic color to late summer and autumn arrangements.",
    symbolism:
      "Love-lies-bleeding symbolizes hopeless love and undying devotion. Its dramatic, trailing crimson flowers have made it a beloved symbol in poetry and romantic art for centuries.",
  },

  // ── Luxury Bouquets ────────────────────────────────────────────────────────
  {
    id: "regal-admiral",
    title: "Admiral Rose Box",
    category: "Luxury Bouquets",
    badge: "Premium",
    image: "/images/regal/img-admiral-cover.jpg",
    stemPrice: "$8.00",
    bunchPrice: "$89.99",
    description:
      "A breathtaking heart-shaped presentation of premium red roses, beautifully arranged in an elegant box. Perfect for anniversaries, Valentine's Day, and special declarations of love.",
    symbolism:
      "Red roses in a heart arrangement symbolise passionate love and devotion — the ultimate romantic gift.",
  },
  {
    id: "regal-frever-red",
    title: "Frever Red Bouquet",
    category: "Luxury Bouquets",
    badge: "Popular",
    image: "/images/regal/img-frever-red.jpg",
    stemPrice: "$7.50",
    bunchPrice: "$74.99",
    description:
      "A stunning hand-tied bouquet of vibrant red roses wrapped in elegant craft paper. Classic, bold, and utterly timeless — ideal for romantic occasions and heartfelt gestures.",
    symbolism: "Red roses are the universal symbol of love, passion, and deep affection.",
  },
  {
    id: "regal-million-stars-bouquet",
    title: "Red Roses & Million Stars",
    category: "Luxury Bouquets",
    badge: "Trending",
    image: "/images/regal/img-red-roses-million-stars-bouquet.jpg",
    stemPrice: "$7.00",
    bunchPrice: "$69.99",
    description:
      "A romantic pairing of rich red roses with delicate white million stars (gypsophila), creating a classic contrast of bold colour and airy texture. Wrapped in crisp white paper for a polished finish.",
    symbolism:
      "Red roses with white gypsophila represent everlasting love set against purity and innocence.",
  },
  {
    id: "regal-30roses-million-stars",
    title: "30 Roses & Million Stars",
    category: "Luxury Bouquets",
    badge: "Premium",
    image: "/images/regal/img-regal-red-roses-million-stars-30roses.jpg",
    stemPrice: "$7.50",
    bunchPrice: "$119.99",
    description:
      "A grand, show-stopping bouquet of thirty premium red roses complemented by clouds of white million stars. This generous arrangement makes an unforgettable impression at any celebration.",
    symbolism:
      "Thirty roses signify 'I am deeply in love with you' — a powerful declaration for milestone moments.",
  },
  {
    id: "regal-instablog",
    title: "Signature Red Bouquet",
    category: "Luxury Bouquets",
    badge: "Popular",
    image: "/images/regal/instablog9ja.jpg",
    stemPrice: "$7.00",
    bunchPrice: "$64.99",
    description:
      "A lush, full bouquet of premium red roses elegantly wrapped in white floral paper with a green leaf border. A signature arrangement that radiates sophistication and romance.",
    symbolism:
      "Red roses wrapped in white represent the harmony of passionate love and pure intentions.",
  },
  {
    id: "regal-belleza-box",
    title: "Belleza Box",
    category: "Luxury Bouquets",
    badge: "New",
    image: "/images/regal/regal-belleza-box.jpg",
    stemPrice: "$9.00",
    bunchPrice: "$94.99",
    description:
      "An exquisite round black box filled with richly coloured roses in deep reds and warm corals, creating a luxurious gift presentation. Ideal for special occasions where presentation matters as much as the blooms.",
    symbolism:
      "A box of mixed-colour roses expresses admiration, appreciation, and heartfelt affection.",
  },
  {
    id: "regal-bells",
    title: "Bells of Ireland Bouquet",
    category: "Luxury Bouquets",
    badge: null,
    image: "/images/regal/regal-bells.jpg",
    stemPrice: "$6.50",
    bunchPrice: "$59.99",
    description:
      "A striking tall bouquet featuring Bells of Ireland alongside vibrant roses, creating a dramatic green-and-red colour palette. An eye-catching arrangement that makes a bold statement.",
    symbolism:
      "Bells of Ireland symbolise good luck and fortune, making this the perfect gift for new ventures and celebrations.",
  },
  {
    id: "regal-chrysanthemums",
    title: "Chrysanthemum Bouquet",
    category: "Luxury Bouquets",
    badge: null,
    image: "/images/regal/regal-chrysanthemums.jpg",
    stemPrice: "$6.00",
    bunchPrice: "$54.99",
    description:
      "A vibrant, full bouquet of premium chrysanthemums in warm golden tones, bringing cheerful energy and long-lasting beauty. Chrysanthemums are celebrated for their exceptional vase life and colour variety.",
    symbolism:
      "Chrysanthemums symbolise joy, longevity, and optimism — a wonderful gift to celebrate achievements.",
  },
  {
    id: "regal-cool-classic",
    title: "Cool Classic Bouquet",
    category: "Luxury Bouquets",
    badge: "Popular",
    image: "/images/regal/regal-cool-classic.jpg",
    stemPrice: "$7.00",
    bunchPrice: "$64.99",
    description:
      "A beautifully curated cool classic arrangement featuring mixed blooms in soft purples, creamy whites, and blush pinks. Wrapped in elegant craft paper, this bouquet offers timeless sophistication.",
    symbolism:
      "Cool-toned blooms represent grace, elegance, and admiration — a refined choice for those with discerning taste.",
  },
  {
    id: "regal-mixed-million-stars",
    title: "Mixed Roses & Million Stars",
    category: "Luxury Bouquets",
    badge: "Trending",
    image: "/images/regal/regal-mixed-roses-million-stars.jpg",
    stemPrice: "$7.00",
    bunchPrice: "$69.99",
    description:
      "A captivating combination of colourful mixed roses set against a backdrop of delicate white million stars gypsophila. The varied rose colours create a joyful, celebratory feel ideal for birthdays and special occasions.",
    symbolism:
      "Mixed roses with gypsophila represent friendship, variety, and the beauty of life's many colours.",
  },
  {
    id: "regal-mixed-yellow-red",
    title: "Yellow & Red Rose Mix",
    category: "Luxury Bouquets",
    badge: null,
    image: "/images/regal/regal-mixed-roses-yellow-red.jpg",
    stemPrice: "$7.00",
    bunchPrice: "$64.99",
    description:
      "A bold, vibrant bouquet pairing warm yellow roses with deep red ones, creating a striking colour contrast full of energy and warmth. Perfect for celebrations and heartfelt congratulations.",
    symbolism:
      "Yellow and red roses together express joy mixed with passion — congratulations with a heartfelt edge.",
  },
  {
    id: "regal-mon-coeur",
    title: "Mon Coeur Roses",
    category: "Luxury Bouquets",
    badge: "New",
    image: "/images/regal/regal-mon-couer-roses.jpg",
    stemPrice: "$8.00",
    bunchPrice: "$84.99",
    description:
      "An elegant round bouquet of deep burgundy and crimson roses with lush green foliage, evoking old-world romance and classic floristry. Mon Coeur — My Heart — is a tribute to timeless love.",
    symbolism: "Deep burgundy roses symbolise unconscious beauty and deep, enduring love.",
  },
  {
    id: "regal-popular-bundled",
    title: "Popular Bundled Roses",
    category: "Luxury Bouquets",
    badge: "Popular",
    image: "/images/regal/regal-popular-bundled.jpg",
    stemPrice: "$6.50",
    bunchPrice: "$54.99",
    description:
      "A charmingly bundled arrangement of mixed red and pink roses, casually styled for a natural, just-picked feel. This popular everyday bouquet brings colour and warmth to any space.",
    symbolism: "Mixed pink and red roses convey affection, gratitude, and warm-hearted love.",
  },
  {
    id: "regal-popular-fresh",
    title: "Fresh Rose Wrap",
    category: "Luxury Bouquets",
    badge: null,
    image: "/images/regal/regal-popular-fresh.jpg",
    stemPrice: "$6.00",
    bunchPrice: "$49.99",
    description:
      "A fresh, garden-inspired hand-tied bouquet featuring a colourful mix of roses in shades of pink, red, and white. Wrapped simply to show off the natural beauty of the blooms.",
    symbolism: "A fresh mixed-rose bouquet celebrates all forms of love and heartfelt emotion.",
  },
  {
    id: "regal-red-roses-one",
    title: "Classic Red Rose Bouquet",
    category: "Luxury Bouquets",
    badge: "Popular",
    image: "/images/regal/regal-red-roses-bouquet-one.jpg",
    stemPrice: "$7.00",
    bunchPrice: "$64.99",
    description:
      "A quintessential bouquet of premium red roses elegantly wrapped in white tissue and craft paper. Clean, classic, and always impressive — this is the bouquet that never goes out of style.",
    symbolism: "Red roses are the universal language of love, passion, and deep romantic feeling.",
  },
  {
    id: "regal-red-ferrero",
    title: "Red Roses & Ferrero Gift",
    category: "Luxury Bouquets",
    badge: "Premium",
    image: "/images/regal/regal-red-roses-ferrero.jpg",
    stemPrice: "$8.50",
    bunchPrice: "$99.99",
    description:
      "The ultimate romantic gift combination: a lush bouquet of premium red roses paired with a box of Ferrero Rocher chocolates. Indulgent, luxurious, and guaranteed to delight.",
    symbolism:
      "Roses and chocolates together are the timeless symbol of romance, indulgence, and thoughtful affection.",
  },
];

