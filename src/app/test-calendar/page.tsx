"use client"

import { useState, useRef, useEffect } from "react"
import Header from "@/components/Header"
import BurgerMenu from "@/components/BurgerMenu"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import Checklist from "@/components/metrika/Checklist"
import FileUploader from "@/components/metrika/FileUploader"
import InputList from "@/components/metrika/InputList"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
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
import { ru } from "date-fns/locale"

const CALENDAR_WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"]
const TIME_SLOTS = Array.from({ length: ((19 - 10) * 60) / 15 + 1 }, (_, idx) => {
  const minutesFromStart = idx * 15
  const totalMinutes = 10 * 60 + minutesFromStart
  const hour = Math.floor(totalMinutes / 60)
  const minute = totalMinutes % 60
  const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
  return { time, available: true }
})

const steps = [
  { number: 1, title: "Основная информация" },
  { number: 2, title: "Дополнительные параметры" },
  { number: 3, title: "Дополнительные настройки" },
  { number: 4, title: "Итоги" },
]

interface User {
  id: string
  name: string
  role: string
}

// Тестовые пользователи
const users: User[] = [
  { id: "1", name: "Анна Петрова", role: "admin" },
  { id: "2", name: "Иван Сидоров", role: "manager" },
  { id: "3", name: "Мария Козлова", role: "employee" },
  { id: "4", name: "Алексей Волков", role: "employee" },
  { id: "5", name: "Елена Соколова", role: "employee" },
  { id: "6", name: "Дмитрий Морозов", role: "freelancer" },
  { id: "7", name: "Ольга Новикова", role: "client" },
  { id: "8", name: "Сергей Лебедев", role: "employee" },
]

