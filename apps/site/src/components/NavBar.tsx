"use client";

import Link from "next/link";
import { useTheme } from "~/theme/ThemeProvider";
import { Switch } from "./ui/switch";

export function NavBar() {
  const { theme, setTheme } = useTheme();

  return (
    <nav className="flex h-16 items-center justify-between border px-8">
      <div className="flex items-center gap-4">
        <Link href={"/"}>Home</Link>
        <Link href={"/responses"}>Responses</Link>
      </div>
      <aside>
        <Switch
          onCheckedChange={() => setTheme((prev) => (prev === "light" ? "dark" : "light"))}
          checked={theme === "dark"}
        />
      </aside>
    </nav>
  );
}
