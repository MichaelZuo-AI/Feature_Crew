import { NextRequest, NextResponse } from "next/server";

import type { SuggestionsResponse, Suggestion } from "@/lib/types";
import { SuggestionType } from "@/lib/types";
import productsData from "@/data/products.json";

// ISR: revalidate trending data every 15 minutes (AC-6)
export const revalidate = 900;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

interface ProductEntry {
  productId: string;
  title: string;
  thumbnail: string;
  price: { current: number; original: number | null; currency: string };
  rating: { average: number; count: number };
  badges: string[];
  category: string;
  color: string;
  brand: string;
  attributes: Record<string, string>;
}

const products = productsData as unknown as ProductEntry[];

const TRENDING: string[] = [
  "wireless earbuds",
  "spring jacket",
  "protein powder",
  "running shoes",
  "smart watch",
];

// ---------------------------------------------------------------------------
// GET /api/v2/search/suggestions
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").trim();
  const limit = Math.min(
    Math.max(parseInt(searchParams.get("limit") ?? "8", 10) || 8, 1),
    20,
  );

  // If no query, return only trending
  if (!q) {
    const response: SuggestionsResponse = {
      suggestions: [],
      trending: TRENDING,
    };
    return NextResponse.json(response);
  }

  const lower = q.toLowerCase();
  const suggestions: Suggestion[] = [];

  // ---- QUERY suggestions: titles / categories that contain the query ------
  const seenTexts = new Set<string>();

  // Category matches first
  const categories = [...new Set(products.map((p) => p.category))];
  for (const cat of categories) {
    if (cat.toLowerCase().includes(lower) && !seenTexts.has(cat)) {
      seenTexts.add(cat);
      const count = products.filter((p) => p.category === cat).length;
      suggestions.push({
        text: cat,
        type: SuggestionType.CATEGORY,
        resultCount: count,
        categoryId: cat.toLowerCase().replace(/\s+/g, "-"),
      });
    }
  }

  // Title-based query suggestions
  for (const p of products) {
    if (suggestions.length >= limit) break;
    const titleLower = p.title.toLowerCase();
    if (titleLower.includes(lower) && !seenTexts.has(p.title)) {
      seenTexts.add(p.title);
      suggestions.push({
        text: p.title,
        type: SuggestionType.QUERY,
        resultCount: 1,
      });
    }
  }

  // Brand matches as query suggestions
  const brands = [...new Set(products.map((p) => p.brand))];
  for (const brand of brands) {
    if (suggestions.length >= limit) break;
    if (
      brand.toLowerCase().includes(lower) &&
      !seenTexts.has(brand)
    ) {
      seenTexts.add(brand);
      const count = products.filter((p) => p.brand === brand).length;
      suggestions.push({
        text: brand,
        type: SuggestionType.QUERY,
        resultCount: count,
      });
    }
  }

  // ---- PRODUCT suggestions: top matching products -------------------------
  const productMatches = products
    .filter((p) => {
      const haystack =
        `${p.title} ${p.category} ${p.color} ${p.brand}`.toLowerCase();
      return haystack.includes(lower);
    })
    .slice(0, Math.min(3, limit));

  for (const p of productMatches) {
    suggestions.push({
      text: p.title,
      type: SuggestionType.PRODUCT,
      productId: p.productId,
      thumbnail: p.thumbnail,
    });
  }

  // Trim to limit
  const trimmed = suggestions.slice(0, limit);

  const response: SuggestionsResponse = {
    suggestions: trimmed,
    trending: TRENDING,
  };

  return NextResponse.json(response);
}
