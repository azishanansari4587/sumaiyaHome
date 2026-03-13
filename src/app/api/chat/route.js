import { NextResponse } from "next/server";
import connection from "@/lib/connection";

// ─── Helpers ───────────────────────────────────────────────────────────────

const safeParseJSON = (str, fallback = []) => {
  try {
    const parsed = typeof str === "string" ? JSON.parse(str) : str;
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
};

// ─── Keyword Maps ───────────────────────────────────────────────────────────

const CATEGORY_KEYWORDS = {
  rugs:           ["rug", "rugs", "carpet", "carpets"],
  "all rugs":     ["all rug", "all rugs"],
  natural:        ["natural", "jute", "wool", "sisal", "cotton", "eco"],
  "machine made": ["machine made", "machine-made", "machine"],
  novelty:        ["novelty", "novality", "creative", "unique"],
  poufs:          ["pouf", "poufs", "pouff", "ottoman", "floor cushion", "foot stool"],
  pillows:        ["pillow", "pillows", "cushion", "cushions"],
  throws:         ["throw", "throws", "blanket", "blankets"],
  decor:          ["decor", "decoration"],
  outdoor:        ["outdoor", "outside", "patio", "garden", "backyard"],
  tropical:       ["tropical", "beach", "summer", "hawaii"],
  beachbum:       ["beachbum", "beach bum", "coastal"],
  remnant:        ["remnant", "remnants", "leftover", "cut", "carpet remnant"],
  "casa residential": ["casa residential"],
  "casa room size":   ["casa room size"],
  "casa commercial":  ["casa commercial"],
  pinnacle:           ["pinnacle", "pinacal"],
};

const SIZE_PATTERNS = [
  /(\d+(?:\.\d+)?)\s*[''x×']\s*(\d+(?:\.\d+)?)\s*[''']?/gi,
  /(\d+)x(\d+)/gi,
  /(\d+)\s*by\s*(\d+)/gi,
  /"(\d+(?:\.\d+)?)x(\d+(?:\.\d+)?)"/gi,
];

const COLOR_KEYWORDS = [
  "red","blue","green","yellow","orange","pink","purple","black","white","grey",
  "gray","brown","beige","cream","navy","teal","ivory","gold","silver","charcoal",
  "natural","multi","multicolor","tan","rust","sage","olive","terracotta",
];

const MATERIAL_KEYWORDS = [
  "jute","wool","polypropylene","cotton","polyester","nylon","bamboo","sisal","seagrass","chenille","viscose","silk"
];

// ─── NLP Extract Intent ──────────────────────────────────────────────────────

function extractIntent(text) {
  const lower = text.toLowerCase();
  const intent = { categories: [], sizes: [], colors: [], materials: [], isGreeting: false, isTooVague: false };

  // Greeting
  if (/^(hi|hello|hey|salaam|aoa|namaste|hii|helo|salam)\b/.test(lower.trim())) {
    intent.isGreeting = true;
    return intent;
  }

  // Categories
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(k => lower.includes(k))) {
      intent.categories.push(cat);
    }
  }

  // Sizes
  for (const pattern of SIZE_PATTERNS) {
    pattern.lastIndex = 0;
    let match;
    while ((match = pattern.exec(lower)) !== null) {
      intent.sizes.push(`${match[1]}' x ${match[2]}'`);
    }
  }

  // Colors
  for (const color of COLOR_KEYWORDS) {
    if (lower.includes(color)) intent.colors.push(color);
  }

  // Materials
  for (const mat of MATERIAL_KEYWORDS) {
    if (lower.includes(mat)) intent.materials.push(mat);
  }

  // Too vague?
  if (!intent.categories.length && !intent.sizes.length && !intent.colors.length && !intent.materials.length) {
    intent.isTooVague = true;
  }

  return intent;
}

// ─── Match single product against intent ────────────────────────────────────

