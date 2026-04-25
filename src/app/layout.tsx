import { Toaster } from "@/shared/components/ui/sonner";
import { cn } from "@/shared/lib/utils";
import { StoreProvider } from "@/shared/store/provider";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "react-bkoi-gl/styles";
import "./globals.css";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Barikoi Map",
  description: "Map Integration with Barikoi API",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
    >
      <StoreProvider>
        <body className="min-h-full flex flex-col">
          {children}
          <Toaster position="bottom-right" richColors />
        </body>
      </StoreProvider>
    </html>
  );
}
