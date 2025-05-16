"use client";

import { useEffect, useState } from "react";

import { useTranslations } from "next-intl";

import { Sidebar } from "@/components/sidebar";
import { TaskForm } from "@/components/task-form";
import { TaskList } from "@/components/task-list";
import { FilterBar } from "@/components/filter-bar";
import { CreateProjectForm } from "@/components/create-project-form";
import { DatabaseSetup } from "@/components/database-setup";

import type { Project, Task } from "@/lib/supabase";
import { useTasks, DatabaseAlert } from "@/lib/context";
import { EditProjectForm } from "./edit-project-form";
import { MenuIcon } from "lucide-react";

export function Dashboard() {
  const t = useTranslations();

  const isMobile = useMediaQuery("(max-width: 768px)");
  const [open, setOpen] = useState(!isMobile);

  // Actualizar visibilidad cuando cambia `isMobile`
  useEffect(() => {
    setOpen(!isMobile);
  }, [isMobile]);

  const { selectedProject, setSelectedProject } = useTasks();

  const [showTaskForm, setShowTaskForm] = useState(false);

  const [showCreateProjectForm, setShowCreateProjectForm] = useState(false);
  const [showEditProjectForm, setShowEditProjectForm] = useState(false);

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);

  const { projects } = useTasks();
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    if (selectedProject) {
      const foundProject =
        projects.find((p) => p.id === selectedProject) || null;
      setProject(foundProject);
    }
  }, [selectedProject]);

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleEditProject = (projectId: string) => {
    setEditingProjectId(projectId);
    setShowEditProjectForm(true);
  };

  const handleCloseTaskForm = () => {
    setShowTaskForm(false);
    setEditingTask(null);
  };

  const handleCloseCreateProjectForm = () => {
    setShowCreateProjectForm(false);
  };

  const handleCloseEditProjectForm = () => {
    setEditingProjectId(null);
    setShowEditProjectForm(false);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {open && (
        <div className=" absolute top-0 left-0 h-screen w-64 bg-gray-800">
          <Sidebar
            setOpen={setOpen}
            onEditProject={handleEditProject}
            selectedProject={selectedProject}
            setSelectedProject={setSelectedProject}
            onNewProject={() => setShowCreateProjectForm(true)}
          />
        </div>
      )}

      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="mx-auto max-w-5xl">
          <DatabaseAlert />
          <DatabaseSetup />

          <div className="mb-8 flex items-center justify-between">
            <div className="flex gap-2">
              <div>
                <button
                  onClick={() => setOpen((prev) => !prev)}
                  className="md:hidden dark:bg-gray-600  p-2 bg-gray-200 rounded"
                >
                  <MenuIcon />
                </button>
              </div>
              <h1 className="text-2xl font-bold  text-gray-900 dark:text-white">
                {project?.name
                  ? `${t("project")}: ${project?.name}`
                  : t("all-projects")}
              </h1>
            </div>
            <button
              onClick={() => setShowTaskForm(true)}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {t("new-task")}
            </button>
          </div>

          <FilterBar />

          <TaskList onEditTask={handleEditTask} />
        </div>
      </main>

      {showTaskForm && (
        <TaskForm task={editingTask} onClose={handleCloseTaskForm} />
      )}

      {showCreateProjectForm && (
        <CreateProjectForm
          onClose={handleCloseCreateProjectForm}
          showCreateProjectForm={showCreateProjectForm}
        />
      )}

      {showEditProjectForm && (
        <EditProjectForm
          projectId={editingProjectId}
          onClose={handleCloseEditProjectForm}
          showEditProjectForm={showEditProjectForm}
        />
      )}
    </div>
  );
}

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);

    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);

    return () => media.removeEventListener("change", listener);
  }, [query, matches]);

  return matches;
}
