import type { Metadata } from "next";

import TanStack from "@/components/providers/TanStack";
import Theme from "@/components/providers/Theme";
import Navbar from "@/components/Navbar";

import { metaRootInfo } from "../meta";
import { LayoutType } from "@/types";
import "../styles/globals.css";

export const metadata: Metadata = { ...metaRootInfo };

export default function RootLayout({ children }: LayoutType) {
  return (
    <html lang="en">
      <body>
        <Theme
          disableTransitionOnChange
          defaultTheme="system"
          attribute="class"
          enableSystem
        >
          <TanStack>
            <Navbar />

            {children}
          </TanStack>
        </Theme>
      </body>
    </html>
  );
}
