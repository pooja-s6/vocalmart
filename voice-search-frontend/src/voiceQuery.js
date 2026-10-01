const CATEGORIES = ["Electronics", "Grocery", "Clothing", "Kitchen"];

export function interpretVoiceTranscript(transcript) {
  const raw = (transcript || "").trim();
  let text = raw.toLowerCase().replace(/[₹]/g, " ").replace(/[.,!?]/g, " ");
  let maxPrice = null;

  const priceMatch = text.match(
    /\b(?:under|below|less than|cheaper than|up to|upto)\s+(?:rs|rupees|inr)?\s*(\d{2,7})\b/
  );
  if (priceMatch) {
    maxPrice = Number(priceMatch[1]);
    text = text.replace(priceMatch[0], " ");
  }

  let category = null;
  CATEGORIES.forEach((name) => {
    const pattern = new RegExp(`\\b${name.toLowerCase()}\\b`);
    if (pattern.test(text)) {
      category = name;
      text = text.replace(pattern, " ");
    }
  });

  text = text.replace(
    /\b(please|search for|search|find me|find|show me|show|products|product|items|item|the|a|an|me|for|of|all)\b/g,
    " "
  );

  return {
    raw,
    query: text.replace(/\s+/g, " ").trim(),
    category,
    maxPrice,
  };
}

export function describeVoiceSearch(result) {
  const parts = [`Heard "${result.raw}".`];
  if (result.category) {
    parts.push(`Category ${result.category}.`);
  }
  if (result.maxPrice != null) {
    parts.push(`Price up to ₹${result.maxPrice}.`);
  }
  if (result.query) {
    parts.push(`Matching "${result.query}".`);
  }
  return parts.join(" ");
}
