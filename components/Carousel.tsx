"use client";

import NextImage from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";

const UNOPTIMIZED = process.env.NODE_ENV !== "production";

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

  const isProd = process.env.NODE_ENV === "production";
  const QUALITY = 60;
  const mkUrl = (path: string, width = 1000, quality = QUALITY) =>
    isProd ? `/_next/image?url=${encodeURIComponent(path)}&w=${width}&q=${quality}` : path;

  // Preload a small batch of initial images on mount to warm edge cache
  useEffect(() => {
    if (!hasImages) return;
    const batch = Math.min(8, images.length);
    for (let i = 0; i < batch; i++) {
      const img = images[i];
      if (!img) continue;
      // Stagger requests to avoid burst
      setTimeout(() => {
        [1080].forEach((w) => {
          if (typeof window === "undefined" || !window.Image) return;
          const pre = new window.Image();
          pre.decoding = "async";
          if ("loading" in pre) {
            (pre as HTMLImageElement).loading = "eager";
          }
          pre.src = mkUrl(img.src, w, QUALITY);
        });
      }, i * 150);
    }
  }, [hasImages, images]);

  // Preload adjacent images in the background for instant navigation
  useEffect(() => {
    if (!hasImages) return;

    const idxs: number[] = [];
    const len = images.length;
    // Preload next two and previous one
    idxs.push((index + 1) % len);
    idxs.push((index + 2) % len);
    idxs.push((index - 1 + len) % len);

    const unique = Array.from(new Set(idxs));
    unique.forEach((i) => {
      const img = images[i];
      if (!img) return;
      // Warm one or two common widths that match our sizes map
      [1080, 1200].forEach((w) => {
        if (typeof window === "undefined" || !window.Image) return;
        const pre = new window.Image();
        pre.decoding = "async";
        if ("loading" in pre) {
          (pre as HTMLImageElement).loading = "eager";
        }
        pre.src = mkUrl(img.src, w, QUALITY);
      });
    });
  }, [index, images, hasImages]);

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
          <NextImage
            key={current.src}
            src={current.src}
            alt={current.alt}
            fill
            sizes="(min-width: 1024px) 1000px, 90vw"
            quality={QUALITY}
            fetchPriority={index === 0 ? "high" : undefined}
            priority={index === 0}
            unoptimized={UNOPTIMIZED}
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
