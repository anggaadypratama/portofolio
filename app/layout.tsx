import type { Metadata } from "next";
import { Space_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://anggaadypratama.vercel.app'),
  title: {
    default: 'Angga Ady Pratama - Web Developer Portfolio',
    template: '%s | Angga Ady Pratama',
  },
  description: 'Web developer driven by curiosity and continuous learning. Specialized in front-end development, Web3 integration, and creative coding. Explore my projects and experience.',
  keywords: [
    'Web Developer',
    'Front-End Developer',
    'React Developer',
    'Next.js Developer',
    'TypeScript',
    'JavaScript',
    'Web3',
    'Portfolio',
    'Angga Ady Pratama',
  ],
  authors: [{ name: 'Angga Ady Pratama' }],
  creator: 'Angga Ady Pratama',
  publisher: 'Angga Ady Pratama',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'Angga Ady Pratama Portfolio',
    title: 'Angga Ady Pratama - Web Developer Portfolio',
    description: 'Web developer driven by curiosity and continuous learning. Specialized in front-end development, Web3 integration, and creative coding.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Angga Ady Pratama - Web Developer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Angga Ady Pratama - Web Developer Portfolio',
    description: 'Web developer driven by curiosity and continuous learning. Specialized in front-end development, Web3 integration, and creative coding.',
    images: ['/og-image.png'],
    creator: '@anggaadypratama',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    // Add other verification codes as needed
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${spaceMono.variable} ${spaceGrotesk.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
