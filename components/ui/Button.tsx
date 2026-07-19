import { type ButtonHTMLAttributes, forwardRef } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-signal-amber text-ink hover:bg-signal-amber/90 focus-visible:outline-signal-amber",
  secondary:
    "bg-panel-raised text-text-primary border border-line hover:border-signal-amber/60",
  ghost: "bg-transparent text-text-muted hover:text-text-primary hover:bg-panel-raised",
  danger: "bg-signal-red text-white hover:bg-signal-red/90",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
};

/**
 * Button base del sistema de diseño. Sprint 1: solo estilos y variantes,
 * sin lógica de negocio asociada a ninguna acción concreta.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className = "", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={[
          "inline-flex items-center justify-center gap-2 rounded-control font-medium tracking-tight",
          "transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-40",
          VARIANT_CLASSES[variant],
          SIZE_CLASSES[size],
          className,
        ].join(" ")}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
