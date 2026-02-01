import type { Metadata } from 'next';
import { Merriweather } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Analytics } from "@vercel/analytics/next"

const merriweather = Merriweather({
  weight: ['300', '400', '700', '900'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-merriweather',
});

export const metadata: Metadata = {
  title: 'Dr. D. Y. Patil Arts, Commerce & Science College',
  description: 'Your central hub for college events and student projects.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={merriweather.variable}>
      <body className="font-body antialiased min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-grow">
          {children}
          <Analytics />
        </main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
