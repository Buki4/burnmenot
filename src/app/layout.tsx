import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { VoiceRecorder } from "@/components/VoiceRecorder";
import { Toaster } from 'react-hot-toast';
import NextTopLoader from 'nextjs-toploader';
import { TransitionProvider } from '@/components/TransitionContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BurnMeNotApp",
  description: "Collaborative app for music bands",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col md:flex-row text-slate-100 bg-slate-950">
        <TransitionProvider>
          <NextTopLoader color="#f97316" showSpinner={false} />
          <Sidebar />
          <Toaster position="bottom-right" toastOptions={{
            style: { background: '#1e293b', color: '#fff', border: '1px solid #334155' }
          }} />
          <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {children}
        </main>
        <VoiceRecorder />
        </TransitionProvider>
      </body>
    </html>
  );
}
