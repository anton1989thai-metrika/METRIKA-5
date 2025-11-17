"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MetrikaSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  className?: string;
}

const hasWidthClass = (className?: string) => {
  if (!className) return false;
  return className
    .split(/\s+/)
    .some((cls) => /^(?:w|min-w|max-w)-/.test(cls));
};

const MetrikaSelect = React.forwardRef<HTMLSelectElement, MetrikaSelectProps>(
  ({ label, className, children, id, ...props }, ref) => {
    const generatedId = React.useId();
    const selectId = id || generatedId;
    const customWidth = hasWidthClass(className);

    return (
      <div
        className={cn(
          "flex flex-col space-y-2 relative",
          customWidth ? "w-fit" : "w-full"
        )}
      >
        {label && (
          <Label htmlFor={selectId} className="text-sm font-medium text-foreground">
            {label}
          </Label>
        )}
        <div className={cn("relative", customWidth && "inline-flex")}>
          <select
            ref={ref}
            id={selectId}
            className={cn(
              "appearance-none h-9 rounded-md border border-border bg-background px-3 pr-10 text-sm text-foreground shadow-sm outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200",
              customWidth ? "" : "w-full",
              className
            )}
            {...props}
          >
            {children}
          </select>
          <ChevronDown className="flex items-center justify-center absolute right-2.5 top-1/2 h-4 w-4 text-muted-foreground -translate-y-1/2 pointer-events-none z-10" />
        </div>
      </div>
    );
  }
);

MetrikaSelect.displayName = "MetrikaSelect";

export default MetrikaSelect;
