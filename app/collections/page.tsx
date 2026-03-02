import type { Metadata } from 'next';
import Image from 'next/image';
import FlowersSection from '@/components/FlowersSection';
import { getDesigns } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Flower Catalog | David Flower Project',
  description: 'Browse our curated collection of 50+ flower varieties — from seasonal classics to exotic tropicals.',
};

export default function CollectionsPage() {
  const designs = getDesigns();

  return (
    <>
      {/* Page Hero */}
      <section className="relative h-[60vh] min-h-[400px] flex items-end pb-16 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/dahlia.jpeg"
            alt="Flower Catalog"
            fill
            className="object-cover object-top"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/50 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full">
          <p className="font-inter text-xs tracking-[0.3em] uppercase text-gold mb-3">Our Flowers</p>
          <h1 className="font-playfair text-4xl md:text-5xl text-white">The Flower Catalog</h1>
          <p className="font-inter text-sm text-white/60 mt-3">{designs.length} varieties available</p>
        </div>
      </section>

      {/* Full Flower Grid with Quick View */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <FlowersSection designs={designs} />
        </div>
      </section>

      {/* Quote */}
      <section className="section-padding bg-brand-black text-center">
        <div className="max-w-2xl mx-auto">
          <div className="text-gold text-6xl font-playfair mb-4 leading-none">&ldquo;</div>
          <p className="font-playfair italic text-xl md:text-2xl text-white leading-relaxed mb-6">
            Where flowers bloom, so does hope.
          </p>
          <div className="w-8 h-px bg-gold mx-auto" />
        </div>
      </section>
    </>
  );
}
