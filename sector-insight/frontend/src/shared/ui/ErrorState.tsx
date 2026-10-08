import React from "react"
import { cn } from "@/src/shared/lib/cn"
import { Button } from "./Button"

export interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  message: string
  onRetry?: () => void
  retryText?: string
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Terjadi Kesalahan",
  message,
  onRetry,
  retryText = "Coba Lagi",
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-space-xl text-center border border-data-bearish/30 rounded bg-data-bearish/5 my-space-md",
        className
      )}
      {...props}
    >
      <div className="w-12 h-12 rounded-full bg-data-bearish/20 flex items-center justify-center mb-space-md text-data-bearish">
        <span className="material-symbols-outlined text-[24px]">error</span>
      </div>
      <h4 className="font-headline-sm text-headline-sm font-semibold text-text-primary mb-1">
        {title}
      </h4>
      <p className="font-body-sm text-body-sm text-text-secondary max-w-sm mb-space-lg leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry} leftIcon={<span className="material-symbols-outlined text-[16px]">refresh</span>}>
          {retryText}
        </Button>
      )}
    </div>
  )
}
