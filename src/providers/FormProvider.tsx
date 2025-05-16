"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface FormContextType<T> {
  // control
  step: number;
  totalSteps: number;

  // form
  formValues: T;
  setFormValues: (values: T) => void;

  // actions
  nextStep: () => void;
  prevStep: () => void;
  resetForm: () => void;

  saveProgress: () => void;
  loadProgress: () => void;

  // helpers
  initialErrors: Record<string, string>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setInitialErrors: (errors: Record<string, any>) => void;

  initialTouched: Record<string, boolean>;
  setInitialTouched: (touched: Record<string, boolean>) => void;
}

interface Props<T> {
  children: React.ReactNode;
  initialStep: number;
  totalSteps: number;
  initialValues: T;
  autoFilledValues?: T;
  formKey: string;
  useLocalStorage?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const FormContext = createContext<FormContextType<any> | undefined>(undefined);

export function FormProvider<T>({
  formKey,
  children,
  totalSteps,
  initialStep,
  initialValues,
  autoFilledValues,
  useLocalStorage = false,
}: Props<T>) {
  const [step, setStep] = useState<number>(initialStep);

  const [formValues, setFormValues] = useState<T>(
    autoFilledValues ? autoFilledValues : initialValues
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [initialErrors, setInitialErrors] = useState<Record<string, any>>({});
  const [initialTouched, setInitialTouched] = useState<Record<string, boolean>>(
    {}
  );

  const nextStep = () => {
    if (step < totalSteps) {
      setInitialErrors({});
      setInitialTouched({});
      setStep((prev) => prev + 1);
    } else {
      console.log(
        `🚫🚶‍♂️ Cannot proceed to the next step because the total number of steps (${totalSteps}) has been reached. 🛑😔`
      );
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    } else {
      console.log(
        `🔙🚶‍♂️ Cannot go back to the previous step because the current step is already at the minimum value (1). 🛑😟`
      );
    }
  };

  const resetForm = () => {
    clearProgress();
    setStep(1);
    setFormValues(initialValues);
  };

  const saveProgress = useCallback(() => {
    if (!useLocalStorage) return;
    localStorage.setItem(
      `formProgress_${formKey}`,
      JSON.stringify({ step, formValues })
    );
  }, [useLocalStorage, formKey, step, formValues]);

  const clearProgress = useCallback(() => {
    localStorage.removeItem(`formProgress_${formKey}`);
  }, [formKey]);

  const loadProgress = useCallback(() => {
    if (!useLocalStorage) return;
    if (autoFilledValues) return clearProgress(); // Ahora usamos la versión memoizada

    const savedData = localStorage.getItem(`formProgress_${formKey}`);
    if (savedData) {
      const { step, formValues } = JSON.parse(savedData);
      setStep(step);
      setFormValues(formValues);
    }
  }, [useLocalStorage, autoFilledValues, formKey, clearProgress]);

  /** Cargar progreso solo si existe en el montaje */
  useEffect(() => {
    if (localStorage.getItem(`formProgress_${formKey}`)) {
      loadProgress();
    }
  }, [formKey, loadProgress]);

  /** Guardar progreso con debounce para evitar escrituras excesivas */
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (autoFilledValues) return clearProgress();

      saveProgress();
    }, 500); // Espera 500ms antes de guardar

    return () => clearTimeout(timeout);
  }, [step, formValues, autoFilledValues, clearProgress, saveProgress]); // Guarda cuando cambian `step` o `formValues`

  return (
    <FormContext.Provider
      value={{
        // control
        step,
        totalSteps,

        // form
        formValues,
        setFormValues,

        // actions
        nextStep,
        prevStep,
        resetForm,

        saveProgress,
        loadProgress,

        // helpers
        initialErrors,
        setInitialErrors,

        initialTouched,
        setInitialTouched,
      }}
    >
      {children}
    </FormContext.Provider>
  );
}

// Hook personalizado para consumir el contexto
export function useFormContext<T>(): FormContextType<T> {
  const context = useContext(FormContext);

  if (!context) {
    throw new Error("useFormContext must be used within a FormProvider 🚫📄");
  }

  return context as FormContextType<T>;
}
