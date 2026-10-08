import React from "react"
import { cn } from "@/src/shared/lib/cn"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger"
  size?: "sm" | "md" | "lg"
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer"

    const variantStyles = {
      primary: "bg-brand-red hover:bg-brand-red/90 text-text-primary shadow-sm",
      secondary: "bg-surface-card hover:bg-surface-container-high text-text-primary border border-border-subtle",
      outline: "bg-transparent hover:bg-surface-container-high text-text-primary border border-border-subtle",
      ghost: "bg-transparent hover:bg-surface-card text-text-secondary hover:text-text-primary",
      danger: "bg-data-bearish hover:bg-data-bearish/90 text-text-primary shadow-sm",
    }

    const sizeStyles = {
      sm: "min-h-[36px] px-space-sm text-body-sm gap-1.5",
      md: "min-h-[40px] px-space-md text-body-md gap-2",
      lg: "min-h-[48px] px-space-lg text-headline-sm gap-2.5",
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {isLoading ? (
          <span className="w-4 h-4 border-2 border-text-primary border-t-transparent rounded-full animate-spin" />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    )
  }
)

Button.displayName = "Button"
