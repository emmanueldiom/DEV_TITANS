import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { AuthProvider } from "@/lib/auth-context";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FraudShield - Détection de Fraude Mobile",
  description:
    "Solution avancée de détection de fraude pour les transactions mobiles en Afrique subsaharienne. Analyse en temps réel avec Machine Learning.",
  generator: "v0.app",
  keywords: [
    "fraude",
    "détection",
    "mobile",
    "transactions",
    "machine learning",
    "Afrique",
  ],
  authors: [{ name: "FraudShield" }],
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="bg-background">
      <body className="font-sans antialiased" suppressHydrationWarning={true}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
