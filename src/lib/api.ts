import { Category, Product } from "@/types";
import fallbackCategories from "@/data/categories.json";
import fallbackProducts from "@/data/products.json";

const PRIMARY_BASE_URL = "https://openapi.programming-hero.com/api/bazardor";
const FALLBACK_BASE_URL_1 = "https://api.abcz.workers.dev/api/bazardor";
const FALLBACK_BASE_URL_2 = "https://api.api-store.workers.dev/api/bazardor";

async function fetchWithFallback<T>(path: string, fallbackData: T): Promise<T> {
  const urls = [
    `${PRIMARY_BASE_URL}${path}`,
    `${FALLBACK_BASE_URL_1}${path}`,
    `${FALLBACK_BASE_URL_2}${path}`,
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url, {
        next: { revalidate: 60 },
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        const json = await res.json();
        if (json && (Array.isArray(json) ? json.length >= 0 : true)) {
          return json as T;
        }
      }
    } catch {
      // Continue to next URL on network/timeout error
    }
  }

  // If both endpoints fail or hit rate limits (429), return local cached dataset
  return fallbackData;
}

export async function getCategories(): Promise<Category[]> {
  return fetchWithFallback<Category[]>("/categories", fallbackCategories as Category[]);
}

export async function getProducts(category?: string): Promise<Product[]> {
  const query = category ? `?category=${encodeURIComponent(category)}` : "";
  const allProducts = fallbackProducts as Product[];
  const fallback = category
    ? allProducts.filter((p) => p.category === category || p.slug === category)
    : allProducts;

  return fetchWithFallback<Product[]>(`/products${query}`, fallback);
}

export async function getProductBySlugOrId(slugOrId: string): Promise<Product | null> {
  const allProducts = fallbackProducts as Product[];
  const matchedLocal =
    allProducts.find((p) => String(p.id) === slugOrId || p.slug === slugOrId) || null;

  try {
    const isNumeric = /^\d+$/.test(slugOrId);
    const targetEndpoint = isNumeric ? `/products/${slugOrId}` : `/products/${slugOrId}`;
    const res = await fetchWithFallback<Product | Product[]>(targetEndpoint, matchedLocal as any);
    
    if (res && !Array.isArray(res) && (res as Product).id) {
      return res as Product;
    }
  } catch {
    // Return matched local
  }

  return matchedLocal;
}
