"use client"

import * as React from "react"
import { X as XIcon, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

export interface Option {
  label: string
  value: string
  disable?: boolean
}

interface MultipleSelectorProps {
  value?: Option[]
  defaultOptions: Option[]
  onValueChange?: (options: Option[]) => void
  placeholder?: string
  emptyIndicator?: React.ReactNode
  maxCount?: number
  hidePlaceholderWhenSelected?: boolean
  disabled?: boolean
  creatable?: boolean
  emptyText?: string
  className?: string
  hideClearAllButton?: boolean
}

export function MultipleSelector({
  value,
  defaultOptions,
  onValueChange,
  placeholder,
  emptyIndicator,
  maxCount,
  hidePlaceholderWhenSelected,
  disabled,
  creatable,
  emptyText,
  className,
  hideClearAllButton = false,
}: MultipleSelectorProps) {
  const [open, setOpen] = React.useState(false)
  const [selectedOptions, setSelectedOptions] = React.useState<Option[]>(value || [])
  const [searchValue, setSearchValue] = React.useState("")

  React.useEffect(() => {
    if (value) {
      setSelectedOptions(value)
    }
  }, [value])

  const handleUnselect = (option: Option) => {
    const newOptions = selectedOptions.filter((s) => s.value !== option.value)
    setSelectedOptions(newOptions)
    onValueChange?.(newOptions)
  }

  const handleSelect = (option: Option) => {
    if (selectedOptions.length >= (maxCount || Number.MAX_SAFE_INTEGER)) return
    const newOptions = [...selectedOptions, option]
    setSelectedOptions(newOptions)
    onValueChange?.(newOptions)
    setSearchValue("")
  }

  const filteredOptions = defaultOptions.filter((option) =>
    option.label.toLowerCase().includes(searchValue.toLowerCase())
  )

  const availableOptions = filteredOptions.filter(
    (option) => !selectedOptions.find((selected) => selected.value === option.value)
  )

  // Закрывать dropdown при клике вне
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (open && !target.closest('.multiple-selector-container')) {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open])

  return (
    <div className="relative multiple-selector-container">
      <div
        role="combobox"
        className={cn(
          "relative w-full rounded-md border border-gray-300 bg-transparent text-sm shadow-sm",
          "min-h-[38px]",
          {
            "opacity-50": disabled,
          },
          className
        )}
        onClick={() => !disabled && setOpen(!open)}
      >
        <div className="flex flex-wrap gap-1 px-3 py-2">
          {selectedOptions.map((option) => (
            <div
              key={option.value}
              className="inline-flex items-center gap-1 rounded-md bg-input/50 px-2 py-1 text-sm"
            >
              {option.label}
              <button
                type="button"
                className="rounded-full outline-none hover:bg-gray-200"
                onMouseDown={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
                onClick={() => !disabled && handleUnselect(option)}
              >
                <XIcon className="h-3 w-3" />
              </button>
            </div>
          ))}
          {(!hidePlaceholderWhenSelected || selectedOptions.length === 0) && (
            <input
              placeholder={placeholder}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              className="flex-1 bg-transparent outline-none placeholder:text-gray-400"
              disabled={disabled}
            />
          )}
        </div>
        <button
          type="button"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
          onClick={(e) => {
            e.stopPropagation()
            !disabled && setOpen(!open)
          }}
        >
          <ChevronDown className={cn("h-4 w-4", open && "rotate-180")} />
        </button>
      </div>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg">
          <div className="max-h-60 overflow-auto p-1">
            {availableOptions.length === 0 ? (
              emptyIndicator || (
                <div className="py-6 text-center text-sm text-gray-500">
                  {emptyText || "Ничего не найдено"}
                </div>
              )
            ) : (
              <>
                {availableOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    disabled={option.disable || disabled}
                    onClick={(e) => {
                      e.stopPropagation()
                      !option.disable && handleSelect(option)
                    }}
                    className={cn(
                      "w-full cursor-pointer rounded-sm px-2 py-1.5 text-left text-sm hover:bg-gray-100",
                      option.disable && "opacity-50"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </>
            )}
          </div>
          {selectedOptions.length > 0 && !hideClearAllButton && (
            <div className="border-t border-gray-200 p-2">
              <button
                type="button"
                className="text-xs text-gray-500 hover:text-gray-700"
                onClick={() => {
                  setSelectedOptions([])
                  onValueChange?.([])
                }}
              >
                Очистить всё
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

