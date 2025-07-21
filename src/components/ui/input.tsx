import * as React from "react"

import { cn } from "@/core/lib/utils"

/**
 * Interface para as propriedades do componente TextInput
 */
type TextInputProps = React.ComponentProps<"input">

/**
 * Componente de entrada de texto estilizado
 * Fornece uma interface consistente para campos de entrada em formulários
 */
const TextInput: React.FC<TextInputProps> = ({ 
  className, 
  type, 
  ...rest_props 
}) => {
  // Classes base para o componente de entrada
  const base_styles = [
    "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground",
    "dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent", 
    "px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none",
    "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
    "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
    "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
    "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
  ]

  return (
    <input
      type={type}
      data-slot="input"
      className={cn(base_styles, className)}
      {...rest_props}
    />
  )
}

// Exporta o componente com o nome original para manter compatibilidade
export { TextInput as Input }
