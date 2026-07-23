import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "J-YTDown | Clean media downloads",
  description: "A clean interface for authorized media downloads.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
