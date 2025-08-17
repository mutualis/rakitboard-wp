"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { Button } from "./ui";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const handleThemeChange = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    console.log("Changing theme from", theme, "to", newTheme);
    setTheme(newTheme);

    // Force DOM update
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(newTheme);

    console.log("Root classes after change:", root.classList.toString());
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleThemeChange}
      className="w-9 px-0"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