export default function TestCalendarStepThreePage() {
  const currentStep = 3

  const [subtasks, setSubtasks] = useState<
    Array<{
      id: string
      title: string
      description: string
      deadline: string
      deadlineTime: string
      startDate: string
      startTime: string
      completionTime: string
    }>
  >([])

  // Фильтр пользователей для исполнителей (только определенные роли)
  const executorUsers = users.filter((user) =>
    ["admin", "manager", "employee", "freelancer"].includes(user.role)
  )

  // Календари для подзадачи
  const todayRef = useRef<Date | null>(null)
  if (!todayRef.current) {
    todayRef.current = new Date()
  }
  const today = todayRef.current
  const todayStart = startOfDay(today)

  // Календарь для срока выполнения подзадачи
  const [subtaskDeadlineDate, setSubtaskDeadlineDate] = useState<Date>(today)
  const [subtaskDeadlineTime, setSubtaskDeadlineTime] = useState<string | null>(null)
  const [subtaskDeadlineMonth, setSubtaskDeadlineMonth] = useState<Date>(today)

  // Календарь для начала выполнения подзадачи
  const [subtaskStartDate, setSubtaskStartDate] = useState<Date>(today)
  const [subtaskStartTime, setSubtaskStartTime] = useState<string | null>(null)
  const [subtaskStartMonth, setSubtaskStartMonth] = useState<Date>(today)

  // Время на выполнение подзадачи
  const [subtaskCompletionTime, setSubtaskCompletionTime] = useState<string>("")

  // Функции для календаря срока выполнения
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

  const { days: deadlineDays, title: deadlineMonthTitle } = buildCalendarData(subtaskDeadlineMonth)
  const { days: startDays, title: startMonthTitle } = buildCalendarData(subtaskStartMonth)

  const handleSubtaskDeadlineDateSelect = (day: Date) => {
    if (isBefore(day, todayStart)) return
    setSubtaskDeadlineDate(day)
    setSubtaskDeadlineTime(null)
    const formatted = format(day, "yyyy-MM-dd")
    const newSubtasks = [...subtasks]
    if (newSubtasks.length === 0) {
      newSubtasks.push({
        id: Date.now().toString(),
        title: "",
        description: "",
        deadline: "",
        deadlineTime: "",
        startDate: "",
        startTime: "",
        completionTime: "",
      })
    }
    newSubtasks[0].deadline = formatted
    setSubtasks(newSubtasks)
  }

  const handleSubtaskStartDateSelect = (day: Date) => {
    if (isBefore(day, todayStart)) return
    setSubtaskStartDate(day)
    setSubtaskStartTime(null)
    const formatted = format(day, "yyyy-MM-dd")
    const newSubtasks = [...subtasks]
    if (newSubtasks.length === 0) {
      newSubtasks.push({
        id: Date.now().toString(),
        title: "",
        description: "",
        deadline: "",
        deadlineTime: "",
        startDate: "",
        startTime: "",
        completionTime: "",
      })
    }
    newSubtasks[0].startDate = formatted
    setSubtasks(newSubtasks)
  }

  useEffect(() => {
    const nextTime = !subtaskDeadlineTime || subtaskDeadlineTime === "Весь день" ? "" : subtaskDeadlineTime
    setSubtasks((prev) => {
      const newSubtasks = [...prev]
      if (newSubtasks.length === 0) {
        newSubtasks.push({
          id: Date.now().toString(),
          title: "",
          description: "",
          deadline: "",
          deadlineTime: "",
          startDate: "",
          startTime: "",
          completionTime: "",
        })
      }
      if (newSubtasks[0].deadlineTime !== nextTime) {
        newSubtasks[0].deadlineTime = nextTime
      }
      return newSubtasks
    })
  }, [subtaskDeadlineTime])

  useEffect(() => {
    const nextTime = !subtaskStartTime || subtaskStartTime === "Весь день" ? "" : subtaskStartTime
    setSubtasks((prev) => {
      const newSubtasks = [...prev]
      if (newSubtasks.length === 0) {
        newSubtasks.push({
          id: Date.now().toString(),
          title: "",
          description: "",
          deadline: "",
          deadlineTime: "",
          startDate: "",
          startTime: "",
          completionTime: "",
        })
      }
      if (newSubtasks[0].startTime !== nextTime) {
        newSubtasks[0].startTime = nextTime
      }
      return newSubtasks
    })
  }, [subtaskStartTime])

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
                    <h1 className="text-3xl font-bold mb-2">Дополнительные настройки</h1>
                    <p className="text-muted-foreground">
                      Добавьте подзадачи, чеклист, вложения и настройте автоматизацию.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <Accordion type="single" collapsible className="w-full">
                      {/* Подзадача */}
                      <AccordionItem value="subtask" className="py-2 border-border">
                        <AccordionTrigger className="py-2 text-[15px] leading-6 hover:no-underline">
                          Подзадача
                        </AccordionTrigger>
                        <AccordionContent className="pb-2">
                          <div className="space-y-4 pt-2">
                            {/* Основная информация - показывается сразу */}
                            <div className="space-y-4">
                              {/* Название задачи */}
                              <div className="space-y-2">
                                <Label htmlFor="subtask-title" className="text-sm font-medium">
                                  Название задачи
                                </Label>
                                <Input
                                  id="subtask-title"
                                  type="text"
                                  placeholder="Введите название подзадачи"
                                  value={subtasks[0]?.title || ""}
                                  onChange={(e) => {
                                    const newSubtasks = [...subtasks]
                                    if (newSubtasks.length === 0) {
                                      newSubtasks.push({
                                        id: Date.now().toString(),
                                        title: "",
                                        description: "",
                                        deadline: "",
                                        deadlineTime: "",
                                        startDate: "",
                                        startTime: "",
                                        completionTime: "",
                                      })
                                    }
                                    newSubtasks[0].title = e.target.value
                                    setSubtasks(newSubtasks)
                                  }}
                                />
                              </div>

                              {/* Описание задачи */}
                              <div className="space-y-2">
                                <Label htmlFor="subtask-description" className="text-sm font-medium">
                                  Описание задачи
                                </Label>
                                <Textarea
                                  id="subtask-description"
                                  rows={3}
                                  placeholder="Опишите детали подзадачи"
                                  value={subtasks[0]?.description || ""}
                                  onChange={(e) => {
                                    const newSubtasks = [...subtasks]
                                    if (newSubtasks.length === 0) {
                                      newSubtasks.push({
                                        id: Date.now().toString(),
                                        title: "",
                                        description: "",
                                        deadline: "",
                                        deadlineTime: "",
                                        startDate: "",
                                        startTime: "",
                                        completionTime: "",
                                      })
                                    }
                                    newSubtasks[0].description = e.target.value
                                    setSubtasks(newSubtasks)
                                  }}
                                />
                              </div>
                            </div>

                            {/* Мультиаккордеон с тремя частями */}
                            <div className="space-y-0">
                              {/* Срок выполнения */}
                              <Collapsible className="border-t border-border">
                                <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-[15px] leading-6 hover:no-underline [&[data-state=open]>svg]:rotate-180">
                                  <span>Срок выполнения</span>
                                  <ChevronDownIcon
                                    size={16}
                                    className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200"
                                    aria-hidden="true"
                                  />
                                </CollapsibleTrigger>
                                <CollapsibleContent className="overflow-hidden text-sm transition-all data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                                  <div className="pb-[17px]">
                                    <div className="w-full overflow-x-auto">
                                      <div className="inline-flex flex-col rounded-md border bg-background shadow-sm md:flex-row">
                                        <div className="border-border p-2 md:border-r w-[450px]">
                                          <div className="relative flex flex-col gap-4">
                                            <div className="w-full">
                                              <div className="relative mx-10 mb-1 flex h-9 items-center justify-center">
                                                <div className="text-sm font-medium">{deadlineMonthTitle}</div>
                                                <div className="absolute top-0 flex w-full justify-between">
                                                  <button
                                                    onClick={() => setSubtaskDeadlineMonth((prev) => subMonths(prev, 1))}
                                                    className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 size-9 p-0 text-muted-foreground/80 hover:text-foreground hover:bg-accent hover:text-accent-foreground"
                                                    type="button"
                                                  >
                                                    <ChevronLeftIcon size={16} aria-hidden="true" />
                                                  </button>
                                                  <button
                                                    onClick={() => setSubtaskDeadlineMonth((prev) => addMonths(prev, 1))}
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
                                                  const isCurrentMonth = isSameMonth(day, subtaskDeadlineMonth)
                                                  const isSelected = isSameDay(day, subtaskDeadlineDate)
                                                  const isDisabled = isBefore(day, todayStart)
                                                  const isToday = isSameDay(day, today)

                                                  return (
                                                    <div key={idx} className="group size-9 px-0 py-px text-sm">
                                                      <button
                                                        onClick={() => handleSubtaskDeadlineDateSelect(day)}
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
                                                        onClick={() => setSubtaskDeadlineTime("Весь день")}
                                                        className={`
                                                          inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap
                                                          transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px]
                                                          focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50
                                                          h-8 rounded-md px-3 text-xs w-full
                                                          ${
                                                            subtaskDeadlineTime === "Весь день"
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
                                                          onClick={() => available && setSubtaskDeadlineTime(time)}
                                                          disabled={!available}
                                                          className={`
                                                            inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap
                                                            transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px]
                                                            focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50
                                                            h-8 rounded-md px-3 text-xs w-full
                                                            ${
                                                              subtaskDeadlineTime === time
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
                                </CollapsibleContent>
                              </Collapsible>

                              {/* Начало выполнения */}
                              <Collapsible className="border-t border-border">
                                <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-[15px] leading-6 hover:no-underline [&[data-state=open]>svg]:rotate-180">
                                  <span>Начало выполнения</span>
                                  <ChevronDownIcon
                                    size={16}
                                    className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200"
                                    aria-hidden="true"
                                  />
                                </CollapsibleTrigger>
                                <CollapsibleContent className="overflow-hidden text-sm transition-all data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                                  <div className="pb-[17px]">
                                    <div className="w-full overflow-x-auto">
                                      <div className="inline-flex flex-col rounded-md border bg-background shadow-sm md:flex-row">
                                        <div className="border-border p-2 md:border-r w-[450px]">
                                          <div className="relative flex flex-col gap-4">
                                            <div className="w-full">
                                              <div className="relative mx-10 mb-1 flex h-9 items-center justify-center">
                                                <div className="text-sm font-medium">{startMonthTitle}</div>
                                                <div className="absolute top-0 flex w-full justify-between">
                                                  <button
                                                    onClick={() => setSubtaskStartMonth((prev) => subMonths(prev, 1))}
                                                    className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 size-9 p-0 text-muted-foreground/80 hover:text-foreground hover:bg-accent hover:text-accent-foreground"
                                                    type="button"
                                                  >
                                                    <ChevronLeftIcon size={16} aria-hidden="true" />
                                                  </button>
                                                  <button
                                                    onClick={() => setSubtaskStartMonth((prev) => addMonths(prev, 1))}
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
                                                {startDays.map((day, idx) => {
                                                  const isCurrentMonth = isSameMonth(day, subtaskStartMonth)
                                                  const isSelected = isSameDay(day, subtaskStartDate)
                                                  const isDisabled = isBefore(day, todayStart)
                                                  const isToday = isSameDay(day, today)

                                                  return (
                                                    <div key={idx} className="group size-9 px-0 py-px text-sm">
                                                      <button
                                                        onClick={() => handleSubtaskStartDateSelect(day)}
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
                                                        onClick={() => setSubtaskStartTime("Весь день")}
                                                        className={`
                                                          inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap
                                                          transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px]
                                                          focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50
                                                          h-8 rounded-md px-3 text-xs w-full
                                                          ${
                                                            subtaskStartTime === "Весь день"
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
                                                          onClick={() => available && setSubtaskStartTime(time)}
                                                          disabled={!available}
                                                          className={`
                                                            inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap
                                                            transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px]
                                                            focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50
                                                            h-8 rounded-md px-3 text-xs w-full
                                                            ${
                                                              subtaskStartTime === time
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
                                </CollapsibleContent>
                              </Collapsible>

                              {/* Время на выполнение */}
                              <Collapsible className="border-t border-border">
                                <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-[15px] leading-6 hover:no-underline [&[data-state=open]>svg]:rotate-180">
                                  <span>Время на выполнение</span>
                                  <ChevronDownIcon
                                    size={16}
                                    className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200"
                                    aria-hidden="true"
                                  />
                                </CollapsibleTrigger>
                                <CollapsibleContent className="overflow-hidden text-sm transition-all data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                                  <div className="pb-2">
                                    <div className="space-y-3 pt-2">
                                      <div className="grid grid-cols-6 gap-2">
                                        {[
                                          { value: "0:15", label: "15 минут" },
                                          { value: "0:30", label: "30 минут" },
                                          { value: "1:00", label: "1 час" },
                                          { value: "2:00", label: "2 часа" },
                                          { value: "3:00", label: "3 часа" },
                                          { value: "4:00", label: "4 часа" },
                                        ].map(({ value, label }) => (
                                          <Button
                                            key={value}
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                              setSubtaskCompletionTime(value)
                                              const newSubtasks = [...subtasks]
                                              if (newSubtasks.length === 0) {
                                                newSubtasks.push({
                                                  id: Date.now().toString(),
                                                  title: "",
                                                  description: "",
                                                  deadline: "",
                                                  deadlineTime: "",
                                                  startDate: "",
                                                  startTime: "",
                                                  completionTime: "",
                                                })
                                              }
                                              newSubtasks[0].completionTime = value
                                              setSubtasks(newSubtasks)
                                            }}
                                            className={cn(
                                              (subtaskCompletionTime === value || subtasks[0]?.completionTime === value) &&
                                                "bg-primary text-primary-foreground"
                                            )}
                                          >
                                            {label}
                                          </Button>
                                        ))}
                                      </div>
                                      <div className="grid grid-cols-6 gap-2">
                                        {[
                                          { value: "5:00", label: "5 часов" },
                                          { value: "6:00", label: "6 часов" },
                                          { value: "7:00", label: "7 часов" },
                                          { value: "8:00", label: "8 часов" },
                                          { value: "9:00", label: "9 часов" },
                                        ].map(({ value, label }) => (
                                          <Button
                                            key={value}
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                              setSubtaskCompletionTime(value)
                                              const newSubtasks = [...subtasks]
                                              if (newSubtasks.length === 0) {
                                                newSubtasks.push({
                                                  id: Date.now().toString(),
                                                  title: "",
                                                  description: "",
                                                  deadline: "",
                                                  deadlineTime: "",
                                                  startDate: "",
                                                  startTime: "",
                                                  completionTime: "",
                                                })
                                              }
                                              newSubtasks[0].completionTime = value
                                              setSubtasks(newSubtasks)
                                            }}
                                            className={cn(
                                              (subtaskCompletionTime === value || subtasks[0]?.completionTime === value) &&
                                                "bg-primary text-primary-foreground"
                                            )}
                                          >
                                            {label}
                                          </Button>
                                        ))}
                                        <div>
                                          <Input
                                            id="subtask-completion-time-input"
                                            type="text"
                                            placeholder="ЧЧ:ММ"
                                            value={subtaskCompletionTime || subtasks[0]?.completionTime || ""}
                                            onChange={(e) => {
                                              setSubtaskCompletionTime(e.target.value)
                                              const newSubtasks = [...subtasks]
                                              if (newSubtasks.length === 0) {
                                                newSubtasks.push({
                                                  id: Date.now().toString(),
                                                  title: "",
                                                  description: "",
                                                  deadline: "",
                                                  deadlineTime: "",
                                                  startDate: "",
                                                  startTime: "",
                                                  completionTime: "",
                                                })
                                              }
                                              newSubtasks[0].completionTime = e.target.value
                                              setSubtasks(newSubtasks)
                                            }}
                                            className="w-24 text-center"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </CollapsibleContent>
                              </Collapsible>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      {/* Чеклист */}
                      <AccordionItem value="checklist" className="py-2 border-border">
                        <AccordionTrigger className="py-2 text-[15px] leading-6 hover:no-underline">
                          Чеклист
                        </AccordionTrigger>
                        <AccordionContent className="pb-2">
                          <div className="pt-2">
                            <Checklist executorUsers={executorUsers} curatorUsers={users} />
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      {/* Вложения */}
                      <AccordionItem value="attachments" className="py-2 border-border">
                        <AccordionTrigger className="py-2 text-[15px] leading-6 hover:no-underline">
                          Вложения
                        </AccordionTrigger>
                        <AccordionContent className="pb-2">
                          <div className="pt-2">
                            <FileUploader />
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      {/* Ссылки */}
                      <AccordionItem value="links" className="py-2 border-border">
                        <AccordionTrigger className="py-2 text-[15px] leading-6 hover:no-underline">
                          Ссылки
                        </AccordionTrigger>
                        <AccordionContent className="pb-2">
                          <div className="pt-2">
                            <InputList />
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      {/* Автоматизация */}
                      <AccordionItem value="automation" className="py-2 border-border">
                        <AccordionTrigger className="py-2 text-[15px] leading-6 hover:no-underline">
                          Автоматизация
                        </AccordionTrigger>
                        <AccordionContent className="pb-2 text-muted-foreground">
                          <div className="space-y-3 pt-2">
                            <p className="text-sm">
                              Настройте автоматические действия для задачи: уведомления, переходы между статусами, создание связанных задач и другие автоматические процессы.
                            </p>
                            <Button variant="outline" size="sm">
                              Настроить автоматизацию
                            </Button>
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
    </div>
  )
}
