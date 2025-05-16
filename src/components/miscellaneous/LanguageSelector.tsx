"use client";

import { useEffect, useState } from "react";

import { Globe } from "lucide-react";
import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from "@/components/ui/select";

import { getUserLocale, setUserLocale } from "@/helpers";

export const LanguageSelector = () => {
  const [locale, setLocale] = useState<string>("en");

  useEffect(() => {
    const getUserLocaleFetch = async () => {
      try {
        const locale = await getUserLocale();
        setLocale(locale);
      } catch (_error) {
        throw _error;
      }
    };

    getUserLocaleFetch();
  }, []);

  const handleChange = (locale: string) => {
    setUserLocale(locale);
    setLocale(locale);
  };

  return (
    <div className="flex gap-2  items-center space-x-2">
      <Globe className="h-4 w-4 text-muted-foreground" />
      <Select
        value={locale}
        onValueChange={(value) => {
          handleChange(value);
        }}
      >
        <SelectTrigger className="w-full dark:bg-gray-700 dark:border-gray-700">
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en">English</SelectItem>
          <SelectItem value="es">Español</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
