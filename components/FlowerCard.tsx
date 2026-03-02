'use client';

/**
 * FlowerCard — Flower catalog product card for David Flower Project.
 *
 * Displays two prices per flower:
 *   1. "Per Stem"  — single stem price
 *   2. "Per Bunch" — bunch of ~10 stems price
 *
 * Hover behaviour:
 *   • Image scales up (zoom)
 *   • "Quick View" eye icon button appears top-right
 *   • "Quick View" text bar slides up from bottom of image
 *   • Category badge always visible top-left
 */

import { useState } from 'react';
import Image from 'next/image';
import type { Design } from '@/lib/content';

interface FlowerCardProps {
  design: Design;
  onQuickView?: () => void;
}

const BADGE_STYLES: Record<string, string> = {
  New:      'bg-brand-black text-white',
  Trending: 'bg-gold text-white',
  Popular:  'bg-forest-green text-white',
  Seasonal: 'bg-forest-dark text-white',
  Exotic:   'bg-plum text-white',
  Fragrant: 'bg-gold-light text-white',
};

export default function FlowerCard({ design, onQuickView }: FlowerCardProps) {
  const [imgError, setImgError] = useState(false);

  const badge = design.badge ?? null;
  const badgeStyle = badge ? BADGE_STYLES[badge] ?? 'bg-charcoal text-white' : null;

  return (
    <article className="group flex flex-col bg-white overflow-hidden">
      {/* ── IMAGE AREA ─────────────────────────────────────────────────────── */}
      <div
        className={`relative aspect-[3/4] overflow-hidden bg-beige${onQuickView ? ' cursor-pointer' : ''}`}
        onClick={onQuickView ? () => onQuickView() : undefined}
      >
        {!imgError ? (
          <Image
            src={design.image}
            alt={design.title}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-beige">
            <span className="font-inter text-xs text-charcoal/40 uppercase tracking-widest">
              {design.category}
            </span>
          </div>
        )}

        {/* Badge — top left */}
        {badgeStyle && (
          <span className={`absolute top-3 left-3 z-10 font-inter text-[9px] tracking-[0.15em] uppercase px-2 py-0.5 ${badgeStyle}`}>
            {badge}
          </span>
        )}

        {/* Quick View eye icon button — top right, appears on hover */}
        {onQuickView && (
          <button
            onClick={e => { e.stopPropagation(); onQuickView(); }}
            aria-label={`Quick view ${design.title}`}
            className="absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center bg-white/90 border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gold hover:text-white hover:border-gold"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>
        )}

        {/* "Quick View" text bar — slides up from bottom on hover */}
        {onQuickView && (
          <div className="absolute bottom-0 left-0 right-0 z-10 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={e => { e.stopPropagation(); onQuickView(); }}
              className="flex items-center justify-center gap-1.5 w-full font-inter text-[10px] tracking-[0.25em] uppercase bg-white/95 text-brand-black py-3 hover:bg-gold hover:text-white transition-colors duration-200"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              Quick View
            </button>
          </div>
        )}
      </div>

      {/* ── CARD INFO ──────────────────────────────────────────────────────── */}
      <div className="pt-3 pb-4 px-1">
        {/* Category */}
        <p className="font-inter text-[10px] tracking-widest uppercase text-gold mb-1">
          {design.category}
        </p>

        {/* Title — clicking also opens quick view */}
        <h3
          className="font-playfair text-base font-medium text-brand-black leading-snug cursor-pointer hover:text-gold transition-colors duration-150"
          onClick={onQuickView}
        >
          {design.title}
        </h3>
      </div>
    </article>
  );
}