function matchesIntent(product, intent) {
  const tags = safeParseJSON(product.tags);
  const tagLower = tags.map(t => t.toLowerCase().trim());
  const sizes = safeParseJSON(product.sizes).map(s => s.toLowerCase());
  const specs = safeParseJSON(product.specifications);
  const colors = Array.isArray(product.colors) ? product.colors : safeParseJSON(product.colors);

  let score = 0;

  // Category match
  if (intent.categories.length) {
    for (const cat of intent.categories) {
      if (tagLower.some(t => t === cat || t.replace(/s$/, "") === cat.replace(/s$/, ""))) {
        score += 2;
      }
    }
    if (score === 0) return null; // category specified but no match
  }

  // Size match
  if (intent.sizes.length) {
    const matched = intent.sizes.some(sz => {
      const normalized = sz.replace(/\s/g, "").replace(/'+/g, "");
      return sizes.some(s => s.replace(/\s/g, "").replace(/'+/g, "").includes(normalized));
    });
    if (!matched) return null;
    score += 1;
  }

  // Color match
  if (intent.colors.length) {
    const productColorNames = colors.map(c => (c.name || "").toLowerCase());
    const matched = intent.colors.some(c => productColorNames.some(pc => pc.includes(c)));
    if (!matched) return null;
    score += 1;
  }

  // Material match
  if (intent.materials.length) {
    const materialSpec = specs.find(s => s.key?.toLowerCase() === "material");
    const matValue = (materialSpec?.value || "").toLowerCase();
    const matched = intent.materials.some(m => matValue.includes(m));
    if (!matched) return null;
    score += 1;
  }

  return score;
}

// ─── Format products for response ───────────────────────────────────────────

function formatProducts(products) {
  return products.slice(0, 5).map(p => {
    const colors = (Array.isArray(p.colors) ? p.colors : safeParseJSON(p.colors))
      .map(c => c.name).filter(Boolean);
    const sizes = safeParseJSON(p.sizes);
    const specs = safeParseJSON(p.specifications);
    const material = specs.find(s => s.key?.toLowerCase() === "material")?.value || null;

    return {
      name: p.name?.trim(),
      slug: p.slug,
      description: p.short_description || "",
      colors: colors.length ? colors : [],
      sizes: sizes.length ? sizes : [],
      material,
    };
  });
}

// ─── Build reply text ────────────────────────────────────────────────────────

function buildReply(intent, matched, alternatives) {
  if (intent.isGreeting) {
    return {
      type: "greeting",
      text: `👋 **Assalamualaikum! Welcome to Sumaiya Home!** 🏠\n\nI'm your personal shopping assistant! I can help you find the perfect:\n🛋️ Rugs (Natural, Machine Made, Novelty)\n🪑 Poufs, Pillows & Throws\n🌿 Outdoor Rugs\n📦 Remnant Carpets\n\nBas poochhiye — *"Mujhe blue rug chahiye 5x7"* ya *"show me Natural rugs"*!`,
    };
  }

  if (intent.isTooVague) {
    return {
      type: "clarify",
      text: `😊 **Zaroor, main aapki help karunga!**\n\nBehtar results ke liye thoda batayein:\n\n🔹 **Category:** Rugs, Poufs, Pillows, Throws, Outdoor, Remnant?\n🔹 **Size:** Jaise 5' x 7', 8' x 10'?\n🔹 **Color:** Blue, Beige, Natural, Multi?\n🔹 **Material:** Jute, Wool, Polypropylene?\n\n*Example: "Mujhe 8x10 beige wool rug chahiye"*`,
    };
  }

  if (matched.length > 0) {
    return {
      type: "results",
      text: `✅ **${matched.length} matching product${matched.length > 1 ? "s" : ""} found!**`,
      products: formatProducts(matched),
    };
  }

  // No match — show alternatives
  return {
    type: "alternatives",
    text: `😔 **Exact match nahi mila**, but yeh closely related products dekh sakte hain:`,
    products: formatProducts(alternatives),
  };
}

// ─── Main POST handler ───────────────────────────────────────────────────────

export async function POST(req) {
  try {
    const { messages } = await req.json();
    const lastUserMessage = [...messages].reverse().find(m => m.role === "user")?.content || "";

    const intent = extractIntent(lastUserMessage);

    // Fetch products
    const [rows] = await connection.execute(
      `SELECT p.*, c.name AS collectionName 
       FROM product p 
       JOIN collection c ON p.collectionId = c.id 
       WHERE p.isActive = 1 AND p.inStock = 1 
       ORDER BY p.id DESC`
    );

    const products = rows.map(p => ({
      ...p,
      colors: safeParseJSON(p.colors),
      sizes: safeParseJSON(p.sizes),
      tags: safeParseJSON(p.tags),
    }));

    let matched = [];
    let scored = [];

    if (!intent.isGreeting && !intent.isTooVague) {
      for (const product of products) {
        const score = matchesIntent(product, intent);
        if (score !== null) scored.push({ product, score });
      }
      scored.sort((a, b) => b.score - a.score);
      matched = scored.map(s => s.product);
    }

    // Alternatives if nothing matched
    const alternatives = matched.length === 0 && !intent.isGreeting && !intent.isTooVague
      ? products.slice(0, 3)
      : [];

    const reply = buildReply(intent, matched, alternatives);

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
