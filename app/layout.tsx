import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthBridge from "@/components/bridge/AuthBridge"
import ReduxProvider from "../wrapper/ReduxProvider"
import Provider from "@/wrapper/Provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Quick Bite | Best Online Food Order Apps in Bangladesh",
    template: "%s | Quick Bite | Best Online Food Order Apps in Bangladesh",
  },
  description: "Buy Burgers, Coffe, Pizza...etc at best price in BD.",
  icons: {
    icon: "/shop.png",
    shortcut: "/shop.png",
    apple: "/shop.png",
  },
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
      <body className="min-h-full">
        <Provider>
          <ReduxProvider>
            <AuthBridge>
              {children}
            </AuthBridge>
          </ReduxProvider>
        </Provider>
      </body>
    </html>
  );
}
