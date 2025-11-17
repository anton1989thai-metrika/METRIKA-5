"use client"

import { useState } from "react"
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isBefore,
  startOfDay,
  addMonths,
  subMonths,
  getDay,
  addDays,
  subDays,
} from "date-fns"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { ru } from "date-fns/locale"

const TIME_SLOTS = Array.from({ length: ((19 - 10) * 60) / 15 + 1 }, (_, idx) => {
  const minutesFromStart = idx * 15
  const totalMinutes = 10 * 60 + minutesFromStart
  const hour = Math.floor(totalMinutes / 60)
  const minute = totalMinutes % 60
  const time = `${hour.toString().padStart(2, "0")}:${minute
    .toString()
    .padStart(2, "0")}`
  return { time, available: true }
})

export default function Component() {
  const today = new Date()
  const todayStart = startOfDay(today)
  const [date, setDate] = useState<Date>(today)
  const [time, setTime] = useState<string | null>(null)
  const [currentMonth, setCurrentMonth] = useState<Date>(today)

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const weekdayStart = (getDay(monthStart) + 6) % 7
  const weekdayEnd = (getDay(monthEnd) + 6) % 7
  const startDate = startOfDay(subDays(monthStart, weekdayStart))
  const endDate = addDays(monthEnd, 6 - weekdayEnd)
  const days = eachDayOfInterval({ start: startDate, end: endDate })
  const monthTitleRaw = format(currentMonth, "LLLL yyyy", { locale: ru })
  const monthTitle =
    monthTitleRaw.charAt(0).toUpperCase() + monthTitleRaw.slice(1)

  const previousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const handleDateSelect = (day: Date) => {
    if (isBefore(day, todayStart)) return
    setDate(day)
    setTime(null)
  }

  const weekdays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"]

  return (
    <div className="w-full min-h-screen flex items-start justify-center py-10 sm:items-center">
      <div className="rounded-md border">
        <div className="flex max-sm:flex-col">
          <div className="p-2 sm:pe-5 border-b max-sm:border-b border-border w-fit">
            <div className="relative flex flex-col gap-4 w-fit">
              <div className="w-full">
                <div className="relative mx-10 mb-1 flex h-9 items-center justify-center z-20">
                  <div className="text-sm font-medium">{monthTitle}</div>
                  <div className="absolute top-0 flex w-full justify-between z-10">
                    <button
                      onClick={previousMonth}
                      className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 size-9 p-0 text-muted-foreground/80 hover:text-foreground hover:bg-accent hover:text-accent-foreground"
                      type="button"
                    >
                      <ChevronLeftIcon size={16} aria-hidden="true" />
                    </button>
                    <button
                      onClick={nextMonth}
                      className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 size-9 p-0 text-muted-foreground/80 hover:text-foreground hover:bg-accent hover:text-accent-foreground"
                      type="button"
                    >
                      <ChevronRightIcon size={16} aria-hidden="true" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-0">
                  {weekdays.map((weekday) => (
                    <div
                      key={weekday}
                      className="size-9 p-0 text-xs font-medium text-muted-foreground/80 flex items-center justify-center"
                    >
                      {weekday}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-0 mt-0">
                  {days.map((day, idx) => {
                    const isCurrentMonth = isSameMonth(day, currentMonth)
                    const isSelected = isSameDay(day, date)
                    const isDisabled = isBefore(day, todayStart)
                    const isToday = isSameDay(day, today)

                    return (
                      <div
                        key={idx}
                        className="group size-9 px-0 py-px text-sm"
                      >
                        <button
                          onClick={() => handleDateSelect(day)}
                          disabled={isDisabled}
                          className={`
                            relative flex size-9 items-center justify-center whitespace-nowrap rounded-md p-0 text-foreground
                            transition-[color,background-color,border-radius,box-shadow] duration-150
                            focus-visible:z-10 outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px]
                            ${isDisabled ? "pointer-events-none text-foreground/30 line-through" : ""}
                            ${!isCurrentMonth ? "text-foreground/30" : ""}
                            ${isSelected && isCurrentMonth ? "bg-primary text-primary-foreground" : ""}
                            ${!isSelected && !isDisabled && isCurrentMonth ? "hover:bg-accent" : ""}
                            ${
                              isToday && !isSelected
                                ? "after:pointer-events-none after:absolute after:bottom-1 after:start-1/2 after:z-10 after:size-[3px] after:-translate-x-1/2 after:rounded-full after:bg-primary after:transition-colors"
                                : ""
                            }
                            ${
                              isToday && isSelected
                                ? "after:pointer-events-none after:absolute after:bottom-1 after:start-1/2 after:z-10 after:size-[3px] after:-translate-x-1/2 after:rounded-full after:bg-background after:transition-colors"
                                : ""
                            }
                            ${
                              isToday && isDisabled
                                ? "after:pointer-events-none after:absolute after:bottom-1 after:start-1/2 after:z-10 after:size-[3px] after:-translate-x-1/2 after:rounded-full after:bg-foreground/30 after:transition-colors"
                                : ""
                            }
                          `}
                          type="button"
                        >
                          {format(day, "d")}
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
          <div className="relative w-full max-sm:h-48 sm:w-40">
            <div className="absolute inset-0 py-4 sm:border-s">
              <div className="relative h-full">
                <div className="size-full rounded-[inherit] overflow-hidden">
                  <div
                    className="h-full overflow-y-auto"
                    style={{ scrollbarWidth: "thin" }}
                  >
                    <div className="space-y-3">
                      <div className="px-5">
                        <button
                          onClick={() => setTime("Весь день")}
                          className={`
                            inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap
                            transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px]
                            focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50
                            h-8 rounded-md px-3 text-xs w-full
                            ${
                              time === "Весь день"
                                ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                                : "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground"
                            }
                          `}
                          type="button"
                        >
                          Весь день
                        </button>
                      </div>
                      <div className="grid gap-1.5 px-5 max-sm:grid-cols-2">
                        {TIME_SLOTS.map(({ time: timeSlot, available }) => (
                          <button
                            key={timeSlot}
                            onClick={() => available && setTime(timeSlot)}
                            disabled={!available}
                            className={`
                              inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap
                              transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px]
                              focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50
                              h-8 rounded-md px-3 text-xs w-full
                              ${
                                time === timeSlot
                                  ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                                  : "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground"
                              }
                            `}
                            type="button"
                          >
                            {timeSlot}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex touch-none select-none h-full w-2.5 border-l border-l-transparent p-px absolute top-0 right-0 pointer-events-none">
                  <div
                    className="relative flex-1 rounded-full bg-border opacity-0"
                    style={{ minHeight: "10px" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
