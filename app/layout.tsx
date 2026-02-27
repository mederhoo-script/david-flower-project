import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFAB from '@/components/WhatsAppFAB';
import { getSiteConfig } from '@/lib/content';

const site = getSiteConfig();

export const metadata: Metadata = {
  title: {
    default: `${site.brandName} | ${site.tagline}`,
    template: `%s | ${site.brandName}`,
  },
  description: site.intro,
  keywords: ['flower catalog', 'fresh flowers', 'flower delivery', 'tropical flowers', 'seasonal blooms', 'David Flower Project'],
  openGraph: {
    title: site.brandName,
    description: site.intro,
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <WhatsAppFAB />
        <Footer />
      </body>
    </html>
  );
}
