"use client";

import {
  type ReactNode,
  useState,
  useEffect,
  useContext,
  createContext,
} from "react";

import {
  fetchTasks,
  fetchProjects,
  checkTablesExist,
  type Task,
  type Project,
} from "@/lib/supabase";

import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type TasksContextType = {
  projects: Project[];
  tasks: Task[];
  selectedProject: string;
  filters: {
    status: string;
    priority: string;
    sortBy: string;
  };
  tablesExist: {
    projectsExist: boolean;
    tasksExist: boolean;
    allExist: boolean;
  };
  setSelectedProject: (project: string) => void;
  setFilters: (
    filters: Partial<{ status: string; priority: string; sortBy: string }>
  ) => void;
  refreshProjects: () => Promise<void>;
  refreshTasks: () => Promise<void>;
  checkTables: () => Promise<void>;
};

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export function TasksProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>("Todos");
  const [filters, setFilters] = useState({
    status: "all",
    priority: "all",
    sortBy: "dueDate",
  });
  const [loading, setLoading] = useState(true);
  const [tablesExist, setTablesExist] = useState({
    projectsExist: true,
    tasksExist: true,
    allExist: true,
  });

  const checkTables = async (): Promise<any> => {
    const result = await checkTablesExist();
    setTablesExist(result);
    return result;
  };

  const refreshProjects = async () => {
    const projectsData = await fetchProjects();
    setProjects(projectsData);
  };

  const refreshTasks = async () => {
    const tasksData = await fetchTasks(
      selectedProject === "Todos" ? undefined : selectedProject,
      filters
    );

    const priorityOrder = { Baja: 3, Media: 2, Alta: 1 };

    if (filters?.sortBy === "priority") {
      tasksData.sort(
        (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
      );
    }

    setTasks(tasksData);
  };

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      await checkTables();
      await refreshProjects();
      await refreshTasks();
      setLoading(false);
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    refreshTasks();
  }, [selectedProject, filters]);

  const updateFilters = (
    newFilters: Partial<{ status: string; priority: string; sortBy: string }>
  ) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  return (
    <TasksContext.Provider
      value={{
        projects,
        tasks,
        selectedProject,
        filters,
        tablesExist,
        setSelectedProject,
        setFilters: updateFilters,
        refreshProjects,
        refreshTasks,
        checkTables,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TasksContext);
  if (context === undefined) {
    throw new Error("useTasks must be used within a TasksProvider");
  }
  return context;
}

export function DatabaseAlert() {
  const { tablesExist, checkTables } = useTasks();

  if (tablesExist.allExist) {
    return null;
  }

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error de base de datos</AlertTitle>
      <AlertDescription>
        {!tablesExist.projectsExist && !tablesExist.tasksExist ? (
          <span>
            Las tablas 'projects' y 'tasks' no existen en la base de datos.
          </span>
        ) : !tablesExist.projectsExist ? (
          <span>La tabla 'projects' no existe en la base de datos.</span>
        ) : (
          <span>La tabla 'tasks' no existe en la base de datos.</span>
        )}
        <div className="mt-2">
          Por favor, ejecuta el script SQL proporcionado en el editor SQL de
          Supabase para crear las tablas necesarias.
        </div>
        <button
          onClick={() => checkTables()}
          className="mt-2 rounded-md bg-white px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
        >
          Verificar de nuevo
        </button>
      </AlertDescription>
    </Alert>
  );
}
