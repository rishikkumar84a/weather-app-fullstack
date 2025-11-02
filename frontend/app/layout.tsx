import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Weather App - PM Accelerator Bootcamp",
  description: "Full-stack Weather Application with CRUD operations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
