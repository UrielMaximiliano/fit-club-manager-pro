// -----------------------------------------------------------------------------
// Componente Separator reutilizable (Atom - Atomic Design)
// Sigue el principio de Responsabilidad Única (SRP - SOLID).
// Utilizado para separar visualmente secciones de la interfaz.
// -----------------------------------------------------------------------------
import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"

import { cn } from "@/lib/utils"

/**
 * Componente Separator
 * @param {React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>} props - Propiedades del separador
 * @returns {JSX.Element}
 */
const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(
  (
    { className, orientation = "horizontal", decorative = true, ...props },
    ref
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      )}
      {...props}
    />
  )
)
Separator.displayName = SeparatorPrimitive.Root.displayName

export { Separator }
