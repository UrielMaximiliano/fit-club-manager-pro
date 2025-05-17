// -----------------------------------------------------------------------------
// Componente Input reutilizable (Atom - Atomic Design)
// Sigue el principio de Responsabilidad Única (SRP - SOLID).
// Permite extensión mediante props y composición.
// -----------------------------------------------------------------------------
import * as React from "react"

import { cn } from '../../lib/utils'

/**
 * Componente Input
 * @param {React.ComponentProps<"input">} props - Propiedades del input
 * @returns {JSX.Element}
 */
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
