// -----------------------------------------------------------------------------
// Componente Skeleton reutilizable (Atom - Atomic Design)
// Sigue el principio de Responsabilidad Única (SRP - SOLID).
// Utilizado para mostrar placeholders animados durante la carga de datos.
// -----------------------------------------------------------------------------
import React from 'react'
import { cn } from '../../lib/utils'

/**
 * Componente Skeleton
 * @param {React.HTMLAttributes<HTMLDivElement>} props - Propiedades del skeleton
 * @returns {JSX.Element}
 */
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

export { Skeleton }
