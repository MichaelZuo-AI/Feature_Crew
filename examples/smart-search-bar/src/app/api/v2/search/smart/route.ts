import { NextRequest, NextResponse } from "next/server";

import type {
  SmartSearchRequest,
  SmartSearchResponse,
  SearchResult,
  FilterChip,
  SpellCorrection,
} from "@/lib/types";
import { checkRateLimit } from "@/lib/rate-limiter";
import productsData from "@/data/products.json";

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

const KNOWN_COLORS = [
  "black",
  "white",
  "red",
  "blue",
  "green",
  "gray",
  "grey",
  "navy",
  "brown",
  "silver",
  "gold",
  "pink",
  "purple",
  "orange",
  "yellow",
];

const KNOWN_CATEGORIES = [
  ...new Set(products.map((p) => p.category.toLowerCase())),
];

const TYPO_MAP: Record<string, string> = {
  runing: "running",
  runnig: "running",
  runnign: "running",
  sheos: "shoes",
  shose: "shoes",
  eletronics: "electronics",
  elecrtonics: "electronics",
  headphons: "headphones",
  headpohnes: "headphones",
  wirless: "wireless",
  wierless: "wireless",
  snekers: "sneakers",
  sneekers: "sneakers",
  jaket: "jacket",
  jackt: "jacket",
  addidas: "adidas",
  nikee: "nike",
  samung: "samsung",
};

function correctTypos(query: string): SpellCorrection | null {
  const words = query.toLowerCase().split(/\s+/);
  let corrected = false;
  const fixed = words.map((w) => {
    if (TYPO_MAP[w]) {
      corrected = true;
      return TYPO_MAP[w];
    }
    return w;
  });
  if (!corrected) return null;
  return { original: query, corrected: fixed.join(" ") };
}

function parsePriceIntent(tokens: string[]): {
  priceMin: number | null;
  priceMax: number | null;
} {
  let priceMin: number | null = null;
  let priceMax: number | null = null;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const next = tokens[i + 1];
    const priceValue = next ? parseFloat(next.replace("$", "")) : NaN;

    if (token === "under" && !isNaN(priceValue)) {
      priceMax = priceValue;
    } else if (token === "over" && !isNaN(priceValue)) {
      priceMin = priceValue;
    } else if (token === "below" && !isNaN(priceValue)) {
      priceMax = priceValue;
    } else if (token === "above" && !isNaN(priceValue)) {
      priceMin = priceValue;
    }
  }
  return { priceMin, priceMax };
}

function toSearchResult(p: ProductEntry): SearchResult {
  return {
    productId: p.productId,
    title: p.title,
    thumbnail: p.thumbnail,
    price: p.price,
    rating: p.rating,
    badges: p.badges,
  };
}

