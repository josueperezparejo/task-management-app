"use client";

import { useState } from "react";

import { ErrorMessage, useField } from "formik";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from "@/components/ui/select";

interface Props {
  name: string;
  label?: string;
  placeholder?: string;
  options: { label: string; value: string; id?: string }[];
}

export function FormSelect({ name, label, placeholder, options }: Props) {
  const [field, , helpers] = useField(name);
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-3">
      {label && (
        <Label onClick={() => setOpen(true)} htmlFor={name}>
          {label}
        </Label>
      )}

      <Select
        open={open}
        onOpenChange={setOpen}
        onValueChange={(value) => {
          helpers.setValue(JSON.parse(value));
        }}
        value={field.value ? JSON.stringify(field.value) : ""}
      >
        <SelectTrigger id={name}>
          <SelectValue
            placeholder={placeholder || "Seleccione una categoria"}
          />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={JSON.stringify(option)}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <ErrorMessage
        name={name}
        component="div"
        className="text-sm text-red-500"
      />
    </div>
  );
}
