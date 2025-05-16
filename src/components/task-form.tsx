"use client";

import { X } from "lucide-react";

import { Formik, Form, ErrorMessage } from "formik";

import { Button } from "@/components/ui/button";

import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from "@/components/ui/select";

import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
} from "@/components/ui/dialog";

import { useTasks } from "@/lib/context";
import { createTask, updateTask, type Task } from "@/lib/supabase";
import { FormInput } from "./formik/FormInput";
import { createFieldNameTyped } from "@/lib";
import { FormSelect } from "./formik/FormSelect";
import { useTranslations } from "next-intl";
import { useTaskSchema } from "@/schemas";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";

export function TaskForm({
  task,
  onClose,
}: {
  task: Task | null;
  onClose: () => void;
}) {
  const t = useTranslations();

  const priorities = [
    { label: t("low"), value: "Baja" },
    { label: t("medium"), value: "Media" },
    { label: t("high"), value: "Alta" },
  ];

  const TaskSchema = useTaskSchema();

  const { projects, refreshTasks } = useTasks();

  interface InitialValues {
    title: string;
    description: string;
    due_date: string;
    priority: { label: string; value: string };
    project_id: string;
    status: string;
  }

  const initialValues: InitialValues = {
    title: task?.title || "",
    description: task?.description || "",
    due_date: task?.due_date || "",
    priority: {
      label: task?.priority || "",
      value: task?.priority || "",
    },
    project_id: task?.project_id || (projects.length > 0 ? projects[0].id : ""),
    status: task?.status || "Pendiente",
  };

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      if (task) {
        await updateTask(task.id, {
          ...values,
          priority: values?.priority?.value,
        });
        toast.success("La tarea ha sido actualizada correctamente", {
          description: "Tarea actualizada",
        });
      } else {
        await createTask({
          ...values,
          priority: values?.priority?.value,
        });
        toast.success("La tarea ha sido creada correctamente", {
          description: "Tarea creada",
        });
      }
      await refreshTasks();
      onClose();
    } catch (_error) {
      toast.error("No se pudo guardar la tarea", {
        description: "Error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const { nameTyped } = createFieldNameTyped<InitialValues>();

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{task ? "Editar Tarea" : "Nueva Tarea"}</DialogTitle>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">{t("close")}</span>
          </button>
        </DialogHeader>

        <Formik
          initialValues={initialValues}
          validationSchema={TaskSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, setFieldValue, values }) => (
            <Form className="space-y-4 py-4">
              <div className="grid gap-2">
                <FormInput
                  name={nameTyped("title")}
                  type="text"
                  label="Título *"
                  placeholder="Título de la tarea"
                />
              </div>

              <div className="grid gap-2">
                <FormInput
                  name={nameTyped("description")}
                  type="textarea"
                  label="Descripción"
                  placeholder="Descripción de la tarea"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <FormInput
                    name={nameTyped("due_date")}
                    type="date"
                    label="Fecha de vencimiento"
                  />
                </div>

                <div className="grid gap-2">
                  <FormSelect
                    label={t("priority")}
                    name={nameTyped("priority")}
                    placeholder="Baja"
                    options={priorities}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <label htmlFor="project_id" className="text-sm font-medium">
                  {t("project")}
                </label>
                <Select
                  value={values.project_id}
                  onValueChange={(value) => setFieldValue("project_id", value)}
                >
                  <SelectTrigger id="project_id">
                    <SelectValue placeholder="Seleccionar proyecto" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <ErrorMessage
                  name="project_id"
                  component="div"
                  className="text-sm text-red-500"
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose}>
                  {t("cancel")}
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting
                    ? "Guardando..."
                    : task
                    ? "Guardar cambios"
                    : "Crear tarea"}
                </Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}
