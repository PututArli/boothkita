import type { Metadata } from 'next';
import { Playfair_Display, Caveat } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });
const caveat = Caveat({ subsets: ['latin'], variable: '--font-caveat' });

import { LanguageProvider } from '@/lib/i18n';

export const metadata: Metadata = {
  title: 'BoothKita',
  description: 'Ambil foto berdua secara online. Buat room, share link ke pasangan, dan nikmati sesi foto bersama dengan frame dan filter keren!',
  keywords: ['photobooth', 'couple', 'foto bersama', 'online photobooth'],
  openGraph: {
    title: 'BoothKita',
    description: 'Foto berdua secara online dengan berbagai frame dan filter.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${playfair.variable} ${caveat.variable}`} suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#0d0d12" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="icon" type="image/svg+xml" href="/logo.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400..700&family=Comic+Neue:wght@400;700&family=Inter:wght@400..700&family=Outfit:wght@400..900&family=Pacifico&family=Poppins:wght@400;500;600;700&family=Roboto:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
