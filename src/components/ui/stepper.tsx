"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface StepperContextValue {
  currentStep: number
  orientation: "horizontal" | "vertical"
}

const StepperContext = React.createContext<StepperContextValue | undefined>(undefined)

interface StepperProps {
  defaultValue?: number
  value?: number
  onValueChange?: (value: number) => void
  orientation?: "horizontal" | "vertical"
  children: React.ReactNode
  className?: string
}

const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  ({ defaultValue = 1, value: controlledValue, onValueChange, orientation = "vertical", children, className, ...props }, ref) => {
    const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue)
    const value = controlledValue ?? uncontrolledValue
    const setValue = React.useCallback(
      (newValue: number) => {
        if (controlledValue === undefined) {
          setUncontrolledValue(newValue)
        }
        onValueChange?.(newValue)
      },
      [controlledValue, onValueChange]
    )

    return (
      <StepperContext.Provider value={{ currentStep: value, orientation }}>
        <div
          ref={ref}
          className={cn(
            "flex",
            orientation === "horizontal" ? "flex-row" : "flex-col",
            className
          )}
          data-orientation={orientation}
          {...props}
        >
          {children}
        </div>
      </StepperContext.Provider>
    )
  }
)
Stepper.displayName = "Stepper"

interface StepperItemProps {
  step: number
  children: React.ReactNode
  className?: string
}

const StepperItemBase = React.forwardRef<HTMLDivElement, StepperItemProps>(
  ({ step, children, className, ...props }, ref) => {
    const context = React.useContext(StepperContext)
    if (!context) throw new Error("StepperItem must be used within Stepper")

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex",
          context.orientation === "horizontal" ? "flex-row" : "flex-col",
          className
        )}
        data-step={step}
        {...props}
      >
        {children}
      </div>
    )
  }
)
StepperItemBase.displayName = "StepperItemBase"

interface StepperTriggerProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

const StepperTrigger = React.forwardRef<HTMLButtonElement, StepperTriggerProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        className={cn("flex items-center gap-2", className)}
        {...props}
      >
        {children}
      </button>
    )
  }
)
StepperTrigger.displayName = "StepperTrigger"

interface StepperIndicatorProps {
  className?: string
}

const StepperIndicator = React.forwardRef<HTMLDivElement, StepperIndicatorProps>(
  ({ className, ...props }, ref) => {
    const context = React.useContext(StepperContext)
    if (!context) throw new Error("StepperIndicator must be used within Stepper")

    const parent = React.useContext(StepperItemContext)
    if (!parent) throw new Error("StepperIndicator must be used within StepperItem")

    const isActive = context.currentStep === parent.step
    const isCompleted = context.currentStep > parent.step

    return (
      <div
        ref={ref}
        className={cn(
          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 font-medium text-sm transition-colors",
          isActive && "bg-primary text-primary-foreground border-primary",
          isCompleted && "bg-primary text-primary-foreground border-primary",
          !isActive && !isCompleted && "bg-transparent text-foreground border-border",
          className
        )}
        {...props}
      >
        {isCompleted ? "✓" : parent.step}
      </div>
    )
  }
)
StepperIndicator.displayName = "StepperIndicator"

interface StepperTitleProps {
  children: React.ReactNode
  className?: string
}

const StepperTitle = React.forwardRef<HTMLDivElement, StepperTitleProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("text-sm font-semibold text-foreground", className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
StepperTitle.displayName = "StepperTitle"

interface StepperDescriptionProps {
  children: React.ReactNode
  className?: string
}

const StepperDescription = React.forwardRef<HTMLDivElement, StepperDescriptionProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("text-xs text-muted-foreground uppercase", className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
StepperDescription.displayName = "StepperDescription"

interface StepperSeparatorProps {
  className?: string
}

const StepperSeparator = React.forwardRef<HTMLDivElement, StepperSeparatorProps>(
  ({ className, ...props }, ref) => {
    const context = React.useContext(StepperContext)
    if (!context) throw new Error("StepperSeparator must be used within Stepper")

    return (
      <div
        ref={ref}
        className={cn(
          "absolute",
          context.orientation === "horizontal"
            ? "left-[calc(1.5rem+0.125rem)] top-1/2 h-0.5 w-[calc(100%-1.5rem-0.25rem)] -translate-y-1/2 -translate-x-1/2"
            : "top-[calc(1.5rem+0.125rem)] left-3 h-[calc(100%-1.5rem-0.25rem)] w-0.5 -translate-x-1/2",
          "bg-border",
          className
        )}
        {...props}
      />
    )
  }
)
StepperSeparator.displayName = "StepperSeparator"

interface StepperItemContextValue {
  step: number
}

const StepperItemContext = React.createContext<StepperItemContextValue | undefined>(undefined)

const StepperItem = React.forwardRef<HTMLDivElement, StepperItemProps>(
  ({ step, children, ...props }, ref) => {
    return (
      <StepperItemContext.Provider value={{ step }}>
        <StepperItemBase ref={ref} step={step} {...props}>
          {children}
        </StepperItemBase>
      </StepperItemContext.Provider>
    )
  }
)
StepperItem.displayName = "StepperItem"

export {
  Stepper,
  StepperItem,
  StepperTrigger,
  StepperIndicator,
  StepperTitle,
  StepperDescription,
  StepperSeparator,
}