// ---------------------------------------------------------------------------
// POST /api/v2/search/smart
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  let body: SmartSearchRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const {
    query = "",
    page = 1,
    pageSize = 20,
    sessionId = "anonymous",
    filters,
  } = body;

  // Rate-limit check
  const rl = checkRateLimit(sessionId);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests", retryAfter: rl.retryAfter },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter ?? 1) } },
    );
  }

  // Spell correction
  const spellCorrection = correctTypos(query);
  const effectiveQuery = spellCorrection ? spellCorrection.corrected : query;

  // Tokenize
  const tokens = effectiveQuery
    .toLowerCase()
    .replace(/[^a-z0-9$ ]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  // Parse intent from query
  const priceIntent = parsePriceIntent(tokens);
  const detectedColors = tokens.filter((t) => KNOWN_COLORS.includes(t));
  const detectedCategories = KNOWN_CATEGORIES.filter((cat) =>
    tokens.some((t) => cat.includes(t) || t.includes(cat.split(" ")[0])),
  );

  // Build effective filters (explicit filters override parsed intent)
  const effectivePriceMin =
    filters?.priceMin ?? priceIntent.priceMin;
  const effectivePriceMax =
    filters?.priceMax ?? priceIntent.priceMax;
  const effectiveCategories =
    filters?.categories?.length ? filters.categories : detectedCategories;

  // Filter products
  let matched = products;

  // Text matching (title, category, color, brand) if there is a query
  if (tokens.length > 0) {
    matched = matched.filter((p) => {
      const haystack =
        `${p.title} ${p.category} ${p.color} ${p.brand}`.toLowerCase();
      // At least one non-price/color/category token must match
      return tokens.some((t) => haystack.includes(t));
    });
  }

  // Price filters
  if (effectivePriceMin != null) {
    matched = matched.filter((p) => p.price.current >= effectivePriceMin);
  }
  if (effectivePriceMax != null) {
    matched = matched.filter((p) => p.price.current <= effectivePriceMax);
  }

  // Category filter
  if (effectiveCategories.length > 0) {
    matched = matched.filter((p) =>
      effectiveCategories.some((c) =>
        p.category.toLowerCase().includes(c.toLowerCase()),
      ),
    );
  }

  // Color filter from query
  if (detectedColors.length > 0 && !(filters?.attributes?.color)) {
    matched = matched.filter((p) =>
      detectedColors.some(
        (c) => p.color.toLowerCase() === c || (c === "grey" && p.color.toLowerCase() === "gray"),
      ),
    );
  }

  // Attribute filters
  if (filters?.attributes) {
    for (const [key, value] of Object.entries(filters.attributes)) {
      if (key === "color") {
        matched = matched.filter(
          (p) => p.color.toLowerCase() === value.toLowerCase(),
        );
      } else {
        matched = matched.filter(
          (p) =>
            p.attributes[key]?.toLowerCase() === value.toLowerCase(),
        );
      }
    }
  }

  const totalCount = matched.length;

  // Pagination
  const start = (page - 1) * pageSize;
  const results: SearchResult[] = matched
    .slice(start, start + pageSize)
    .map(toSearchResult);

  // Build parsedFilters
  const parsedFilters: Record<string, string | number> = {};
  if (priceIntent.priceMax != null) parsedFilters.priceMax = priceIntent.priceMax;
  if (priceIntent.priceMin != null) parsedFilters.priceMin = priceIntent.priceMin;
  if (detectedColors.length > 0) parsedFilters.color = detectedColors[0];
  if (detectedCategories.length > 0)
    parsedFilters.category = detectedCategories[0];

  // Suggested chips from parsed filters
  const suggestedChips: FilterChip[] = [];
  if (parsedFilters.priceMax != null)
    suggestedChips.push({
      key: "priceMax",
      value: parsedFilters.priceMax,
      label: `Under $${parsedFilters.priceMax}`,
    });
  if (parsedFilters.priceMin != null)
    suggestedChips.push({
      key: "priceMin",
      value: parsedFilters.priceMin,
      label: `Over $${parsedFilters.priceMin}`,
    });
  if (parsedFilters.color)
    suggestedChips.push({
      key: "color",
      value: parsedFilters.color,
      label:
        String(parsedFilters.color).charAt(0).toUpperCase() +
        String(parsedFilters.color).slice(1),
    });
  if (parsedFilters.category)
    suggestedChips.push({
      key: "category",
      value: parsedFilters.category,
      label:
        String(parsedFilters.category).charAt(0).toUpperCase() +
        String(parsedFilters.category).slice(1),
    });

  // Suggestions: other categories that are related
  const matchedCategories = [...new Set(matched.map((p) => p.category))];
  const suggestions = matchedCategories
    .filter((c) => c !== detectedCategories[0])
    .slice(0, 4)
    .map((c) => `${c}`);

  const response: SmartSearchResponse = {
    results,
    totalCount,
    parsedFilters,
    suggestedChips,
    suggestions,
    spellCorrection,
  };

  return NextResponse.json(response);
}
