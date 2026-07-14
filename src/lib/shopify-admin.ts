/**
 * Shopify Admin API client for the site backend ("IC3 Site Backend" app).
 *
 * Authenticates with OAuth client credentials (SHOPIFY_ADMIN_CLIENT_ID /
 * SHOPIFY_ADMIN_CLIENT_SECRET) and caches the short-lived access token in
 * module scope. Used by the contact and newsletter API routes to store all
 * customer data directly in Shopify — no third-party services.
 *
 * Server-only. Do not import from client components.
 */
import "server-only";

const domain = process.env.SHOPIFY_STORE_DOMAIN;
const clientId = process.env.SHOPIFY_ADMIN_CLIENT_ID;
const clientSecret = process.env.SHOPIFY_ADMIN_CLIENT_SECRET;
const ADMIN_API_VERSION = "2025-07";

export const isAdminConfigured = Boolean(domain && clientId && clientSecret);

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (!domain || !clientId || !clientSecret) {
    throw new Error(
      "Shopify Admin API is not configured — set SHOPIFY_ADMIN_CLIENT_ID and SHOPIFY_ADMIN_CLIENT_SECRET.",
    );
  }
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token;
  }
  const res = await fetch(`https://${domain}/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "client_credentials",
    }),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Failed to get Shopify admin token: ${res.status}`);
  }
  const json = (await res.json()) as {
    access_token: string;
    expires_in: number;
  };
  cachedToken = {
    token: json.access_token,
    // refresh a minute before actual expiry
    expiresAt: Date.now() + (json.expires_in - 60) * 1000,
  };
  return json.access_token;
}

async function adminGraphql<T>(
  query: string,
  variables: Record<string, unknown> = {},
): Promise<T> {
  const token = await getAccessToken();
  const res = await fetch(
    `https://${domain}/admin/api/${ADMIN_API_VERSION}/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": token,
      },
      body: JSON.stringify({ query, variables }),
      cache: "no-store",
    },
  );
  if (!res.ok) {
    throw new Error(`Shopify Admin API request failed: ${res.status}`);
  }
  const json = (await res.json()) as {
    data?: T;
    errors?: { message: string }[];
  };
  if (json.errors?.length) {
    throw new Error(
      `Shopify Admin GraphQL error: ${json.errors.map((e) => e.message).join("; ")}`,
    );
  }
  if (!json.data) throw new Error("Shopify Admin API returned no data");
  return json.data;
}

type CustomerNode = { id: string; note: string | null; tags: string[] };

async function findCustomerByEmail(
  email: string,
): Promise<CustomerNode | null> {
  const data = await adminGraphql<{
    customers: { edges: { node: CustomerNode }[] };
  }>(
    /* GraphQL */ `
      query ($query: String!) {
        customers(first: 1, query: $query) {
          edges {
            node {
              id
              note
              tags
            }
          }
        }
      }
    `,
    { query: `email:'${email.replace(/'/g, "")}'` },
  );
  return data.customers.edges[0]?.node ?? null;
}

function assertNoUserErrors(
  label: string,
  userErrors: { message: string }[] | undefined,
) {
  if (userErrors?.length) {
    throw new Error(
      `${label}: ${userErrors.map((e) => e.message).join("; ")}`,
    );
  }
}

/**
 * Newsletter signup → Shopify customer with email marketing consent
 * (single opt-in) and the "nyhetsbrev" tag. Idempotent for repeat signups.
 */
export async function upsertNewsletterSubscriber(email: string): Promise<void> {
  const existing = await findCustomerByEmail(email);
  const consent = {
    marketingState: "SUBSCRIBED",
    marketingOptInLevel: "SINGLE_OPT_IN",
  };

  if (existing) {
    const data = await adminGraphql<{
      customerEmailMarketingConsentUpdate: {
        userErrors: { message: string }[];
      };
    }>(
      /* GraphQL */ `
        mutation ($input: CustomerEmailMarketingConsentUpdateInput!) {
          customerEmailMarketingConsentUpdate(input: $input) {
            userErrors {
              message
            }
          }
        }
      `,
      { input: { customerId: existing.id, emailMarketingConsent: consent } },
    );
    assertNoUserErrors(
      "consent update",
      data.customerEmailMarketingConsentUpdate.userErrors,
    );
    if (!existing.tags.includes("nyhetsbrev")) {
      const tagData = await adminGraphql<{
        tagsAdd: { userErrors: { message: string }[] };
      }>(
        /* GraphQL */ `
          mutation ($id: ID!, $tags: [String!]!) {
            tagsAdd(id: $id, tags: $tags) {
              userErrors {
                message
              }
            }
          }
        `,
        { id: existing.id, tags: ["nyhetsbrev"] },
      );
      assertNoUserErrors("tag add", tagData.tagsAdd.userErrors);
    }
    return;
  }

  const data = await adminGraphql<{
    customerCreate: {
      customer: { id: string } | null;
      userErrors: { message: string }[];
    };
  }>(
    /* GraphQL */ `
      mutation ($input: CustomerInput!) {
        customerCreate(input: $input) {
          customer {
            id
          }
          userErrors {
            message
          }
        }
      }
    `,
    {
      input: {
        email,
        tags: ["nyhetsbrev"],
        emailMarketingConsent: consent,
      },
    },
  );
  assertNoUserErrors("customer create", data.customerCreate.userErrors);
}

/**
 * Contact form → message stored as a note on the Shopify customer record,
 * tagged "kontaktformular" (used by Shopify Flow to notify the team).
 */
export async function recordContactMessage(input: {
  name: string;
  email: string;
  topic: string;
  message: string;
}): Promise<void> {
  const stamp = new Date().toISOString().slice(0, 16).replace("T", " ");
  const entry = `[${stamp} UTC] ${input.topic}\nFrån: ${input.name}\n${input.message}`;

  const existing = await findCustomerByEmail(input.email);

  if (existing) {
    const note = existing.note ? `${entry}\n\n---\n\n${existing.note}` : entry;
    const data = await adminGraphql<{
      customerUpdate: { userErrors: { message: string }[] };
    }>(
      /* GraphQL */ `
        mutation ($input: CustomerInput!) {
          customerUpdate(input: $input) {
            userErrors {
              message
            }
          }
        }
      `,
      // Shopify notes cap at 5000 chars — keep the newest messages.
      { input: { id: existing.id, note: note.slice(0, 4900) } },
    );
    assertNoUserErrors("customer update", data.customerUpdate.userErrors);
    const tagData = await adminGraphql<{
      tagsAdd: { userErrors: { message: string }[] };
    }>(
      /* GraphQL */ `
        mutation ($id: ID!, $tags: [String!]!) {
          tagsAdd(id: $id, tags: $tags) {
            userErrors {
              message
            }
          }
        }
      `,
      { id: existing.id, tags: ["kontaktformular"] },
    );
    assertNoUserErrors("tag add", tagData.tagsAdd.userErrors);
    return;
  }

  const [firstName, ...rest] = input.name.split(/\s+/);
  const data = await adminGraphql<{
    customerCreate: {
      customer: { id: string } | null;
      userErrors: { message: string }[];
    };
  }>(
    /* GraphQL */ `
      mutation ($input: CustomerInput!) {
        customerCreate(input: $input) {
          customer {
            id
          }
          userErrors {
            message
          }
        }
      }
    `,
    {
      input: {
        email: input.email,
        firstName,
        lastName: rest.join(" ") || undefined,
        note: entry.slice(0, 4900),
        tags: ["kontaktformular"],
      },
    },
  );
  assertNoUserErrors("customer create", data.customerCreate.userErrors);
}
