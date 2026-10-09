import { useState, type ChangeEvent } from "react";
import type { z } from "zod";

export interface UseZodInputOptions<T extends z.ZodTypeAny> {
  schema: T;
  initialValue?: string;
  validateOnChange?: boolean;
}

/**
 * Hook para validación reactiva de un input individual utilizando esquemas Zod.
 * Proporciona `inputProps` para vincular directamente con `<Input {...email.inputProps} />`.
 */
export function useZodInput<T extends z.ZodTypeAny>(
  schemaOrOptions: T | UseZodInputOptions<T>,
  initialVal = ""
) {
  const options =
    typeof schemaOrOptions === "object" && "schema" in schemaOrOptions
      ? (schemaOrOptions as UseZodInputOptions<T>)
      : { schema: schemaOrOptions as T, initialValue: initialVal, validateOnChange: false };

  const { schema, initialValue = "", validateOnChange = false } = options;
  const [value, setValue] = useState<string>(initialValue);
  const [error, setError] = useState<string | null>(null);
  const [isTouched, setIsTouched] = useState<boolean>(false);

  const validate = (valToTest?: string): boolean => {
    const val = valToTest !== undefined ? valToTest : value;
    const result = schema.safeParse(val);
    if (!result.success) {
      const msg = result.error.issues[0]?.message || "Valor inválido";
      setError(msg);
      return false;
    }
    setError(null);
    return true;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const nextVal = e.target.value;
    setValue(nextVal);
    if (validateOnChange || error) {
      validate(nextVal);
    }
  };

  const handleBlur = () => {
    setIsTouched(true);
    validate();
  };

  const reset = (newVal = initialValue) => {
    setValue(newVal);
    setError(null);
    setIsTouched(false);
  };

  return {
    value,
    setValue,
    error,
    setError,
    isTouched,
    isValid: error === null && isTouched,
    validate,
    reset,
    inputProps: {
      value,
      onChange: handleChange,
      onBlur: handleBlur,
      error: error || undefined,
    },
  };
}
