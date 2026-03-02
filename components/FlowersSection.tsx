'use client';

/**
 * FlowersSection — client wrapper for the flower card grid + quick view modal.
 *
 * Kept as a separate client component so that the parent app/page.tsx can
 * remain a server component (no 'use client' needed there).
 */

import { useState } from 'react';
import FlowerCard from '@/components/FlowerCard';
import FlowerQuickView from '@/components/FlowerQuickView';
import type { Design } from '@/lib/content';

interface Props {
  designs: Design[];
}

const INITIAL_VISIBLE = 6;

export default function FlowersSection({ designs }: Props) {
  const [activeFlower, setActiveFlower] = useState<Design | null>(null);
  const [showAll, setShowAll] = useState(false);

  const visible = showAll ? designs : designs.slice(0, INITIAL_VISIBLE);

  return (
    <>
      {/* Flower grid — 2 cols mobile, 3 tablet, 4 desktop */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {visible.map((design) => (
          <FlowerCard
            key={design.id}
            design={design}
            onQuickView={() => setActiveFlower(design)}
          />
        ))}
      </div>

      {/* Show More button */}
      {!showAll && designs.length > INITIAL_VISIBLE && (
        <div className="text-center mt-10">
          <button
            onClick={() => setShowAll(true)}
            className="font-inter text-xs tracking-[0.2em] uppercase border border-brand-black text-brand-black px-8 py-3 hover:bg-brand-black hover:text-white transition-all duration-300"
          >
            Show More ({designs.length - INITIAL_VISIBLE} more)
          </button>
        </div>
      )}

      {/* Quick View modal — rendered at root level via fixed positioning */}
      <FlowerQuickView
        design={activeFlower}
        allDesigns={designs}
        onClose={() => setActiveFlower(null)}
        onNavigate={(d) => setActiveFlower(d)}
      />
    </>
  );
}
