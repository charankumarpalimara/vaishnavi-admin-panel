import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vaishnavi Beauty Services | Home Salon, Saree Draping & Bridal Makeup",
  description:
    "Professional doorstep beauty services by Anusha in Bahadurpally, Hyderabad. Specialized in Saree Draping, HD Bridal Makeup, Hairstyling, and Facials. Call 76808 16972 / 96184 09290.",
  keywords: [
    "Vaishnavi Beauty Services",
    "Saree Draping Hyderabad",
    "Bridal Makeup Bahadurpally",
    "Home Salon Service Hyderabad",
    "Poola Jada Hairstyling",
    "Anusha Beautician",
  ],
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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
