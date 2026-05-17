import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AppShare",
  description: "Secure app distribution for mobile builds."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
