// -----------------------------------------------------------------------------
// Componente Textarea reutilizable (Atom - Atomic Design)
// Sigue el principio de Responsabilidad Única (SRP - SOLID).
// Permite extensión mediante props y composición.
// -----------------------------------------------------------------------------
import * as React from "react"
import { cn } from '../../lib/utils'

// Tipado de las props del textarea
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

/**
 * Componente Textarea
 * @param {TextareaProps} props - Propiedades del textarea
 * @returns {JSX.Element}
 */
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
