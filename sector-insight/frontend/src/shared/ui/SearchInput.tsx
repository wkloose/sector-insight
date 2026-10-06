import React from "react"
import { cn } from "@/src/shared/lib/cn"

export interface SearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  shortcut?: string
  onClear?: () => void
  containerClassName?: string
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      className,
      containerClassName,
      shortcut = "⌘K",
      placeholder = "Cari ticker, broker, sinyal...",
      value,
      onChange,
      onClear,
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn("relative flex items-center w-full", containerClassName)}>
        <span className="material-symbols-outlined absolute left-space-sm text-[18px] text-text-secondary pointer-events-none">
          search
        </span>
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          aria-label={props["aria-label"] || placeholder}
          className={cn(
            "w-full bg-surface-container-lowest border border-border-subtle rounded py-2 pl-9 pr-12 font-body-sm text-body-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-brand-red focus-visible:ring-1 focus-visible:ring-brand-red transition-colors",
            className
          )}
          {...props}
        />
        {value && onClear ? (
          <button
            type="button"
            onClick={onClear}
            aria-label="Hapus teks pencarian"
            className="absolute right-1 w-8 h-8 flex items-center justify-center text-text-secondary hover:text-text-primary rounded cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-brand-red"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        ) : shortcut ? (
          <kbd className="absolute right-space-sm px-1.5 py-0.5 bg-surface-container-high border border-border-subtle rounded font-mono text-[10px] text-text-secondary select-none pointer-events-none">
            {shortcut}
          </kbd>
        ) : null}
      </div>
    )
  }
)

SearchInput.displayName = "SearchInput"

