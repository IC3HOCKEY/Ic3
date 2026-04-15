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
      "Den limiterade premiärkepsen från IC3. Strukturerad 6-panel med broderad frontlogga, curved brim och metallspänne. Producerad i en upplaga om 250 exemplar. Stilren, självsäker och full av attityd. Just nu slutsåld — en eventuell restock annonseras via nyhetsbrevet.",
    tags: ["hats", "drop-01", "limited"],
    collectionHandles: ["drop-01"],
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
      "Född ur kalla hallar och sena kvällar på isen. Drop 01 är vår kärleksförklaring till hockeykulturen — översatt till gatan. Inget Drop 02 är planerat, men håll utkik: vi utvärderar en restock av Face-Off Cap.",
  },
];

export const mockCollections: Collection[] = [
  {
    id: "mock-col-drop-01",
    handle: "drop-01",
    title: "Drop 01",
    description:
      "Premiärdroppen. En limiterad keps som firar hockeylivet utanför isen.",
    productHandles: ["face-off-cap"],
  },
];
