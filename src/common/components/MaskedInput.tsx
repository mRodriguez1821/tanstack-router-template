import {
  forwardRef,
  useState,
  type ChangeEvent,
} from "react";
import { Input, type InputProps } from "./Input";

export interface MaskedInputProps extends InputProps {
  /**
   * Patrón de máscara donde:
   * - '9' representa un dígito (0-9)
   * - 'a' representa una letra (a-z, A-Z)
   * - '*' representa cualquier caracter alfanumérico
   * Cualquier otro carácter se trata como delimitador fijo (ej. '(', ')', '-', '/', ' ')
   * Ejemplos: "(999) 999-9999", "9999-9999-9999-9999", "99/99/9999", "999.999.999-99"
   */
  mask: string;
}

/**
 * Aplica una máscara al valor crudo suministrado.
 */
function applyMask(rawValue: string, maskPattern: string): string {
  if (!rawValue) return "";

  // Extraer sólo los caracteres alfanuméricos relevantes del input
  const cleanChars = rawValue.replace(/[^a-zA-Z0-9]/g, "").split("");
  let charIndex = 0;
  let formattedResult = "";

  for (let i = 0; i < maskPattern.length && charIndex < cleanChars.length; i++) {
    const maskToken = maskPattern[i];

    if (maskToken === "9") {
      // Debe ser dígito
      while (charIndex < cleanChars.length && !/\d/.test(cleanChars[charIndex])) {
        charIndex++;
      }
      if (charIndex < cleanChars.length) {
        formattedResult += cleanChars[charIndex++];
      }
    } else if (maskToken === "a") {
      // Debe ser letra
      while (charIndex < cleanChars.length && !/[a-zA-Z]/.test(cleanChars[charIndex])) {
        charIndex++;
      }
      if (charIndex < cleanChars.length) {
        formattedResult += cleanChars[charIndex++];
      }
    } else if (maskToken === "*") {
      // Cualquier alfanumérico
      formattedResult += cleanChars[charIndex++];
    } else {
      // Delimitador estático fijo (ej. guion, paréntesis, espacio)
      formattedResult += maskToken;
    }
  }

  return formattedResult;
}

/**
 * Componente MaskedInput:
 * Aplica formateo dinámico en tiempo real según un patrón de máscara:
 * - Teléfonos: "(999) 999-9999"
 * - Tarjetas: "9999-9999-9999-9999"
 * - Fechas: "99/99/9999"
 * - Documentos / DNI: "999.999.999-99"
 */
export const MaskedInput = forwardRef<HTMLInputElement, MaskedInputProps>(
  function MaskedInput({ mask, onChange, value, defaultValue, ...props }, ref) {
    const [displayVal, setDisplayVal] = useState<string>(() => {
      const initial = String(value ?? defaultValue ?? "");
      return applyMask(initial, mask);
    });

    const isControlled = value !== undefined;
    const currentVal = isControlled ? applyMask(String(value), mask) : displayVal;

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
      const formatted = applyMask(e.target.value, mask);
      if (!isControlled) {
        setDisplayVal(formatted);
      }

      // Propagar el evento con el valor enmascarado formateado
      e.target.value = formatted;
      onChange?.(e);
    };

    return (
      <Input
        ref={ref}
        value={currentVal}
        onChange={handleInputChange}
        {...props}
      />
    );
  }
);
