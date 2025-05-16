import { createClient } from "@supabase/supabase-js";
import { toast } from "sonner";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Project = {
  id: string;
  name: string;
  user_id?: string;
  created_at?: string;
};

export type Task = {
  id: string;
  title: string;
  description?: string;
  due_date?: string;
  status: "Pendiente" | "Completada";
  priority: "Baja" | "Media" | "Alta";
  project_id?: string;
  user_id?: string;
  created_at?: string;
};

export async function checkTablesExist() {
  try {
    const { data: projectData, error: projectError } = await supabase
      .from("projects")
      .select("id")
      .limit(1);

    const { data: taskData, error: taskError } = await supabase
      .from("tasks")
      .select("id")
      .limit(1);

    const projectsExist =
      !projectError || !projectError.message.includes("does not exist");
    const tasksExist =
      !taskError || !taskError.message.includes("does not exist");

    return {
      projectsExist,
      tasksExist,
      allExist: projectsExist && tasksExist,
    };
  } catch (_error) {
    console.error("Error checking tables:", _error);
    return {
      projectsExist: false,
      tasksExist: false,
      allExist: false,
    };
  }
}

export async function fetchProjects() {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      if (error.message.includes("does not exist")) {
        console.warn("La tabla 'projects' no existe. Debes crearla primero.");
        return [];
      }
      console.error("Error fetching projects:", error);
      return [];
    }

    return data as Project[];
  } catch (_error) {
    console.error("Error fetching projects:", _error);
    return [];
  }
}

export async function createProject(name: string) {
  try {
    const { data, error } = await supabase
      .from("projects")
      .insert([{ name }])
      .select();

    if (error) {
      if (error.message.includes("does not exist")) {
        toast.error(
          "La tabla 'projects' no existe. Debes crearla primero.",
          {}
        );
      } else {
        toast.error("No se pudo crear el proyecto: " + error.message);
      }
      throw error;
    }

    return data[0] as Project;
  } catch (_error) {
    console.error("Error creating project:", _error);
    throw _error;
  }
}

export async function updateProject(id: string, name: string) {
  try {
    const { data, error } = await supabase
      .from("projects")
      .update({ name })
      .eq("id", id)
      .select();

    if (error) {
      if (error.message.includes("does not exist")) {
        toast.error("La tabla 'projects' no existe. Debes crearla primero.");
      } else {
        toast.error("No se pudo actualizar el proyecto: " + error.message);
      }
      throw error;
    }

    return data[0] as Project;
  } catch (_error) {
    console.error("Error updating project:", _error);
    throw _error;
  }
}

export async function deleteProject(id: string) {
  try {
    const { error } = await supabase.from("projects").delete().eq("id", id);

    if (error) {
      if (error.message.includes("does not exist")) {
        toast.error("La tabla 'projects' no existe. Debes crearla primero.");
      } else {
        toast.error("No se pudo eliminar el proyecto: " + error.message);
      }
      throw error;
    }

    return true;
  } catch (_error) {
    console.error("Error deleting project:", _error);
    throw _error;
  }
}

export async function fetchTasks(
  projectId?: string,
  filters?: { status?: string; priority?: string; sortBy?: string }
) {
  try {
    let query = supabase.from("tasks").select("*");

    if (projectId && projectId !== "Todos") {
      query = query.eq("project_id", projectId);
    }

    if (filters?.status && filters.status !== "all") {
      query = query.eq(
        "status",
        filters.status === "pending" ? "Pendiente" : "Completada"
      );
    }

    if (filters?.priority && filters.priority !== "all") {
      const priorityMap = { low: "Baja", medium: "Media", high: "Alta" };
      query = query.eq(
        "priority",
        priorityMap[filters.priority as keyof typeof priorityMap]
      );
    }

    if (filters?.sortBy) {
      const sortField =
        filters.sortBy === "dueDate"
          ? "due_date"
          : filters.sortBy === "priority"
          ? "priority"
          : "title";
      query = query.order(sortField, { ascending: true });
    } else {
      query = query.order("created_at", { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
      if (error.message.includes("does not exist")) {
        console.warn("La tabla 'tasks' no existe. Debes crearla primero.");
        return [];
      }
      console.error("Error fetching tasks:", error);
      return [];
    }

    return data as Task[];
  } catch (_error) {
    console.error("Error fetching tasks:", _error);
    return [];
  }
}

export async function createTask(task: Omit<Task, "id" | "created_at">) {
  try {
    const { data, error } = await supabase
      .from("tasks")
      .insert([task])
      .select();

    if (error) {
      if (error.message.includes("does not exist")) {
        toast.error("La tabla 'tasks' no existe. Debes crearla primero.");
      } else if (error.message.includes("violates foreign key constraint")) {
        toast.error("El proyecto seleccionado no existe.");
      } else {
        toast.error("No se pudo crear la tarea: " + error.message);
      }
      throw error;
    }

    return data[0] as Task;
  } catch (_error) {
    console.error("Error creating task:", _error);
    throw _error;
  }
}

export async function updateTask(
  id: string,
  task: Partial<Omit<Task, "id" | "created_at">>
) {
  try {
    const { data, error } = await supabase
      .from("tasks")
      .update(task)
      .eq("id", id)
      .select();

    if (error) {
      if (error.message.includes("does not exist")) {
        toast.error("La tabla 'tasks' no existe. Debes crearla primero.");
      } else if (error.message.includes("violates foreign key constraint")) {
        toast.error("El proyecto seleccionado no existe.");
      } else {
        toast.error("No se pudo actualizar la tarea: " + error.message);
      }
      throw error;
    }

    return data[0] as Task;
  } catch (_error) {
    console.error("Error updating task:", _error);
    throw _error;
  }
}

export async function deleteTask(id: string) {
  try {
    const { error } = await supabase.from("tasks").delete().eq("id", id);

    if (error) {
      if (error.message.includes("does not exist")) {
        toast.error("La tabla 'tasks' no existe. Debes crearla primero.");
      } else {
        toast.error("No se pudo eliminar la tarea: " + error.message);
      }
      throw error;
    }

    return true;
  } catch (_error) {
    console.error("Error deleting task:", _error);
    throw _error;
  }
}

export async function updateTaskStatus(
  id: string,
  status: "Pendiente" | "Completada"
) {
  try {
    const { data, error } = await supabase
      .from("tasks")
      .update({ status })
      .eq("id", id)
      .select();

    if (error) {
      if (error.message.includes("does not exist")) {
        toast.error("La tabla 'tasks' no existe. Debes crearla primero.");
      } else {
        toast.error(
          "No se pudo actualizar el estado de la tarea: " + error.message
        );
      }
      throw error;
    }

    return data[0] as Task;
  } catch (_error) {
    console.error("Error updating task status:", _error);
    throw _error;
  }
}
