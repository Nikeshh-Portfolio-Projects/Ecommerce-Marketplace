import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn, constructMetadata } from "@/lib/utils";
import { Toaster } from 'sonner'
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { TrpcProvider } from "@/utils/trpc-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = constructMetadata()

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          'relative h-full font-sans antialiased',
          inter.className
        )}>
        <TrpcProvider>
          <main className='relative flex flex-col min-h-screen'>
              <Navbar />
              <div className='flex-grow flex-1'>
                {children}
              </div>
              <Footer />
          </main>
          <Toaster position='top-center' richColors />
        </TrpcProvider>
      </body>
    </html>
  );
}
