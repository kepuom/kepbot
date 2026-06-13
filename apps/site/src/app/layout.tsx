import "~/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { NavBar } from "~/components/NavBar";
import { ThemeProvider } from "~/theme/ThemeProvider";

export const metadata: Metadata = {
  title: "Kepbot Panel",
  icons: [{ rel: "icon", url: "/kepicon.png" }],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <ThemeProvider>
          <main className="h-screen bg-background text-foreground">
            <NavBar />

            <div className="p-[3% ]">{children}</div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
