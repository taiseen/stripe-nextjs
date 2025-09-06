import type { Metadata } from "next";
import { metaRootInfo } from "../meta";
import { LayoutType } from "@/types";
import "../styles/globals.css";

export const metadata: Metadata = { ...metaRootInfo };

export default function RootLayout({ children }: LayoutType) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
