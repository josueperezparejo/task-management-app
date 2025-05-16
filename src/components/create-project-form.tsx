"use client";

import { Formik, Form } from "formik";
import { useTranslations } from "next-intl";

import { X } from "lucide-react";
import { FormInput } from "./formik/FormInput";

import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { useTasks } from "@/lib/context";
import { createFieldNameTyped } from "@/lib";
import { createProject } from "@/lib/supabase";
import { useProjectSchema } from "@/schemas";
import { toast } from "sonner";

interface Props {
  onClose: () => void;
  showCreateProjectForm: boolean;
}

export function CreateProjectForm({ onClose, showCreateProjectForm }: Props) {
  const t = useTranslations();

  const ProjectSchema = useProjectSchema();

  const { refreshProjects } = useTasks();

  interface InitialValues {
    name: string;
  }

  const initialValues: InitialValues = {
    name: "",
  };

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      await createProject(values.name);

      toast.success(t("project-created-title"), {
        description: t("project-created-description"),
      });

      await refreshProjects();
      onClose();
    } catch (_error) {
      toast.error(t("project-save-error-title"), {
        description: t("project-save-error-description"),
      });
    } finally {
      setSubmitting(false);
    }
  };

  const { nameTyped } = createFieldNameTyped<InitialValues>();

  return (
    <Dialog open={showCreateProjectForm} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>{t("new-project")}</DialogTitle>
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
                  {isSubmitting ? t("saving") : t("create-project")}
                </Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}
