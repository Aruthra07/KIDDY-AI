import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import CommandPalette from "@/components/CommandPalette";
import FloatingMentor from "@/components/FloatingMentor";

export const metadata: Metadata = {
  title: "Kiddy AI — Modern Learning Ecosystem",
  description: "A professional AI-powered learning universe for school students. Join structured courses, attend live classes, and collaborate.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300..900&family=Manrope:wght@300..800&family=Plus+Jakarta+Sans:wght@300..800&display=swap" rel="stylesheet" />
        <script dangerouslySetInnerHTML={{ __html: `
          try {
            const saved = localStorage.getItem("kiddy_theme");
            const system = window.matchMedia("(prefers-color-scheme: dark)").matches;
            if (saved === "dark" || (!saved && system)) {
              document.documentElement.classList.add("dark");
            } else {
              document.documentElement.classList.remove("dark");
            }
          } catch (e) {}
        `}} />
      </head>
      <body
        className="font-sans bg-bg-light text-dark antialiased"
      >
        <AppProvider>
          {children}
          <CommandPalette />
          <FloatingMentor />
        </AppProvider>
      </body>
    </html>
  );
}
