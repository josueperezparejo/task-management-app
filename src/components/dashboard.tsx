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

export function Dashboard() {
  const t = useTranslations();

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
      <Sidebar
        onEditProject={handleEditProject}
        selectedProject={selectedProject}
        setSelectedProject={setSelectedProject}
        onNewProject={() => setShowCreateProjectForm(true)}
      />

      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="mx-auto max-w-5xl">
          <DatabaseAlert />
          <DatabaseSetup />

          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-2xl font-bold  text-gray-900 dark:text-white">
              {project?.name
                ? `${t("project")}: ${project?.name}`
                : t("all-projects")}
            </h1>
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
