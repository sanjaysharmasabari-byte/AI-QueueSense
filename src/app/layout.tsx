import type { Metadata } from 'next';
import './globals.css';
import { QueueProvider } from '@/context/QueueContext';
import { DemoModeBanner } from '@/components/ui/DemoModeBanner';

export const metadata: Metadata = {
  title: 'AI QueueSense | AI-Powered Campus Queue Management',
  description:
    'Smarter Queues. Shorter Waits. Real-time campus queue intelligence powered by computer vision and AI predictive analytics.',
  keywords: [
    'Campus Queue Management',
    'AI Queue Intelligence',
    'People Counting Computer Vision',
    'Wait Time Prediction',
    'Smart Campus SaaS',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#070A11] text-slate-100 antialiased min-h-screen flex flex-col selection:bg-teal-500/30 selection:text-teal-200">
        <QueueProvider>
          <DemoModeBanner />
          <main className="flex-1 flex flex-col">{children}</main>
        </QueueProvider>
      </body>
    </html>
  );
}
