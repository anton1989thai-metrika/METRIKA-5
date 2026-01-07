"use client"

import * as React from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
export interface PrioritySelectProps extends Omit<React.ComponentProps<typeof Select>, "children"> {
  label?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const PriorityDot = ({ className, color }: { className?: string; color: string }) => (
  <svg
    className={className}
    width="8"
    height="8"
    fill="currentColor"
    viewBox="0 0 8 8"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <circle cx="4" cy="4" r="4" className={color} />
  </svg>
)

const PrioritySelect = React.forwardRef<HTMLButtonElement, PrioritySelectProps>(
  ({ label, value, onChange, ...props }, ref) => {
    const handleValueChange = (val: string) => {
      if (onChange) {
        onChange({ target: { value: val } } as React.ChangeEvent<HTMLSelectElement>)
      }
    }

    return (
      <div className="w-full">
        {label && (
          <Label className="block text-sm text-gray-900 mb-2 font-normal">{label}</Label>
        )}
        <Select value={value} onValueChange={handleValueChange} {...props}>
          <SelectTrigger ref={ref} className="[&>span>span]:flex [&>span>span]:items-center [&>span>span]:gap-2 [&>span>span>svg]:hidden focus:ring-0 focus:ring-offset-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">
              <span className="flex items-center gap-2">
                <PriorityDot color="text-green-500" />
                <span>Обычная</span>
              </span>
            </SelectItem>
            <SelectItem value="medium">
              <span className="flex items-center gap-2">
                <PriorityDot color="text-orange-500" />
                <span>Важная</span>
              </span>
            </SelectItem>
            <SelectItem value="high">
              <span className="flex items-center gap-2">
                <PriorityDot color="text-red-500" />
                <span>Срочная</span>
              </span>
            </SelectItem>
            <SelectItem value="boss">
              <span className="flex items-center gap-2">
                <PriorityDot color="text-yellow-500" />
                <span>Задача от руководителя</span>
              </span>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    )
  }
)
PrioritySelect.displayName = "PrioritySelect"

export { PrioritySelect }

