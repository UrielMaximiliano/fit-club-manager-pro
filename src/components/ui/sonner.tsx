// -----------------------------------------------------------------------------
// Componente Toaster (Sonner) reutilizable (Atom - Atomic Design)
// Sigue el principio de Responsabilidad Única (SRP - SOLID).
// Permite mostrar notificaciones tipo toast con soporte de tema.
// -----------------------------------------------------------------------------
import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

// Tipado de las props del toaster
type ToasterProps = React.ComponentProps<typeof Sonner>

/**
 * Componente Toaster (Sonner)
 * @param {ToasterProps} props - Propiedades del toaster
 * @returns {JSX.Element}
 */
const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
