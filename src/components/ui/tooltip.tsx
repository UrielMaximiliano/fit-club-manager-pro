// -----------------------------------------------------------------------------
// Componente Tooltip y subcomponentes (Atom/Molecule - Atomic Design)
// Cada subcomponente sigue el principio de Responsabilidad Única (SRP - SOLID).
// Permite mostrar información adicional al pasar el mouse o enfocar un elemento.
// -----------------------------------------------------------------------------
import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/lib/utils"

// Proveedor de tooltips (contexto global)
const TooltipProvider = TooltipPrimitive.Provider

// Componente raíz del tooltip
const Tooltip = TooltipPrimitive.Root

// Trigger del tooltip (elemento que lo activa)
const TooltipTrigger = TooltipPrimitive.Trigger

/**
 * Contenido del Tooltip
 */
const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
