"use client";

import { useTranslations } from "next-intl";
import * as Yup from "yup";

export const useProjectSchema = () => {
  const t = useTranslations();

  return Yup.object().shape({
    name: Yup.string().required(t("name-required")),
  });
};

export const useTaskSchema = () => {
  const t = useTranslations();

  return Yup.object().shape({
    title: Yup.string().required(t("title-required")),
    description: Yup.string().required(t("description-required")),
    due_date: Yup.string().required(t("due-date-required")),
    priority: Yup.object({
      label: Yup.string(),
      value: Yup.string(),
    }).required(t("priority-required")),
    project_id: Yup.string().required(t("project-id-required")),
  });
};
