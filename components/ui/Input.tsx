import { type InputHTMLAttributes, forwardRef } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
}

/**
 * Input base del sistema de diseño. Sprint 1: solo presentación —
 * no está conectado a ningún formulario funcional ni validación real.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, id, className = "", ...props }, ref) => {
    return (
      <label className="flex flex-col gap-1.5" htmlFor={id}>
        {label && (
          <span className="text-xs font-medium text-text-muted">{label}</span>
        )}
        <input
          ref={ref}
          id={id}
          className={[
            "h-10 rounded-control border border-line bg-panel-raised px-3",
            "text-sm text-text-primary placeholder:text-text-faint",
            "outline-none transition-colors focus:border-signal-amber",
            className,
          ].join(" ")}
          {...props}
        />
        {hint && <span className="text-xs text-text-faint">{hint}</span>}
      </label>
    );
  }
);

Input.displayName = "Input";
