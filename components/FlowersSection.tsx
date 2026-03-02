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

export default function FlowersSection({ designs }: Props) {
  const [activeFlower, setActiveFlower] = useState<Design | null>(null);

  return (
    <>
      {/* Flower grid — 2 cols mobile, 3 tablet, 4 desktop */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {designs.map((design) => (
          <FlowerCard
            key={design.id}
            design={design}
            onQuickView={() => setActiveFlower(design)}
          />
        ))}
      </div>

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
