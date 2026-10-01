import type { ReactNode } from 'react';

export function SearchBar({
  value,
  onChange,
  placeholder = 'Search products, or use the microphone',
  voice,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  voice?: ReactNode;
}) {
  return (
    <div className="search-bar">
      <label>
        <span className="sr-only">Search products</span>
        <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
      </label>
      {voice}
    </div>
  );
}
