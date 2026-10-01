export type VoiceAction = 'save' | 'add-to-cart' | 'buy-now';

export interface VoiceIntent {
  transcript: string;
  query?: string | null;
  category?: string | null;
  minPrice?: string | null;
  maxPrice?: string | null;
  sort?: string | null;
  inStock?: boolean | null;
  clear?: boolean;
  path?: string;
  action?: VoiceAction;
  summary: string;
}

export const VOICE_EXAMPLES = [
  'headphones',
  'grocery under 300',
  'highest rated fashion',
  'electronics in stock',
];
