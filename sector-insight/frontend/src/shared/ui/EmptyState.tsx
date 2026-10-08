import React from "react"
import { cn } from "@/src/shared/lib/cn"

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: string
  title: string
  description?: string
  action?: React.ReactNode
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = "inbox",
  title,
  description,
  action,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-space-xl text-center border border-dashed border-border-subtle rounded bg-surface-card/40 my-space-md",
        className
      )}
      {...props}
    >
      <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center mb-space-md text-text-secondary">
        <span className="material-symbols-outlined text-[24px]">{icon}</span>
      </div>
      <h4 className="font-headline-sm text-headline-sm font-semibold text-text-primary mb-1">
        {title}
      </h4>
      {description && (
        <p className="font-body-sm text-body-sm text-text-secondary max-w-sm mb-space-md leading-relaxed">
          {description}
        </p>
      )}
      {action && <div className="mt-space-xs">{action}</div>}
    </div>
  )
}
