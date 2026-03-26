import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI-Powered Learning Assistant",
  description:
    "A polished study workspace for reading PDFs, chatting with AI, and turning documents into learning tools.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body
        className="min-h-full flex flex-col"
        style={{
          fontFamily:
            '"Plus Jakarta Sans", "Avenir Next", "Segoe UI", sans-serif',
        }}
      >
        {children}
      </body>
    </html>
  );
}
