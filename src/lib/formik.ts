import { ObjectSchema } from "yup";
import { FormikErrors } from "formik";

type DeepKeys<T> = T extends object
  ? {
      [K in keyof T]: K | `${string & K}.${string & DeepKeys<T[K]>}`;
    }[keyof T]
  : never;

export function createFieldNameTyped<T>() {
  function nameTyped<K extends DeepKeys<T>>(field: K): K {
    return field;
  }

  function dynamicNameTyped<K extends DeepKeys<T>>(
    baseField: K,
    index: number
  ): string {
    return (baseField as string).replace("0", `${index}`);
  }

  return {
    nameTyped,
    dynamicNameTyped,
  };
}

export function createFieldValueTyped<T>(
  setFieldValue: (
    field: string,
    value: unknown,
    shouldValidate?: boolean
  ) => Promise<void | FormikErrors<T>>
) {
  function setFieldValueTyped<K extends keyof T>(
    field: K,
    value: T[K],
    shouldValidate?: boolean
  ) {
    return setFieldValue(field as string, value, shouldValidate);
  }

  return { setFieldValueTyped };
}

export function getClearFieldsObjectFromSchema(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: ObjectSchema<any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Record<string, any> {
  const fieldsToClear = Object.keys(schema.fields);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const clearFields: Record<string, any> = {};

  fieldsToClear.forEach((field) => {
    clearFields[field] = "";
  });

  return clearFields;
}
