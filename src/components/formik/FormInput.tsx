"use client";

import { useEffect, useState } from "react";

import { useTranslations } from "next-intl";
import { ErrorMessage, useField } from "formik";
import { NumericFormat } from "react-number-format";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from "../ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";

interface Option {
  id: string | number;
  label: string;
  value?: unknown;
}

interface Props {
  name: string;
  label?: string;
  placeholder?: string;
  className?: string;
  type:
    | React.HTMLInputTypeAttribute
    | "textarea"
    | "checkbox"
    | "switch"
    | "price"
    | "select"
    | "combobox";
  disabled?: boolean;
  showErrorMessage?: boolean;
  currencyPrefix?: string;
  options?: Option[];
  optionsEmptyCombobox?: string;
  onChangeCallback?: () => void;
}

export function FormInput({
  name,
  type,
  label,
  options,
  disabled,
  className,
  placeholder,
  currencyPrefix,
  optionsEmptyCombobox,
  showErrorMessage = true,
  onChangeCallback,
  ...props
}: Props) {
  let inputElement;

  const [field, meta, helpers] = useField(name);

  const [openSelect, setOpenSelect] = useState<boolean>(false);
  const [openCombobox, setOpenCombobox] = useState<boolean>(false);

  const handleSelectToggleCombobox = (option: Option) => {
    if (field.value && field.value.value === option.value) {
      helpers.setValue(undefined);
    } else {
      helpers.setValue(option);
      onChangeCallback?.(); // <-- Llamada a la función de callback
    }
  };

  const handleChange = (value: unknown) => {
    helpers.setValue(value);
    onChangeCallback?.(); // <-- Llamada a la función de callback
  };

  switch (type) {
    case "textarea":
      inputElement = (
        <Textarea
          disabled={disabled}
          id={name}
          {...field}
          {...props}
          placeholder={placeholder}
          onChange={(e) => handleChange(e.target.value)}
          className={`border ${
            meta.touched && meta.error ? "border-red-500" : ""
          } ${className}`}
        />
      );
      break;
    case "password":
      console.log("🚀 ~ Falta implementar FormInput password");

      inputElement = (
        <Input
          disabled={disabled}
          id={name}
          {...field}
          {...props}
          type={type}
          placeholder={placeholder}
          className={`border ${
            meta.touched && meta.error ? "border-red-500" : ""
          } ${className}`}
        />
      );

      break;
    case "search":
      console.log("🚀 ~ Falta implementar FormInput search");

      inputElement = (
        <Input
          disabled={disabled}
          id={name}
          {...field}
          {...props}
          type={type}
          placeholder={placeholder}
          className={`border ${
            meta.touched && meta.error ? "border-red-500" : ""
          } ${className}`}
        />
      );

      break;
    case "date":
      console.log("🚀 ~ Falta implementar FormInput date");

      inputElement = (
        <Input
          disabled={disabled}
          id={name}
          {...field}
          {...props}
          type={type}
          placeholder={placeholder}
          className={`border ${
            meta.touched && meta.error ? "border-red-500" : ""
          } ${className}`}
        />
      );

      break;
    case "switch":
      inputElement = (
        <Switch
          disabled={disabled}
          id={name}
          {...field}
          {...props}
          checked={field.value}
          onCheckedChange={(checked) => {
            field.onChange({ target: { name, value: checked } });
          }}
        />
      );
      break;
    case "checkbox":
      inputElement = (
        <Checkbox
          disabled={disabled}
          id={name}
          {...field}
          {...props}
          checked={field.value}
          onCheckedChange={(checked) => {
            field.onChange({ target: { name, value: checked } });
          }}
          className={`${
            meta.touched && meta.error ? "border-red-500" : ""
          } ${className}`}
        />
      );
      break;
    case "price":
      let numericValue: string;

      inputElement = (
        <NumericFormat
          {...field}
          {...props}
          id={name}
          disabled={disabled}
          prefix={currencyPrefix || "$"}
          placeholder={placeholder}
          thousandSeparator=","
          decimalSeparator="."
          decimalScale={2}
          fixedDecimalScale
          allowNegative={false}
          className={`border ${
            meta.touched && meta.error ? "border-red-500" : ""
          } ${className}`}
          customInput={Input}
          onValueChange={(values) => {
            numericValue = `${values?.floatValue}` || "";
          }}
          onChange={(event) => {
            event.target.value = numericValue;
            field.onChange(event);
          }}
        />
      );
      break;
    case "select":
      inputElement = (
        <Select
          disabled={disabled}
          open={openSelect}
          onOpenChange={setOpenSelect}
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
            {options?.map((option) => (
              <SelectItem key={option.id} value={JSON.stringify(option)}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
      break;
    case "combobox":
      inputElement = (
        <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
          <PopoverTrigger asChild>
            <Button
              id={name}
              disabled={disabled}
              variant="outline"
              role="combobox"
              aria-expanded={openCombobox}
              className="w-full justify-between"
            >
              {field.value
                ? options?.find((option) => option.id === field.value?.id)
                    ?.label
                : placeholder}

              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput
                placeholder={placeholder || "Buscar..."}
                className="h-9"
              />
              <CommandList>
                <CommandEmpty>
                  {optionsEmptyCombobox || "No encontrado."}
                </CommandEmpty>
                <CommandGroup>
                  {options?.map((option) => (
                    <CommandItem
                      key={option.id}
                      value={JSON.stringify(option)}
                      onSelect={() => {
                        handleSelectToggleCombobox(option);
                        setOpenCombobox(false);
                      }}
                    >
                      {option.label}
                      <Check
                        className={cn(
                          "ml-auto",
                          field.value && field.value.id === option.id
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      );
      break;

    default:
      inputElement = (
        <Input
          disabled={disabled}
          id={name}
          {...field}
          {...props}
          type={type}
          placeholder={placeholder}
          onChange={(e) => handleChange(e.target.value)}
          className={`border ${
            meta.touched && meta.error ? "border-red-500" : ""
          } ${className}`}
        />
      );
      break;
  }

  const t = useTranslations();

  useEffect(() => {
    if (meta.value && meta.error) {
      helpers.setTouched(true, true);
      return;
    }

    if (meta.touched) {
      helpers.setTouched(true, true);
      return;
    }
  }, [meta?.error, meta?.touched, meta?.value, helpers, t]);

  return (
    <div className={cn("space-y-2 space-x-2")}>
      {(type === "checkbox" || type === "switch") && (
        <div className="flex items-start space-x-2">
          {inputElement}
          <div className="grid gap-1.5 leading-none">
            <Label
              onClick={(event) => {
                if (disabled) event.preventDefault();
              }}
              htmlFor={name}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {label || <span className="invisible">.</span>}
            </Label>
          </div>
        </div>
      )}

      {type !== "checkbox" && type !== "switch" && (
        <>
          <Label
            onClick={(event) => {
              if (disabled) event.preventDefault();
            }}
            htmlFor={name}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label || <span className="invisible">.</span>}
          </Label>
          {inputElement}
        </>
      )}

      {showErrorMessage && (
        <ErrorMessage
          name={name}
          component="p"
          className="text-sm text-red-500"
        />
      )}
    </div>
  );
}
