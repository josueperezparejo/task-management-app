"use client";

import { MoreVertical, Calendar } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { updateTaskStatus, deleteTask, type Task } from "@/lib/supabase";
import { useTasks } from "@/lib/context";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";

const formatDate = (dateString?: string) => {
  const locale = useLocale();

  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const priorityColors = {
  Baja: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  Media:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  Alta: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

export function TaskItem({ task, onEdit }: { task: Task; onEdit: () => void }) {
  const t = useTranslations();

  const getPriorityKey = (priority: string): "high" | "medium" | "low" => {
    switch (priority) {
      case "Alta":
        return "high";
      case "Media":
        return "medium";
      case "Baja":
        return "low";
      default:
        return "low";
    }
  };

  const { refreshTasks } = useTasks();
  const isCompleted = task.status === "Completada";

  const handleStatusChange = async () => {
    try {
      const newStatus = isCompleted ? "Pendiente" : "Completada";
      await updateTaskStatus(task.id, newStatus);
      await refreshTasks();
    } catch (_error) {
      toast.error(
        t("task-status-error-title") + ": " + t("task-status-error-description")
      );
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTask(task.id);
      await refreshTasks();
      toast.success(
        t("task-deleted-title") + ": " + t("task-deleted-description")
      );
    } catch (_error) {
      toast.error(
        t("task-status-error-title") + ": " + t("task-delete-error-description")
      );
    }
  };

  return (
    <div
      className={`rounded-lg border p-4 transition-colors ${
        isCompleted
          ? "border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-blue-900"
          : "border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-800"
      }`}
    >
      <div className="flex items-start gap-3">
        <Checkbox
          checked={isCompleted}
          onCheckedChange={handleStatusChange}
          className="mt-1"
        />

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3
              className={`font-medium ${
                isCompleted
                  ? "text-gray-500 line-through dark:text-gray-400"
                  : "text-gray-900 dark:text-white"
              }`}
            >
              {task.title}
            </h3>

            <div className="flex items-center gap-2">
              {task.due_date && (
                <div
                  className={`flex items-center text-xs ${
                    isCompleted
                      ? "text-gray-500 dark:text-gray-400"
                      : "text-gray-600 dark:text-gray-300"
                  }`}
                >
                  <Calendar className="mr-1 h-3 w-3" />
                  {formatDate(task.due_date)}
                </div>
              )}

              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  priorityColors[task.priority]
                }`}
              >
                {t(getPriorityKey(task.priority))}
              </span>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="rounded-md p-1 hover:bg-gray-100 dark:hover:bg-gray-800">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={onEdit}>
                    {t("edit")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600 dark:text-red-400"
                    onClick={handleDelete}
                  >
                    {t("delete")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {task.description && (
            <p
              className={`mt-1 text-sm ${
                isCompleted
                  ? "text-gray-500 dark:text-gray-400"
                  : "text-gray-600 dark:text-gray-300"
              }`}
            >
              {task.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
