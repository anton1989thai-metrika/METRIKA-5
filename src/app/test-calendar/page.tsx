"use client"

import { useEffect, useId, useRef, useState } from "react"
import Header from "@/components/Header"
import BurgerMenu from "@/components/BurgerMenu"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import MetrikaSelect from "@/components/metrika/MetrikaSelect"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isBefore,
  isSameDay,
  isSameMonth,
  startOfDay,
  startOfMonth,
  subDays,
  subMonths,
} from "date-fns"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { ru } from "date-fns/locale"

const steps = [
  { number: 1, title: "Основная информация" },
  { number: 2, title: "Дополнительные параметры" },
  { number: 3, title: "Дополнительные настройки" },
  { number: 4, title: "Итоги" },
]

const CALENDAR_WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"]
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

export default function TestCalendarStepTwoPage() {
  const currentStep = 2
  const hiddenTaskId = useId()
  const blockingTaskId = useId()
  const priorityId = useId()
  const [formData, setFormData] = useState({
    priority: "low",
    isHiddenTask: false,
    isBlocking: false,
    deadline: "",
    deadlineTime: "",
    startDate: "",
    startTime: "",
    completionTime: "",
  })
  const [showBlockingDialog, setShowBlockingDialog] = useState(false)
  const [blockingSwitchChecked, setBlockingSwitchChecked] = useState(formData.isBlocking)

  const todayRef = useRef<Date | null>(null)
  if (!todayRef.current) {
    todayRef.current = new Date()
  }
  const today = todayRef.current
  const todayStart = startOfDay(today)

  const [deadlineDate, setDeadlineDate] = useState<Date>(today)
  const [deadlineTime, setDeadlineTime] = useState<string | null>(null)
  const [deadlineMonth, setDeadlineMonth] = useState<Date>(today)

  const [startCalendarDate, setStartCalendarDate] = useState<Date>(today)
  const [startCalendarTime, setStartCalendarTime] = useState<string | null>(null)
  const [startCurrentMonth, setStartCurrentMonth] = useState<Date>(today)

  const buildCalendarData = (currentMonth: Date) => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(currentMonth)
    const weekdayStart = (getDay(monthStart) + 6) % 7
    const weekdayEnd = (getDay(monthEnd) + 6) % 7
    const rangeStart = startOfDay(subDays(monthStart, weekdayStart))
    const rangeEnd = addDays(monthEnd, 6 - weekdayEnd)
    const days = eachDayOfInterval({ start: rangeStart, end: rangeEnd })
    const monthTitleRaw = format(currentMonth, "LLLL yyyy", { locale: ru })
    const title = monthTitleRaw.charAt(0).toUpperCase() + monthTitleRaw.slice(1)
    return { days, title }
  }

  const { days: deadlineDays, title: deadlineMonthTitle } = buildCalendarData(deadlineMonth)
  const { days: startCalendarDays, title: startCalendarMonthTitle } =
    buildCalendarData(startCurrentMonth)

  const handleHiddenToggle = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isHiddenTask: checked }))
  }

  const handleBlockingToggle = (checked: boolean) => {
    if (checked) {
      setBlockingSwitchChecked(true)
      setShowBlockingDialog(true)
      return
    }
    setBlockingSwitchChecked(false)
    setFormData((prev) => ({ ...prev, isBlocking: false }))
  }

  const confirmBlockingToggle = () => {
    setFormData((prev) => ({ ...prev, isBlocking: true }))
    setShowBlockingDialog(false)
  }

  const cancelBlockingToggle = () => {
    setBlockingSwitchChecked(formData.isBlocking)
    setShowBlockingDialog(false)
  }

  const handleDeadlineDateSelect = (day: Date) => {
    if (isBefore(day, todayStart)) return
    setDeadlineDate(day)
    setDeadlineTime(null)
  }

  const handleStartDateSelect = (day: Date) => {
    if (isBefore(day, todayStart)) return
    setStartCalendarDate(day)
    setStartCalendarTime(null)
  }

  useEffect(() => {
    const formatted = format(deadlineDate, "yyyy-MM-dd")
    setFormData((prev) => (prev.deadline === formatted ? prev : { ...prev, deadline: formatted }))
  }, [deadlineDate])

  useEffect(() => {
    const nextTime = !deadlineTime || deadlineTime === "Весь день" ? "" : deadlineTime
    setFormData((prev) =>
      prev.deadlineTime === nextTime ? prev : { ...prev, deadlineTime: nextTime }
    )
  }, [deadlineTime])

  useEffect(() => {
    const formatted = format(startCalendarDate, "yyyy-MM-dd")
    setFormData((prev) => (prev.startDate === formatted ? prev : { ...prev, startDate: formatted }))
  }, [startCalendarDate])

  useEffect(() => {
    const nextTime = !startCalendarTime || startCalendarTime === "Весь день" ? "" : startCalendarTime
    setFormData((prev) => (prev.startTime === nextTime ? prev : { ...prev, startTime: nextTime }))
  }, [startCalendarTime])

  useEffect(() => {
    setBlockingSwitchChecked(formData.isBlocking)
  }, [formData.isBlocking])

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <Header />
      <BurgerMenu />
      <main className="pt-32 px-4 pb-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-[274px_1fr] gap-6 p-4">
            <div className="hidden md:block">
              <div className="bg-gradient-to-b from-primary/20 via-primary/10 to-primary/5 rounded-lg p-8 h-full border border-border">
                <div className="space-y-6">
                  {steps.map((step) => (
                    <div key={step.number} className="flex items-center gap-4">
                      <div
                        className={cn(
                          "flex items-center justify-center w-10 h-10 rounded-full border-2 font-bold transition-colors",
                          currentStep === step.number
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-transparent text-foreground border-border"
                        )}
                      >
                        {step.number}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground uppercase">
                          Шаг {step.number}
                        </span>
                        <span className="text-sm font-semibold text-foreground">{step.title}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="md:hidden bg-gradient-to-r from-primary/20 via-primary/10 to-primary/5 rounded-lg p-8 mb-6 border border-border">
              <div className="flex justify-center gap-4">
                {steps.map((step) => (
                  <div
                    key={step.number}
                    className={cn(
                      "w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold transition-colors",
                      currentStep === step.number
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-transparent text-foreground border-border"
                    )}
                  >
                    {step.number}
                  </div>
                ))}
              </div>
            </div>

            <Card className="bg-card shadow-lg border-0">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">Дополнительные параметры</h1>
                    <p className="text-muted-foreground">
                      Укажите приоритет, сроки выполнения и другие параметры задачи.
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between md:gap-[64px] gap-4 pr-0.5">
                      <MetrikaSelect
                        label="Приоритет"
                        id={priorityId}
                        value={formData.priority}
                        onChange={(e) => setFormData((prev) => ({ ...prev, priority: e.target.value }))}
                        className="w-auto max-w-max"
                      >
                        <option value="low">🟢 Обычная</option>
                        <option value="medium">🟠 Важная</option>
                        <option value="high">🔴 Срочная</option>
                        <option value="boss">🟡 Задача ��т руководителя</option>
                      </MetrikaSelect>

                      <div className="w-auto max-w-max space-y-2 ml-0.5 w-[150px]">
                        <div className="flex flex-col-reverse items-start gap-2">
                          <div className="relative inline-grid h-9 w-[72px] grid-cols-[1fr_1fr] items-center text-sm font-medium">
                            <button
                              id={hiddenTaskId}
                              type="button"
                              role="switch"
                              aria-checked={formData.isHiddenTask}
                              aria-labelledby={`${hiddenTaskId}-label`}
                              data-state={formData.isHiddenTask ? "checked" : "unchecked"}
                              onClick={() => handleHiddenToggle(!formData.isHiddenTask)}
                              className={cn(
                                "peer absolute inset-0 h-full w-[110px] rounded-md transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                formData.isHiddenTask ? "bg-primary/80" : "bg-input/50"
                              )}
                            >
                              <span
                                className={cn(
                                  "pointer-events-none absolute inset-y-1 left-1 w-1/2 rounded-sm bg-background shadow transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                                  formData.isHiddenTask ? "translate-x-full" : "translate-x-0"
                                )}
                              />
                              <span className="sr-only">
                                {formData.isHiddenTask ? "Включено" : "Выключено"}
                              </span>
                            </button>
                            <span className="pointer-events-none relative ml-0.5 flex items-center justify-center px-2 text-center transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] peer-data-[state=checked]:invisible peer-data-[state=unchecked]:translate-x-full">
                              <span className="flex h-full w-full items-center justify-center text-[10px] font-medium uppercase">
                                Выкл
                              </span>
                            </span>
                            <span className="pointer-events-none relative mr-0.5 flex items-center justify-center px-2 text-center transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] peer-data-[state=checked]:-translate-x-full peer-data-[state=checked]:text-background peer-data-[state=unchecked]:invisible">
                              <span className="flex h-full w-full items-center justify-center text-[10px] font-medium uppercase">
                                Вкл
                              </span>
                            </span>
                          </div>
                          <Label
                            id={`${hiddenTaskId}-label`}
                            htmlFor={hiddenTaskId}
                            className="text-sm text-muted-foreground whitespace-nowrap"
                          >
                            Скрытая задача
                          </Label>
                        </div>
                      </div>

                      <div className="w-auto max-w-max space-y-2 ml-0.5 w-[150px]">
                        <div className="flex flex-col-reverse items-start gap-2">
                          <div className="relative inline-grid h-9 w-[72px] grid-cols-[1fr_1fr] items-center text-sm font-medium">
                            <button
                              id={blockingTaskId}
                              type="button"
                              role="switch"
                              aria-checked={blockingSwitchChecked}
                              aria-labelledby={`${blockingTaskId}-label`}
                              data-state={blockingSwitchChecked ? "checked" : "unchecked"}
                              onClick={() => handleBlockingToggle(!blockingSwitchChecked)}
                              className={cn(
                                "peer absolute inset-0 h-full w-[110px] rounded-md transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                blockingSwitchChecked ? "bg-primary/80" : "bg-input/50"
                              )}
                            >
                              <span
                                className={cn(
                                  "pointer-events-none absolute inset-y-1 left-1 w-1/2 rounded-sm bg-background shadow transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                                  blockingSwitchChecked ? "translate-x-full" : "translate-x-0"
                                )}
                              />
                              <span className="sr-only">
                                {blockingSwitchChecked ? "Включено" : "Выключено"}
                              </span>
                            </button>
                            <span className="pointer-events-none relative ml-0.5 flex items-center justify-center px-2 text-center transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] peer-data-[state=checked]:invisible peer-data-[state=unchecked]:translate-x-full">
                              <span className="flex h-full w-full items-center justify-center text-[10px] font-medium uppercase">
                                Выкл
                              </span>
                            </span>
                            <span className="pointer-events-none relative mr-0.5 flex items-center justify-center px-2 text-center transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] peer-data-[state=checked]:-translate-x-full peer-data-[state=checked]:text-background peer-data-[state=unchecked]:invisible">
                              <span className="flex h-full w-full items-center justify-center text-[10px] font-medium uppercase">
                                Вкл
                              </span>
                            </span>
                          </div>
                          <Label
                            id={`${blockingTaskId}-label`}
                            htmlFor={blockingTaskId}
                            className="text-sm text-muted-foreground whitespace-nowrap"
                          >
                            Блокирующая задача
                          </Label>
                        </div>
                        {blockingSwitchChecked && (
                          <div className="space-y-3 pt-2">
                            <p className="text-sm text-muted-foreground">
                              Внимание. Постановка других задач для этого исполнителя блокируется, до момента
                              закрытия этой задачи. Пока эта задача не будет завершена, этому исполнителю нельзя
                              поставить другие задачи.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="deadline" className="border-border">
                        <AccordionTrigger className="py-2 text-[15px] leading-6 hover:no-underline">
                          Срок выполнения
                        </AccordionTrigger>
                        <AccordionContent className="pb-[17px]">
                          <div className="w-full overflow-x-auto">
                            <div className="inline-flex flex-col rounded-md border bg-background shadow-sm md:flex-row">
                              <div className="border-border p-2 md:border-r w-[450px]">
                                <div className="relative flex flex-col gap-4">
                                  <div className="w-full">
                                    <div className="relative mx-10 mb-1 flex h-9 items-center justify-center">
                                      <div className="text-sm font-medium">{deadlineMonthTitle}</div>
                                      <div className="absolute top-0 flex w-full justify-between">
                                        <button
                                          onClick={() => setDeadlineMonth((prev) => subMonths(prev, 1))}
                                          className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 size-9 p-0 text-muted-foreground/80 hover:text-foreground hover:bg-accent hover:text-accent-foreground"
                                          type="button"
                                        >
                                          <ChevronLeftIcon size={16} aria-hidden="true" />
                                        </button>
                                        <button
                                          onClick={() => setDeadlineMonth((prev) => addMonths(prev, 1))}
                                          className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 size-9 p-0 text-muted-foreground/80 hover:text-foreground hover:bg-accent hover:text-accent-foreground"
                                          type="button"
                                        >
                                          <ChevronRightIcon size={16} aria-hidden="true" />
                                        </button>
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-7 gap-0">
                                      {CALENDAR_WEEKDAYS.map((weekday) => (
                                        <div
                                          key={weekday}
                                          className="size-9 p-0 text-xs font-medium text-muted-foreground/80 flex items-center justify-center"
                                        >
                                          {weekday}
                                        </div>
                                      ))}
                                    </div>
                                    <div className="grid grid-cols-7 gap-0 mt-0">
                                      {deadlineDays.map((day, idx) => {
                                        const isCurrentMonth = isSameMonth(day, deadlineMonth)
                                        const isSelected = isSameDay(day, deadlineDate)
                                        const isDisabled = isBefore(day, todayStart)
                                        const isToday = isSameDay(day, today)

                                        return (
                                          <div key={idx} className="group size-9 px-0 py-px text-sm">
                                            <button
                                              onClick={() => handleDeadlineDateSelect(day)}
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
                              <div className="relative w-full md:w-44">
                                <div className="absolute inset-0 pt-[27px] pb-4 md:border-l">
                                  <div className="relative h-full">
                                    <div className="size-full rounded-[inherit] overflow-hidden">
                                      <div className="h-full overflow-y-auto" style={{ scrollbarWidth: "thin" }}>
                                        <div className="space-y-3">
                                          <div className="px-5">
                                            <button
                                              onClick={() => setDeadlineTime("Весь день")}
                                              className={`
                                                inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap
                                                transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px]
                                                focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50
                                                h-8 rounded-md px-3 text-xs w-full
                                                ${
                                                  deadlineTime === "Весь день"
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
                                            {TIME_SLOTS.map(({ time, available }) => (
                                              <button
                                                key={time}
                                                onClick={() => available && setDeadlineTime(time)}
                                                disabled={!available}
                                                className={`
                                                  inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap
                                                  transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px]
                                                  focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50
                                                  h-8 rounded-md px-3 text-xs w-full
                                                  ${
                                                    deadlineTime === time
                                                      ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                                                      : "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground"
                                                  }
                                                `}
                                                type="button"
                                              >
                                                {time}
                                              </button>
                                            ))}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="pointer-events-none absolute top-0 right-0 flex h-full w-2.5 select-none border-l border-l-transparent p-px">
                                        <div className="relative flex-1 rounded-full bg-border opacity-0" style={{ minHeight: "10px" }} />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="start" className="border-border">
                        <AccordionTrigger className="py-2 text-[15px] leading-6 hover:no-underline">
                          Начало выполнения
                        </AccordionTrigger>
                        <AccordionContent className="pt-4 pb-2">
                          <div className="w-full overflow-x-auto">
                            <div className="inline-flex flex-col rounded-md border bg-background shadow-sm md:flex-row">
                              <div className="border-border p-2 md:border-r">
                                <div className="relative flex flex-col gap-4">
                                  <div className="w-full">
                                    <div className="relative mx-10 mb-1 flex h-9 items-center justify-center">
                                      <div className="text-sm font-medium">{startCalendarMonthTitle}</div>
                                      <div className="absolute top-0 flex w-full justify-between">
                                        <button
                                          onClick={() => setStartCurrentMonth((prev) => subMonths(prev, 1))}
                                          className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 size-9 p-0 text-muted-foreground/80 hover:text-foreground hover:bg-accent hover:text-accent-foreground"
                                          type="button"
                                        >
                                          <ChevronLeftIcon size={16} aria-hidden="true" />
                                        </button>
                                        <button
                                          onClick={() => setStartCurrentMonth((prev) => addMonths(prev, 1))}
                                          className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 size-9 p-0 text-muted-foreground/80 hover:text-foreground hover:bg-accent hover:text-accent-foreground"
                                          type="button"
                                        >
                                          <ChevronRightIcon size={16} aria-hidden="true" />
                                        </button>
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-7 gap-0">
                                      {CALENDAR_WEEKDAYS.map((weekday) => (
                                        <div
                                          key={weekday}
                                          className="size-9 p-0 text-xs font-medium text-muted-foreground/80 flex items-center justify-center"
                                        >
                                          {weekday}
                                        </div>
                                      ))}
                                    </div>
                                    <div className="grid grid-cols-7 gap-0 mt-0">
                                      {startCalendarDays.map((day, idx) => {
                                        const isCurrentMonth = isSameMonth(day, startCurrentMonth)
                                        const isSelected = isSameDay(day, startCalendarDate)
                                        const isDisabled = isBefore(day, todayStart)
                                        const isToday = isSameDay(day, today)

                                        return (
                                          <div key={idx} className="group size-9 px-0 py-px text-sm">
                                            <button
                                              onClick={() => handleStartDateSelect(day)}
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
                              <div className="relative w-full md:w-44">
                                <div className="absolute inset-0 py-4 md:border-l">
                                  <div className="relative h-full">
                                    <div className="size-full rounded-[inherit] overflow-hidden">
                                      <div className="h-full overflow-y-auto" style={{ scrollbarWidth: "thin" }}>
                                        <div className="space-y-3">
                                          <div className="px-5">
                                            <button
                                              onClick={() => setStartCalendarTime("Весь день")}
                                              className={`
                                                inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap
                                                transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px]
                                                focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50
                                                h-8 rounded-md px-3 text-xs w-full
                                                ${
                                                  startCalendarTime === "Весь день"
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
                                            {TIME_SLOTS.map(({ time, available }) => (
                                              <button
                                                key={time}
                                                onClick={() => available && setStartCalendarTime(time)}
                                                disabled={!available}
                                                className={`
                                                  inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap
                                                  transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px]
                                                  focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50
                                                  h-8 rounded-md px-3 text-xs w-full
                                                  ${
                                                    startCalendarTime === time
                                                      ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                                                      : "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground"
                                                  }
                                                `}
                                                type="button"
                                              >
                                                {time}
                                              </button>
                                            ))}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="pointer-events-none absolute top-0 right-0 flex h-full w-2.5 select-none border-l border-l-transparent p-px">
                                        <div className="relative flex-1 rounded-full bg-border opacity-0" style={{ minHeight: "10px" }} />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="completionTime" className="border-border">
                        <AccordionTrigger className="py-2 text-[15px] leading-6 hover:no-underline">
                          Время на выполнение
                        </AccordionTrigger>
                        <AccordionContent className="pb-2">
                          <div className="space-y-3 pt-2">
                            <div className="grid grid-cols-3 gap-2">
                              {[1, 2, 3, 4, 5, 6].map((hours) => (
                                <Button
                                  key={hours}
                                  type="button"
                                  variant="outline"
                                  onClick={() =>
                                    setFormData((prev) => ({
                                      ...prev,
                                      completionTime: `${hours}:00`,
                                    }))
                                  }
                                  className={cn(
                                    formData.completionTime === `${hours}:00` &&
                                      "bg-primary text-primary-foreground"
                                  )}
                                >
                                  {hours} {hours === 1 ? "час" : hours < 5 ? "часа" : "часов"}
                                </Button>
                              ))}
                            </div>
                            <div>
                              <Label htmlFor="completion-time-input">
                                Или укажите время вручную (ЧЧ:ММ)
                              </Label>
                              <Input
                                id="completion-time-input"
                                type="text"
                                placeholder="ЧЧ:ММ"
                                value={formData.completionTime}
                                onChange={(e) =>
                                  setFormData((prev) => ({ ...prev, completionTime: e.target.value }))
                                }
                              />
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-8 pt-6 border-t">
                  <Button variant="ghost" type="button">
                    Назад
                  </Button>
                  <Button type="button">Далее</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <AlertDialog open={showBlockingDialog} onOpenChange={setShowBlockingDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Подтвердите действие</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите сделать задачу блокирующей? Пока она не будет завершена, исполнителю нельзя
              поставить другие задачи.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelBlockingToggle}>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={confirmBlockingToggle}>Подтвердить</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
