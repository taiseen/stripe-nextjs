import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "next-themes";
import { metaRootInfo } from "../meta";
import { LayoutType } from "@/types";
import "../styles/globals.css";

export const metadata: Metadata = { ...metaRootInfo };

export default function RootLayout({ children }: LayoutType) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider
          disableTransitionOnChange
          defaultTheme="system"
          attribute="class"
          enableSystem
        >
          <Navbar />

          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
