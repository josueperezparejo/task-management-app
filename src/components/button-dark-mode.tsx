"use client";

import { useEffect } from "react";
import { Button } from "./ui/button";
import { useTranslations } from "next-intl";

export function ButtonDarkMode() {
  const t = useTranslations();

  useEffect(() => {
    const dark = localStorage.getItem("theme") === "dark";
    if (dark) document.documentElement.classList.add("dark");
  }, []);

  const toggleDarkMode = () => {
    const isDark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  };

  return (
    <Button
      variant="outline"
      className="mt-4 flex items-center gap-2 w-full justify-center"
      onClick={toggleDarkMode}
    >
      <svg
        className="h-4 w-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="5" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </svg>
      {t("change-theme")}
    </Button>
  );
}
