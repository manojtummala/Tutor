import type { Metadata } from "next";
import { GeistSans, GeistMono } from "geist/font";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const geistSansVariable = GeistSans.variable;
const geistMonoVariable = GeistMono.variable;

export const metadata: Metadata = {
  title: "Kana Path",
  description: "A personal Japanese learning dashboard for kana and JLPT N5 foundations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSansVariable} ${geistMonoVariable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
