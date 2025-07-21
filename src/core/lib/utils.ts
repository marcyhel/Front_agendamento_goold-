import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utilitário para mesclar classes CSS condicionalmente
 * Combina as funcionalidades de clsx e tailwind-merge para
 * criar strings de classe otimizadas e sem conflitos
 * 
 * @param inputs - Lista de classes ou objetos de condição
 * @returns String de classes CSS mesclada e otimizada
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
