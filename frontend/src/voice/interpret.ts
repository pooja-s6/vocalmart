import type { VoiceIntent } from './types';

const CATEGORIES: { name: string; pattern: RegExp }[] = [
  { name: 'Home & Kitchen', pattern: /\bhome(?:\s+(?:and|&)\s+kitchen)?\b|\bkitchen\b/i },
  { name: 'Electronics', pattern: /\belectronics?\b|\bgadgets?\b/i },
  { name: 'Fashion', pattern: /\bfashion\b|\bclothes\b|\bclothing\b|\bapparel\b/i },
  { name: 'Grocery', pattern: /\bgrocer(?:y|ies)\b|\bpantry\b/i },
];

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/[?.!,]/g, ' ')
    .replace(/₹/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function money(value: string) {
  return value.replace(/,/g, '');
}

function navigation(text: string): string | null {
  const rules: [RegExp, string][] = [
    [/^(?:please )?(?:open |go to |show |take me to )?(?:my |the )?cart$/, '/cart'],
    [/^(?:please )?(?:open |go to |show |take me to )?(?:the )?checkout$/, '/checkout'],
    [/^(?:please )?(?:open |go to |show |take me to )?(?:my )?orders?(?: history)?$/, '/orders'],
    [/^(?:please )?(?:open |go to |show |take me to )?(?:my )?(?:wishlist|saved(?: items)?)$/, '/wishlist'],
    [/^(?:please )?(?:go |open |show )?home$/, '/'],
    [/^(?:please )?(?:open |go to |show )?(?:the )?categories$/, '/categories'],
    [/^(?:please )?(?:show |open |see )?(?:all )?products$/, '/products'],
  ];
  for (const [pattern, path] of rules) {
    if (pattern.test(text)) return path;
  }
  return null;
}

function actionFor(text: string): VoiceIntent['action'] | undefined {
  if (/^(?:please )?(?:add(?: this)? to (?:my )?cart|add to cart)$/.test(text)) return 'add-to-cart';
  if (/^(?:please )?(?:buy(?: this)? now)$/.test(text)) return 'buy-now';
  if (/^(?:please )?(?:save(?: this)?|add(?: this)? to (?:my )?(?:wishlist|saved)(?: items)?)$/.test(text)) return 'save';
  return undefined;
}

export function interpretVoice(transcript: string): VoiceIntent {
  const text = normalize(transcript);
  const path = navigation(text);
  if (path) {
    const label = path === '/' ? 'home' : path.slice(1);
    return { transcript, path, summary: `Opening ${label}.` };
  }

  if (/^(?:please )?(?:clear|reset)(?: filters| search| everything)?$|^(?:show|see) all(?: products)?$/.test(text)) {
    return { transcript, clear: true, summary: 'Cleared the filters.' };
  }

  const action = actionFor(text);
  if (action === 'add-to-cart') return { transcript, action, summary: 'Adding this product to the cart.' };
  if (action === 'buy-now') return { transcript, action, summary: 'Taking this product to checkout.' };
  if (action === 'save') return { transcript, action, summary: 'Saved this product.' };

  let working = ` ${text} `;
  const intent: VoiceIntent = { transcript, summary: '' };

  const between = working.match(/\bbetween\s+(?:rs\.?\s+|rupees?\s+)?(\d[\d,]*)\s+(?:and|to)\s+(?:rs\.?\s+|rupees?\s+)?(\d[\d,]*)\b/i);
  if (between) {
    const low = Number(money(between[1]));
    const high = Number(money(between[2]));
    intent.minPrice = String(Math.min(low, high));
    intent.maxPrice = String(Math.max(low, high));
    working = working.replace(between[0], ' ');
  }

  const max = working.match(/\b(?:under|below|less than|up to|upto|cheaper than|max(?:imum)?)\s+(?:rs\.?\s+|rupees?\s+)?(\d[\d,]*)\b/i);
  if (max) {
    intent.maxPrice = money(max[1]);
    working = working.replace(max[0], ' ');
  }

  const min = working.match(/\b(?:over|above|more than|at least|min(?:imum)?)\s+(?:rs\.?\s+|rupees?\s+)?(\d[\d,]*)\b/i);
  if (min) {
    intent.minPrice = money(min[1]);
    working = working.replace(min[0], ' ');
  }

  if (/\b(?:cheapest|lowest price|low to high|price low to high)\b/i.test(working)) {
    intent.sort = 'price_asc';
    working = working.replace(/\b(?:cheapest|lowest price|low to high|price low to high)\b/gi, ' ');
  } else if (/\b(?:most expensive|highest price|high to low|price high to low)\b/i.test(working)) {
    intent.sort = 'price_desc';
    working = working.replace(/\b(?:most expensive|highest price|high to low|price high to low)\b/gi, ' ');
  } else if (/\b(?:highest rated|top rated|best rated|by rating)\b/i.test(working)) {
    intent.sort = 'rating';
    working = working.replace(/\b(?:highest rated|top rated|best rated|by rating)\b/gi, ' ');
  } else if (/\b(?:by name|alphabetical|a to z)\b/i.test(working)) {
    intent.sort = 'name';
    working = working.replace(/\b(?:by name|alphabetical|a to z)\b/gi, ' ');
  } else if (/\b(?:newest|latest)\b/i.test(working)) {
    intent.sort = 'newest';
    working = working.replace(/\b(?:newest|latest)\b/gi, ' ');
  }

  if (/\b(?:in stock|available only|only available)\b/i.test(working)) {
    intent.inStock = true;
    working = working.replace(/\b(?:in stock|available only|only available)\b/gi, ' ');
  } else if (/\binclude out of stock\b/i.test(working)) {
    intent.inStock = false;
    working = working.replace(/\binclude out of stock\b/gi, ' ');
  }

  for (const category of CATEGORIES) {
    if (category.pattern.test(working)) {
      intent.category = category.name;
      working = working.replace(category.pattern, ' ');
      break;
    }
  }

  const query = working
    .replace(/\b(?:please|can you|could you|show me|show|find me|find|search for|search|look for|looking for|get me|i want|i need|some|the|a|an|products?|items?)\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (query) intent.query = query;
  else if (intent.category) intent.query = null;

  intent.summary = describe(intent);
  return intent;
}

function describe(intent: VoiceIntent) {
  const parts: string[] = [];
  if (intent.query) parts.push(`“${intent.query}”`);
  if (intent.category) parts.push(intent.category);
  if (intent.minPrice && intent.maxPrice) parts.push(`₹${intent.minPrice}–₹${intent.maxPrice}`);
  else if (intent.maxPrice) parts.push(`under ₹${intent.maxPrice}`);
  else if (intent.minPrice) parts.push(`over ₹${intent.minPrice}`);
  if (intent.inStock) parts.push('in stock');
  if (intent.sort === 'price_asc') parts.push('cheapest first');
  if (intent.sort === 'price_desc') parts.push('highest price first');
  if (intent.sort === 'rating') parts.push('highest rated');
  if (intent.sort === 'name') parts.push('by name');
  if (intent.sort === 'newest') parts.push('newest');
  if (parts.length === 0) return 'Listening for a product, category, or price.';
  return `Showing ${parts.join(', ')}.`;
}

export function intentToSearchParams(
  intent: VoiceIntent,
  categories: { id: number; name: string }[],
  current?: URLSearchParams,
): URLSearchParams {
  if (intent.clear || intent.path === '/products') return new URLSearchParams();
  const next = new URLSearchParams(current);
  if (intent.query !== undefined) {
    if (intent.query) next.set('query', intent.query);
    else next.delete('query');
  }
  if (intent.category !== undefined) {
    if (!intent.category) next.delete('categoryId');
    else {
      const match = categories.find((category) => category.name.toLowerCase() === intent.category!.toLowerCase());
      if (match) next.set('categoryId', String(match.id));
    }
  }
  if (intent.minPrice !== undefined) {
    if (intent.minPrice) next.set('minPrice', intent.minPrice);
    else next.delete('minPrice');
  }
  if (intent.maxPrice !== undefined) {
    if (intent.maxPrice) next.set('maxPrice', intent.maxPrice);
    else next.delete('maxPrice');
  }
  if (intent.sort) next.set('sort', intent.sort);
  if (intent.inStock === true) next.set('inStock', '1');
  if (intent.inStock === false) next.delete('inStock');
  return next;
}
