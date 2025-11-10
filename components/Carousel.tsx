"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";

export type CarouselImage = {
  src: string;
  alt: string;
};

type Props = {
  images: CarouselImage[];
  initialIndex?: number;
  id?: string;
};

export default function Carousel({ images, initialIndex = 0, id }: Props) {
  const [index, setIndex] = useState(() =>
    Math.min(Math.max(initialIndex, 0), Math.max(images.length - 1, 0))
  );

  const hasImages = images && images.length > 0;

  const next = useCallback(() => {
    if (!hasImages) return;
    setIndex((i) => (i + 1) % images.length);
  }, [images.length, hasImages]);

  const prev = useCallback(() => {
    if (!hasImages) return;
    setIndex((i) => (i - 1 + images.length) % images.length);
  }, [images.length, hasImages]);

  // Keyboard navigation (works in both minimized and maximized states)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const current = useMemo(() => images[index], [images, index]);

  if (!hasImages) return null;

  return (
    <section id={id} className="carousel-section" aria-label="Bildkarussell">
      <div className="carousel">

        <button
          className="carousel-nav carousel-nav--left"
          type="button"
          aria-label="Vorheriges Bild (Pfeil links)"
          onClick={prev}
        >
          ‹
        </button>

        <div className="carousel-stage">
          <Image
            key={current.src}
            src={current.src}
            alt={current.alt}
            fill
            sizes="(min-width: 1024px) 1000px, 90vw"
            priority={false}
            unoptimized
            className="carousel-img"
          />
        </div>

        <button
          className="carousel-nav carousel-nav--right"
          type="button"
          aria-label="Nächstes Bild (Pfeil rechts)"
          onClick={next}
        >
          ›
        </button>

        <div className="carousel-dots" role="tablist" aria-label="Bildauswahl">
          {images.map((img, i) => (
            <button
              key={img.src}
              role="tab"
              aria-selected={i === index}
              aria-label={`Bild ${i + 1} auswählen`}
              className={`carousel-dot ${i === index ? "is-active" : ""}`}
              onClick={() => setIndex(i)}
              type="button"
            />
          ))}
        </div>
      </div>

    </section>
  );
}
