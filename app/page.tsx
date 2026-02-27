import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import HeroCarousel from '@/components/HeroCarousel';
import MarqueeStrip from '@/components/MarqueeStrip';
import TrendingCarousel from '@/components/TrendingCarousel';
import FlowersSection from '@/components/FlowersSection';
import TestimonialCard from '@/components/Testimonial';
import { getSiteConfig, getCollections, getTestimonials, getDesigns } from '@/lib/content';

export const metadata: Metadata = {
  title: 'David Flower Project | Nature\'s Finest Blooms',
  description: 'Curated flower catalog — fresh seasonal blooms and exotic tropicals delivered to your door.',
};

export default function HomePage() {
  const site = getSiteConfig();
  const collections = getCollections().slice(0, 3);
  const testimonials = getTestimonials();
  const designs = getDesigns();

  return (
    <>
      {/* Hero */}
      <HeroCarousel />

      {/* Marquee Strip */}
      <MarqueeStrip />

      {/* Trending Section */}
      <section className="section-padding bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="font-inter text-xs tracking-[0.4em] uppercase text-gold mb-2">Popular</p>
              <h2 className="font-playfair text-3xl md:text-4xl text-brand-black">Most Loved Blooms</h2>
            </div>
            <Link
              href="/collections"
              className="font-inter text-xs tracking-[0.2em] uppercase border border-brand-black text-brand-black px-5 py-3 hover:bg-brand-black hover:text-white transition-all duration-300 hidden sm:block"
            >
              View All
            </Link>
          </div>
          <TrendingCarousel />
        </div>
      </section>

      {/* Flower Catalog Section */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Section header */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10 gap-4">
            <div>
              <p className="font-inter text-xs tracking-[0.4em] uppercase text-gold mb-2">Our Flowers</p>
              <h2 className="font-playfair text-3xl md:text-4xl text-brand-black">Browse Our Catalog</h2>
              <div className="gold-divider !mx-0 !my-4" />
            </div>
            <Link
              href="/collections"
              className="font-inter text-xs tracking-[0.2em] uppercase border border-brand-black text-brand-black px-5 py-3 hover:bg-brand-black hover:text-white transition-all duration-300 self-start sm:self-end"
            >
              View All
            </Link>
          </div>

          {/* Pricing legend */}
          <div className="flex flex-wrap gap-6 mb-8 p-4 bg-beige">
            <div className="flex items-center gap-2">
              <span className="font-inter text-xs font-semibold text-brand-black">Per Stem:</span>
              <span className="font-inter text-xs text-charcoal/70">Individual stems for custom arrangements</span>
            </div>
            <div className="w-px bg-gold/30 hidden sm:block" />
            <div className="flex items-center gap-2">
              <span className="font-inter text-xs font-semibold text-gold">Per Bunch:</span>
              <span className="font-inter text-xs text-charcoal/70">~10 stems — best value for events & gifts</span>
            </div>
          </div>

          {/* Flower grid with Quick View */}
          <FlowersSection designs={designs} />
        </div>
      </section>

      {/* Intro Statement */}
      <section className="bg-beige py-20 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <p className="font-inter text-xs tracking-[0.3em] uppercase text-gold mb-6">Our Philosophy</p>
          <h2 className="font-playfair text-3xl md:text-4xl text-brand-black leading-tight mb-6">
            This is not just a flower.<br />
            <em>This is a feeling.</em>
          </h2>
          <div className="gold-divider" />
          <p className="font-inter text-sm text-charcoal/70 leading-relaxed">
            {site.intro}
          </p>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="font-inter text-xs tracking-[0.3em] uppercase text-gold mb-4">Seasonal</p>
            <h2 className="font-playfair text-3xl md:text-4xl text-brand-black">Shop by Season</h2>
            <div className="gold-divider" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {collections.map((col) => (
              <div key={col.id} className="group cursor-pointer">
                <Link href="/collections">
                  <div className="relative aspect-[3/4] overflow-hidden bg-beige mb-4">
                    <Image
                      src={col.image}
                      alt={col.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <p className="font-inter text-xs tracking-widest uppercase text-gold mb-1">{col.category}</p>
                  <h3 className="font-playfair text-lg text-brand-black">{col.title}</h3>
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/collections" className="btn-outline">
              View All Flowers
            </Link>
          </div>
        </div>
      </section>

      {/* Process Teaser */}
      <section className="bg-brand-black section-padding text-center">
        <div className="max-w-3xl mx-auto">
          <p className="font-inter text-xs tracking-[0.3em] uppercase text-gold mb-4">How It Works</p>
          <h2 className="font-playfair text-3xl md:text-4xl text-white mb-6">
            {site.process.headline}
          </h2>
          <div className="gold-divider" />
          <p className="font-inter text-sm text-white/60 leading-relaxed mb-10">
            {site.process.subtitle}
          </p>
          <Link href="/process" className="btn-primary">
            Learn More
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-beige">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="font-inter text-xs tracking-[0.3em] uppercase text-gold mb-4">Reviews</p>
            <h2 className="font-playfair text-3xl md:text-4xl text-brand-black">Customer Stories</h2>
            <div className="gold-divider" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <TestimonialCard key={t.name} testimonial={t} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/peony.jpeg"
            alt="Order Beautiful Flowers"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-brand-black/75" />
        </div>
        <div className="relative z-10 text-center max-w-2xl mx-auto">
          <p className="font-inter text-xs tracking-[0.3em] uppercase text-gold mb-4">Order Today</p>
          <h2 className="font-playfair text-3xl md:text-5xl text-white mb-6">
            Ready to Order Your Blooms?
          </h2>
          <div className="gold-divider" />
          <p className="font-inter text-sm text-white/70 mb-10">
            Same-day delivery available. Orders placed before noon.
          </p>
          <Link href="/contact" className="btn-primary">
            Order Now
          </Link>
        </div>
      </section>
    </>
  );
}
