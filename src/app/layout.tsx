import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { DictationFab } from "@/components/DictationFab";
import { Toaster } from "react-hot-toast";
import NextTopLoader from 'nextjs-toploader';
import { TransitionProvider } from '@/components/TransitionContext';
import { DragDropProvider } from "@/components/DragDropProvider";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const viewport: Viewport = {
  themeColor: '#020617',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "BurnMeNotApp",
  description: "Collaborative app for music bands",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "BurnMeNot",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${inter.className} bg-[#020617] text-slate-200 h-[100dvh] overflow-hidden flex flex-col md:flex-row antialiased selection:bg-orange-500/30`}>
        <DragDropProvider>
          <TransitionProvider>
            <NextTopLoader color="#f97316" showSpinner={false} />
            <Toaster position="top-right" toastOptions={{
              style: {
                background: '#1e293b',
                color: '#f1f5f9',
                border: '1px solid #334155'
              }
            }} />
            <Sidebar />
            <main className="flex-1 min-h-0 p-4 md:p-8 overflow-y-auto w-full md:w-auto pb-36 md:pb-8 relative">
              {children}
              <DictationFab />
            </main>
          </TransitionProvider>
        </DragDropProvider>
      </body>
    </html>
  );
}
