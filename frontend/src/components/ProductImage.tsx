import { useEffect, useState } from 'react';

const FALLBACK = '/images/fallback.svg';

export function ProductImage({ src, alt, className }: { src?: string | null; alt: string; className?: string }) {
  const [current, setCurrent] = useState(src && src.trim() ? src : FALLBACK);

  useEffect(() => {
    setCurrent(src && src.trim() ? src : FALLBACK);
  }, [src]);

  return (
    <img
      className={className}
      src={current}
      alt={alt}
      onError={() => {
        if (current !== FALLBACK) setCurrent(FALLBACK);
      }}
    />
  );
}
