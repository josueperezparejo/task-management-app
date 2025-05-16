"use client";

import { useEffect, useState } from "react";

import { Formik, Form } from "formik";

import { X } from "lucide-react";

import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { useTranslations } from "next-intl";
import { createFieldNameTyped } from "@/lib";
import { FormInput } from "./formik/FormInput";

// import { useTasks } from "@/lib/context";
import { updateProject, type Project } from "@/lib/supabase";
import { useProjectSchema } from "@/schemas";
import { toast } from "sonner";
import { useTasks } from "@/lib/context";

interface Props {
  projectId: string | null;
  onClose: () => void;
  showEditProjectForm: boolean;
}

export function EditProjectForm({
  projectId,
  onClose,
  showEditProjectForm,
}: Props) {
  const t = useTranslations();

  const ProjectSchema = useProjectSchema();

  const [isOpen, setisOpen] = useState(showEditProjectForm);

  useEffect(() => {
    setisOpen(showEditProjectForm);
  }, [showEditProjectForm]);

  const { projects, refreshProjects } = useTasks();
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    if (projectId) {
      const foundProject = projects.find((p) => p.id === projectId) || null;
      setProject(foundProject);
    }
  }, [projectId, projects]);

  interface InitialValues {
    name: string;
  }

  const initialValues: InitialValues = {
    name: project?.name || "",
  };

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    console.log("ejecutado sin problema");
    try {
      if (project) {
        await updateProject(project.id, values.name);
        toast(t("project-updated-title"), {
          description: t("project-updated-description"),
        });
      }
      await refreshProjects();
      onClose();
    } catch (_error) {
      toast.error(
        t("project-save-error-title") +
          ": " +
          t("project-save-error-description")
      );
    } finally {
      setSubmitting(false);
    }
  };

  const { nameTyped } = createFieldNameTyped<InitialValues>();

  return (
    <Dialog open={isOpen} onOpenChange={setisOpen}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>{t("edit-project")}</DialogTitle>
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
          validationSchema={ProjectSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4 py-4">
              <div className="grid gap-2">
                <FormInput
                  name={nameTyped("name")}
                  type="text"
                  label={t("project-name-label")}
                  placeholder={t("project-name-placeholder")}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose}>
                  {t("cancel")}
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? t("saving") : t("save-changes")}
                </Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}
