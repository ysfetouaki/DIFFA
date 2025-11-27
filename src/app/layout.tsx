import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Diffa Tours - Découvrez le Maroc",
  description: "Votre agence de voyage au cœur du Maroc authentique",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}