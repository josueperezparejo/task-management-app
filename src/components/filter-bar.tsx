"use client";

import { useTranslations } from "next-intl";
import { Filter, SortAsc } from "lucide-react";
import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from "@/components/ui/select";

import { useTasks } from "@/lib/context";

export function FilterBar() {
  const t = useTranslations();

  const { filters, setFilters } = useTasks();

  return (
    <div className="mb-6 flex flex-wrap flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-green-900/40 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex  items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("filter")}:
          </span>
        </div>

        <div className="flex flex-wrap flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <Select
            value={filters.status}
            onValueChange={(value) => setFilters({ status: value })}
          >
            <SelectTrigger className="h-9 w-full sm:w-[180px]">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("all-statuses")}</SelectItem>
              <SelectItem value="pending">{t("pending")}</SelectItem>
              <SelectItem value="completed">{t("completed")}</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.priority}
            onValueChange={(value) => setFilters({ priority: value })}
          >
            <SelectTrigger className="h-9 w-full sm:w-[180px]">
              <SelectValue placeholder="Prioridad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("all-priorities")}s</SelectItem>
              <SelectItem value="low">{t("low")}</SelectItem>
              <SelectItem value="medium">{t("medium")}</SelectItem>
              <SelectItem value="high">{t("high")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <SortAsc className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {t("sort")}:
        </span>

        <Select
          value={filters.sortBy}
          onValueChange={(value) => setFilters({ sortBy: value })}
        >
          <SelectTrigger className="h-9 w-full sm:w-[200px]">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dueDate">{t("due-date")}</SelectItem>
            <SelectItem value="priority">{t("priority")}</SelectItem>
            <SelectItem value="title">{t("title-filter")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
