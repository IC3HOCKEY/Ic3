import type { Collection, Product } from "./types";

const sek = (amount: string) => ({ amount, currencyCode: "SEK" });

const dropImages = [
  "/images/limited-drop/KepsD1.jpeg",
  "/images/limited-drop/KepsD2.jpeg",
  "/images/limited-drop/KepsD3.jpeg",
  "/images/limited-drop/KepsD4.jpeg",
  "/images/limited-drop/KepsD5.jpeg",
  "/images/limited-drop/KepsD6.jpeg",
  "/images/limited-drop/KepsD7.jpeg",
  "/images/limited-drop/KepsD.jpeg",
];

const makeImage = (url: string, alt: string, w = 1200, h = 1200) => ({
  url,
  altText: alt,
  width: w,
  height: h,
});

export const mockProducts: Product[] = [
  {
    id: "mock-face-off-cap",
    handle: "face-off-cap",
    title: "IC3 Drop 01 — Face-Off Cap",
    description:
      "Den limiterade premiärkepsen från IC3. Strukturerad 6-panel med broderad frontlogga, curved brim och metallspänne. Producerad i en upplaga om 250 exemplar. Stilren, självsäker och full av attityd.",
    tags: ["hats", "drop-01", "limited"],
    collectionHandles: ["drop-01", "hats"],
    priceRange: {
      minVariantPrice: sek("499.00"),
      maxVariantPrice: sek("499.00"),
    },
    featuredImage: makeImage(dropImages[0], "IC3 Face-Off Cap front"),
    images: dropImages.map((src, i) =>
      makeImage(src, `IC3 Face-Off Cap angle ${i + 1}`),
    ),
    turntableImages: dropImages.map((src, i) =>
      makeImage(src, `IC3 Face-Off Cap rotation ${i + 1}`),
    ),
    options: [{ name: "Size", values: ["One size"] }],
    variants: [
      {
        id: "mock-variant-face-off-cap-one",
        title: "One size",
        price: sek("499.00"),
        availableForSale: false,
        selectedOptions: [{ name: "Size", value: "One size" }],
        image: makeImage(dropImages[0], "IC3 Face-Off Cap"),
      },
    ],
    availableForSale: false,
    createdAt: "2025-12-01T00:00:00Z",
    story:
      "Född ur kalla hallar och sena kvällar på isen. Drop 01 är vår kärleksförklaring till hockeykulturen — översatt till gatan.",
  },
  {
    id: "mock-ice-hoodie",
    handle: "ice-hoodie",
    title: "IC3 Heavyweight Hoodie — Ice",
    description:
      "450 g tung bomullshoodie med screentryckt IC3-logga i ryggen och liten broderad logga över hjärtat. Oversized passform, dubbellagrad huva och kängurufick. Byggd för långa hockeynätter.",
    tags: ["hoodies", "core", "ice"],
    collectionHandles: ["hoodies"],
    priceRange: {
      minVariantPrice: sek("899.00"),
      maxVariantPrice: sek("899.00"),
    },
    featuredImage: makeImage(
      "/images/brand/Hemsida-1.JPG",
      "IC3 Ice Hoodie frontbild",
    ),
    images: [
      makeImage("/images/brand/Hemsida-1.JPG", "IC3 Ice Hoodie front"),
      makeImage("/images/brand/Hemsida-2.png", "IC3 Ice Hoodie sida"),
      makeImage("/images/brand/Hemsida-3.png", "IC3 Ice Hoodie bakbild"),
    ],
    options: [{ name: "Size", values: ["S", "M", "L", "XL"] }],
    variants: ["S", "M", "L", "XL"].map((size, i) => ({
      id: `mock-variant-ice-hoodie-${size.toLowerCase()}`,
      title: size,
      price: sek("899.00"),
      availableForSale: i < 3,
      selectedOptions: [{ name: "Size", value: size }],
      image: makeImage("/images/brand/Hemsida-1.JPG", `IC3 Ice Hoodie ${size}`),
    })),
    availableForSale: true,
    createdAt: "2025-11-01T00:00:00Z",
  },
  {
    id: "mock-rink-tee",
    handle: "rink-tee",
    title: "IC3 Rink Tee — Off White",
    description:
      "Boxy oversized tee i 240 g ringspun bomull. IC3-wordmark i brösthöjd, liten grafik vid nederkanten. Passar lika bra på läktaren som på stan.",
    tags: ["tees", "core"],
    collectionHandles: ["tees"],
    priceRange: {
      minVariantPrice: sek("449.00"),
      maxVariantPrice: sek("449.00"),
    },
    featuredImage: makeImage(
      "/images/drop1/Drop1-4.jpeg",
      "IC3 Rink Tee frontbild",
    ),
    images: [
      makeImage("/images/drop1/Drop1-4.jpeg", "IC3 Rink Tee front"),
      makeImage("/images/drop1/Drop1-7.jpeg", "IC3 Rink Tee on location"),
      makeImage("/images/drop1/Drop1-2.jpeg", "IC3 Rink Tee detail"),
    ],
    options: [{ name: "Size", values: ["S", "M", "L", "XL"] }],
    variants: ["S", "M", "L", "XL"].map((size) => ({
      id: `mock-variant-rink-tee-${size.toLowerCase()}`,
      title: size,
      price: sek("449.00"),
      availableForSale: true,
      selectedOptions: [{ name: "Size", value: size }],
      image: makeImage("/images/drop1/Drop1-4.jpeg", `IC3 Rink Tee ${size}`),
    })),
    availableForSale: true,
    createdAt: "2025-10-15T00:00:00Z",
  },
  {
    id: "mock-puck-beanie",
    handle: "puck-beanie",
    title: "IC3 Puck Beanie — Navy",
    description:
      "Ribbstickad mössa i merinoblend med broderad patch. Kupad passform, blir varmare ju kallare det blir i hallen.",
    tags: ["accessories", "beanies", "core"],
    collectionHandles: ["accessories"],
    priceRange: {
      minVariantPrice: sek("349.00"),
      maxVariantPrice: sek("349.00"),
    },
    featuredImage: makeImage("/images/keps/keps2.png", "IC3 Puck Beanie"),
    images: [
      makeImage("/images/keps/keps2.png", "IC3 Puck Beanie front"),
      makeImage("/images/keps/keps1.png", "IC3 Puck Beanie detail"),
      makeImage("/images/keps/keps3.png", "IC3 Puck Beanie angle"),
    ],
    options: [{ name: "Size", values: ["One size"] }],
    variants: [
      {
        id: "mock-variant-puck-beanie-one",
        title: "One size",
        price: sek("349.00"),
        availableForSale: true,
        selectedOptions: [{ name: "Size", value: "One size" }],
        image: makeImage("/images/keps/keps2.png", "IC3 Puck Beanie"),
      },
    ],
    availableForSale: true,
    createdAt: "2025-09-01T00:00:00Z",
  },
  {
    id: "mock-crease-crew",
    handle: "crease-crew",
    title: "IC3 Crease Crewneck — Graphite",
    description:
      "Premium crewneck i 420 g borstad bomull. Broderad logotyp, förstärkta sömmar, tvättad för mjuk känsla från första dagen.",
    tags: ["hoodies", "crewneck", "core"],
    collectionHandles: ["hoodies"],
    priceRange: {
      minVariantPrice: sek("849.00"),
      maxVariantPrice: sek("849.00"),
    },
    featuredImage: makeImage(
      "/images/drop1/Drop1-3.jpeg",
      "IC3 Crease Crewneck",
    ),
    images: [
      makeImage("/images/drop1/Drop1-3.jpeg", "IC3 Crease Crewneck front"),
      makeImage("/images/drop1/Drop1-5.jpeg", "IC3 Crease Crewneck sida"),
      makeImage("/images/drop1/Drop1-6.jpeg", "IC3 Crease Crewneck detail"),
    ],
    options: [{ name: "Size", values: ["S", "M", "L", "XL"] }],
    variants: ["S", "M", "L", "XL"].map((size) => ({
      id: `mock-variant-crease-crew-${size.toLowerCase()}`,
      title: size,
      price: sek("849.00"),
      availableForSale: true,
      selectedOptions: [{ name: "Size", value: size }],
      image: makeImage(
        "/images/drop1/Drop1-3.jpeg",
        `IC3 Crease Crewneck ${size}`,
      ),
    })),
    availableForSale: true,
    createdAt: "2025-08-01T00:00:00Z",
  },
  {
    id: "mock-overtime-tote",
    handle: "overtime-tote",
    title: "IC3 Overtime Tote — Ice",
    description:
      "Canvas-tote med förstärkta handtag och screentryckt logga. Rymmer en full matchutrustning eller en helg av drop-bilder.",
    tags: ["accessories", "bags"],
    collectionHandles: ["accessories"],
    priceRange: {
      minVariantPrice: sek("299.00"),
      maxVariantPrice: sek("299.00"),
    },
    featuredImage: makeImage("/images/brand/om.oss.png", "IC3 Overtime Tote"),
    images: [makeImage("/images/brand/om.oss.png", "IC3 Overtime Tote")],
    options: [{ name: "Size", values: ["One size"] }],
    variants: [
      {
        id: "mock-variant-overtime-tote-one",
        title: "One size",
        price: sek("299.00"),
        availableForSale: true,
        selectedOptions: [{ name: "Size", value: "One size" }],
        image: makeImage("/images/brand/om.oss.png", "IC3 Overtime Tote"),
      },
    ],
    availableForSale: true,
    createdAt: "2025-07-01T00:00:00Z",
  },
];

export const mockCollections: Collection[] = [
  {
    id: "mock-col-drop-01",
    handle: "drop-01",
    title: "Drop 01",
    description:
      "Premiärdroppen. En limiterad kollektion som firar hockeylivet utanför isen.",
    productHandles: ["face-off-cap"],
  },
  {
    id: "mock-col-hats",
    handle: "hats",
    title: "Headwear",
    description: "Kepsar och mössor som bär dig från hallen till stan.",
    productHandles: ["face-off-cap", "puck-beanie"],
  },
  {
    id: "mock-col-hoodies",
    handle: "hoodies",
    title: "Hoodies & Crews",
    description: "Tunga bomullsplagg byggda för nordiska kvällar.",
    productHandles: ["ice-hoodie", "crease-crew"],
  },
  {
    id: "mock-col-tees",
    handle: "tees",
    title: "Tees",
    description: "Oversized vardagsplagg med IC3-attityd.",
    productHandles: ["rink-tee"],
  },
  {
    id: "mock-col-accessories",
    handle: "accessories",
    title: "Accessories",
    description: "De sista detaljerna i hockey-uniformen.",
    productHandles: ["puck-beanie", "overtime-tote"],
  },
];
