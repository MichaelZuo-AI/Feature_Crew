import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { UserProvider } from "@/context/UserContext";
import { ToastProvider } from "@/context/ToastContext";
import BottomNavBar from "@/components/layout/BottomNavBar";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "The Curator | Premium E-Commerce",
  description: "Premium e-commerce experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${plusJakarta.variable} font-sans antialiased bg-surface text-on-surface`}>
        <UserProvider>
          <CartProvider>
            <ToastProvider>
              <div className="max-w-md mx-auto min-h-screen relative">
                {children}
                <BottomNavBar />
              </div>
            </ToastProvider>
          </CartProvider>
        </UserProvider>
      </body>
    </html>
  );
}
