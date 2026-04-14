export type Money = {
  amount: string;
  currencyCode: string;
};

export type ProductImage = {
  url: string;
  altText: string | null;
  width?: number;
  height?: number;
};

export type ProductVariant = {
  id: string;
  title: string;
  price: Money;
  availableForSale: boolean;
  selectedOptions: { name: string; value: string }[];
  image?: ProductImage | null;
};

export type ProductOption = {
  name: string;
  values: string[];
};

export type Product = {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml?: string;
  tags: string[];
  collectionHandles?: string[];
  priceRange: {
    minVariantPrice: Money;
    maxVariantPrice: Money;
  };
  featuredImage: ProductImage | null;
  images: ProductImage[];
  turntableImages?: ProductImage[];
  options: ProductOption[];
  variants: ProductVariant[];
  availableForSale: boolean;
  createdAt?: string;
  story?: string;
};

export type Collection = {
  id: string;
  handle: string;
  title: string;
  description: string;
  productHandles: string[];
};

export type CartLine = {
  variantId: string;
  productHandle: string;
  productId: string;
  title: string;
  variantTitle: string;
  quantity: number;
  price: Money;
  image: ProductImage | null;
};

export type SortKey =
  | "featured"
  | "price-asc"
  | "price-desc"
  | "newest"
  | "popular";
