import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "STANE TECH Frontend",
  description: "Frontend for STANE TECH SaaS application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
