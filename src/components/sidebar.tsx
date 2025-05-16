"use client";

import { useState } from "react";

import {
  Inbox,
  FolderPlus,
  ChevronDown,
  ChevronRight,
  MoreVertical,
  MenuIcon,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useTasks } from "@/lib/context";
import { deleteProject } from "@/lib/supabase";
import { Button } from "./ui/button";
import { LanguageSelector } from "./miscellaneous/LanguageSelector";
import { useTranslations } from "next-intl";
import { ButtonDarkMode } from "./button-dark-mode";
import { toast } from "sonner";

interface Props {
  selectedProject: string;
  setSelectedProject: (project: string) => void;
  onNewProject: () => void;
  onEditProject: (projectId: string) => void;
  setOpen: (value: boolean | ((prev: boolean) => boolean)) => void;
}

export function Sidebar({
  selectedProject,
  setSelectedProject,
  onNewProject,
  onEditProject,
  setOpen,
}: Props) {
  const t = useTranslations();

  const { projects, refreshProjects, refreshTasks } = useTasks();
  const [expanded, setExpanded] = useState(true);

  const handleDeleteProject = async (id: string) => {
    try {
      await deleteProject(id);
      await refreshProjects();
      if (selectedProject === id) {
        setSelectedProject("Todos");
      }
      await refreshTasks();
      toast.success(t("project-deleted-title"), {
        description: t("project-deleted-description"),
      });
    } catch (_error) {
      toast.error(t("project-delete-error-title"), {
        description: t("project-delete-error-description"),
      });
    }
  };

  return (
    <div className="w-64 shrink-0 border-r h-full border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-700">
      <div className="flex gap-2 h-16 items-center border-b border-gray-200 px-4 dark:border-gray-800">
        <button
          onClick={() => setOpen((prev) => !prev)}
          className={` dark:bg-gray-600  p-2 bg-gray-200 rounded`}
        >
          <MenuIcon />
        </button>

        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t("title")}
        </h2>
      </div>

      <div className="p-4 h-11/12  flex flex-col justify-between ">
        <div>
          <button
            onClick={() => setSelectedProject("Todos")}
            className={`mb-2 flex w-full items-center rounded-md px-3 py-2 text-sm font-medium ${
              selectedProject === "Todos"
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100"
                : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            }`}
          >
            <Inbox className="mr-2 h-4 w-4" />
            {t("all-tasks")}
          </button>

          <div className="mt-6 ">
            <div className="mb-2 flex items-center justify-between">
              <Button
                variant={"ghost"}
                onClick={() => setExpanded(!expanded)}
                className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400"
              >
                {expanded ? (
                  <ChevronDown className="mr-1 h-4 w-4" />
                ) : (
                  <ChevronRight className="mr-1 h-4 w-4" />
                )}
                {t("projects")}
              </Button>
              <Button
                variant={"ghost"}
                onClick={() => onNewProject()}
                className="rounded-md p-1  text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              >
                <FolderPlus className="h-4 w-4" />
              </Button>
            </div>

            {expanded && (
              <div className="ml-2 space-y-1">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className={`flex items-center justify-between rounded-md px-3 py-2 text-sm ${
                      selectedProject === project.id
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100"
                        : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                    }`}
                  >
                    <button
                      className="flex-1 text-left capitalize"
                      onClick={() => setSelectedProject(project.id)}
                    >
                      {project.name}
                    </button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="rounded-md p-1 hover:bg-gray-200 dark:hover:bg-gray-700">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => onEditProject(project.id)}
                        >
                          {t("rename")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600 dark:text-red-400"
                          onClick={() => handleDeleteProject(project.id)}
                        >
                          {t("delete")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}

                {projects.length === 0 && (
                  <div className="py-2 text-sm text-gray-500 dark:text-gray-400">
                    {t("no-projects")}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div>
          <LanguageSelector />

          <ButtonDarkMode />
        </div>
      </div>
    </div>
  );
}
