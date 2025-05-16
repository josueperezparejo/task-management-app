"use client";

import { TaskItem } from "@/components/task-item";
import { useTasks } from "@/lib/context";
import { useTranslations } from "next-intl";

export function TaskList({ onEditTask }: any) {
  const t = useTranslations();

  const { tasks } = useTasks();

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onEdit={() => onEditTask(task)} />
      ))}

      {tasks.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 p-12 text-center dark:border-gray-700">
          <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
            {t("no-tasks")}
          </h3>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            {t("no-tasks-description")}
          </p>
        </div>
      )}
    </div>
  );
}
