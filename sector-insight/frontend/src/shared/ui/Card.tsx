import React from "react"
import { cn } from "@/src/shared/lib/cn"

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean
  bordered?: boolean
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverable = false, bordered = true, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-surface-card rounded p-space-lg text-text-primary transition-all",
          bordered && "border border-border-subtle",
          hoverable && "hover:bg-surface-container-low cursor-pointer",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = "Card"

export type CardHeaderProps = React.HTMLAttributes<HTMLDivElement>

export const CardHeader: React.FC<CardHeaderProps> = ({ className, children, ...props }) => {
  return (
    <div className={cn("flex items-center justify-between gap-space-md mb-space-md", className)} {...props}>
      {children}
    </div>
  )
}

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
}

export const CardTitle: React.FC<CardTitleProps> = ({
  as: Component = "h3",
  className,
  children,
  ...props
}) => {
  return (
    <Component className={cn("font-headline-sm text-headline-sm font-semibold text-text-primary", className)} {...props}>
      {children}
    </Component>
  )
}

export type CardContentProps = React.HTMLAttributes<HTMLDivElement>

export const CardContent: React.FC<CardContentProps> = ({ className, children, ...props }) => {
  return (
    <div className={cn("flex flex-col gap-space-sm", className)} {...props}>
      {children}
    </div>
  )
}

export type CardFooterProps = React.HTMLAttributes<HTMLDivElement>

export const CardFooter: React.FC<CardFooterProps> = ({ className, children, ...props }) => {
  return (
    <div className={cn("flex items-center justify-between pt-space-md mt-space-md border-t border-border-subtle/60", className)} {...props}>
      {children}
    </div>
  )
}

