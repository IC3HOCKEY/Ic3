/**
 * Shopify Storefront API client.
 *
 * If SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN are set, queries
 * hit the real Storefront API over GraphQL. Otherwise, calls resolve from the
 * in-repo mock catalog so the site still ships a functional preview.
 *
 * Server-only. Do not import from client components.
 */
import "server-only";

import { mockCollections, mockProducts } from "./mock-data";
import type { Collection, Product } from "./types";

const domain = process.env.SHOPIFY_STORE_DOMAIN;
const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const apiVersion = process.env.SHOPIFY_API_VERSION ?? "2024-10";

export const isShopifyConfigured = Boolean(domain && token);

type GraphQLResponse<T> = {
  data?: T;
  errors?: { message: string }[];
};

async function shopifyFetch<T>(
  query: string,
  variables: Record<string, unknown> = {},
): Promise<T> {
  if (!domain || !token) {
    throw new Error(
      "Shopify is not configured — set SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN.",
    );
  }

  const endpoint = `https://${domain}/api/${apiVersion}/graphql.json`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
      Accept: "application/json",
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error(`Shopify request failed: ${response.status}`);
  }

  const json = (await response.json()) as GraphQLResponse<T>;
  if (json.errors?.length) {
    throw new Error(
      `Shopify GraphQL error: ${json.errors.map((e) => e.message).join("; ")}`,
    );
  }
  if (!json.data) {
    throw new Error("Shopify returned an empty response");
  }
  return json.data;
}

type ShopifyImage = {
  url: string;
  altText: string | null;
  width?: number;
  height?: number;
};

type ShopifyVariant = {
  id: string;
  title: string;
  price: { amount: string; currencyCode: string };
  availableForSale: boolean;
  selectedOptions: { name: string; value: string }[];
  image?: ShopifyImage | null;
};

type ShopifyProduct = {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml?: string;
  tags: string[];
  createdAt?: string;
  availableForSale: boolean;
  featuredImage: ShopifyImage | null;
  priceRange: {
    minVariantPrice: { amount: string; currencyCode: string };
    maxVariantPrice: { amount: string; currencyCode: string };
  };
  images: { edges: { node: ShopifyImage }[] };
  variants: { edges: { node: ShopifyVariant }[] };
  options: { name: string; values: string[] }[];
  collections?: { edges: { node: { handle: string } }[] };
};

function normalizeProduct(p: ShopifyProduct): Product {
  const images = p.images.edges.map(({ node }) => node);
  return {
    id: p.id,
    handle: p.handle,
    title: p.title,
    description: p.description,
    descriptionHtml: p.descriptionHtml,
    tags: p.tags,
    createdAt: p.createdAt,
    availableForSale: p.availableForSale,
    featuredImage: p.featuredImage,
    priceRange: p.priceRange,
    images,
    turntableImages: images,
    options: p.options,
    variants: p.variants.edges.map(({ node }) => node),
    collectionHandles:
      p.collections?.edges.map(({ node }) => node.handle) ?? [],
  };
}

const PRODUCT_FRAGMENT = /* GraphQL */ `
  fragment ProductFields on Product {
    id
    handle
    title
    description
    descriptionHtml
    tags
    createdAt
    availableForSale
    featuredImage {
      url
      altText
      width
      height
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 12) {
      edges {
        node {
          url
          altText
          width
          height
        }
      }
    }
    options {
      name
      values
    }
    variants(first: 50) {
      edges {
        node {
          id
          title
          availableForSale
          selectedOptions {
            name
            value
          }
          price {
            amount
            currencyCode
          }
          image {
            url
            altText
          }
        }
      }
    }
    collections(first: 10) {
      edges {
        node {
          handle
        }
      }
    }
  }
`;

export async function getProducts(): Promise<Product[]> {
  if (!isShopifyConfigured) return mockProducts;
  const data = await shopifyFetch<{
    products: { edges: { node: ShopifyProduct }[] };
  }>(
    /* GraphQL */ `
      ${PRODUCT_FRAGMENT}
      query Products {
        products(first: 50, sortKey: CREATED_AT, reverse: true) {
          edges {
            node {
              ...ProductFields
            }
          }
        }
      }
    `,
  );
  return data.products.edges.map(({ node }) => normalizeProduct(node));
}

export async function getProduct(handle: string): Promise<Product | null> {
  if (!isShopifyConfigured) {
    return mockProducts.find((p) => p.handle === handle) ?? null;
  }
  const data = await shopifyFetch<{ product: ShopifyProduct | null }>(
    /* GraphQL */ `
      ${PRODUCT_FRAGMENT}
      query ProductByHandle($handle: String!) {
        product(handle: $handle) {
          ...ProductFields
        }
      }
    `,
    { handle },
  );
  return data.product ? normalizeProduct(data.product) : null;
}

export async function getCollections(): Promise<Collection[]> {
  if (!isShopifyConfigured) return mockCollections;
  const data = await shopifyFetch<{
    collections: {
      edges: {
        node: {
          id: string;
          handle: string;
          title: string;
          description: string;
          products: { edges: { node: { handle: string } }[] };
        };
      }[];
    };
  }>(
    /* GraphQL */ `
      query Collections {
        collections(first: 25) {
          edges {
            node {
              id
              handle
              title
              description
              products(first: 50) {
                edges {
                  node {
                    handle
                  }
                }
              }
            }
          }
        }
      }
    `,
  );
  return data.collections.edges.map(({ node }) => ({
    id: node.id,
    handle: node.handle,
    title: node.title,
    description: node.description,
    productHandles: node.products.edges.map(({ node: p }) => p.handle),
  }));
}

export async function getCollection(handle: string): Promise<Collection | null> {
  const all = await getCollections();
  return all.find((c) => c.handle === handle) ?? null;
}

type ShopifyCart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: { amount: string; currencyCode: string };
    totalAmount: { amount: string; currencyCode: string };
  };
};

const CART_FRAGMENT = /* GraphQL */ `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
      totalAmount {
        amount
        currencyCode
      }
    }
  }
`;

export async function createCart(): Promise<ShopifyCart> {
  const data = await shopifyFetch<{
    cartCreate: { cart: ShopifyCart; userErrors: { message: string }[] };
  }>(/* GraphQL */ `
    ${CART_FRAGMENT}
    mutation {
      cartCreate {
        cart { ...CartFields }
        userErrors { message }
      }
    }
  `);
  if (data.cartCreate.userErrors.length) {
    throw new Error(data.cartCreate.userErrors.map((e) => e.message).join("; "));
  }
  return data.cartCreate.cart;
}

export async function addCartLines(
  cartId: string,
  lines: { merchandiseId: string; quantity: number }[],
): Promise<ShopifyCart> {
  const data = await shopifyFetch<{
    cartLinesAdd: { cart: ShopifyCart; userErrors: { message: string }[] };
  }>(
    /* GraphQL */ `
      ${CART_FRAGMENT}
      mutation ($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
          cart { ...CartFields }
          userErrors { message }
        }
      }
    `,
    { cartId, lines },
  );
  if (data.cartLinesAdd.userErrors.length) {
    throw new Error(
      data.cartLinesAdd.userErrors.map((e) => e.message).join("; "),
    );
  }
  return data.cartLinesAdd.cart;
}
