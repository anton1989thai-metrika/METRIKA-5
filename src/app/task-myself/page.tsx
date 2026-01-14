"use client";

import { debugLog } from "@/lib/logger"

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import FileUploader from "@/components/metrika/FileUploader";
import InputList from "@/components/metrika/InputList";
import { cn } from "@/lib/utils";
import Header from "@/components/Header";
import BurgerMenu from "@/components/BurgerMenu";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
} from "date-fns";
import { ru } from "date-fns/locale";

const CALENDAR_WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const TIME_SLOTS = Array.from({ length: ((19 - 10) * 60) / 15 + 1 }, (_, idx) => {
  const minutesFromStart = idx * 15;
  const totalMinutes = 10 * 60 + minutesFromStart;
  const hour = Math.floor(totalMinutes / 60);
  const minute = totalMinutes % 60;
  const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
  return { time, available: true };
});

export default function TaskMyselfPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: "",
    deadlineTime: "",
    automationDays: [] as string[],
    automationEveryDay: false,
    automationByDay: false,
    automationDayNumber: "",
    automationSelectedDate: null as Date | null,
  });

  const calendarTodayRef = useRef<Date | null>(null);
  if (!calendarTodayRef.current) {
    calendarTodayRef.current = new Date();
  }
  const calendarToday = calendarTodayRef.current;
  const todayStart = startOfDay(calendarToday);
  const [calendarDate, setCalendarDate] = useState<Date>(calendarToday);
  const [calendarTime, setCalendarTime] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState<Date>(calendarToday);
  const [showAutomationCalendar, setShowAutomationCalendar] = useState(false);
  const [automationCurrentMonth, setAutomationCurrentMonth] = useState<Date>(calendarToday);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const weekdayStart = (getDay(monthStart) + 6) % 7;
  const weekdayEnd = (getDay(monthEnd) + 6) % 7;
  const calendarRangeStart = startOfDay(subDays(monthStart, weekdayStart));
  const calendarRangeEnd = addDays(monthEnd, 6 - weekdayEnd);
  const calendarDays = eachDayOfInterval({ start: calendarRangeStart, end: calendarRangeEnd });
  const calendarMonthRaw = format(currentMonth, "LLLL yyyy", { locale: ru });
  const calendarMonthTitle = calendarMonthRaw.charAt(0).toUpperCase() + calendarMonthRaw.slice(1);

  const automationMonthStart = startOfMonth(automationCurrentMonth);
  const automationMonthEnd = endOfMonth(automationCurrentMonth);
  const automationWeekdayStart = (getDay(automationMonthStart) + 6) % 7;
  const automationWeekdayEnd = (getDay(automationMonthEnd) + 6) % 7;
  const automationCalendarRangeStart = startOfDay(subDays(automationMonthStart, automationWeekdayStart));
  const automationCalendarRangeEnd = addDays(automationMonthEnd, 6 - automationWeekdayEnd);
  const automationCalendarDays = eachDayOfInterval({
    start: automationCalendarRangeStart,
    end: automationCalendarRangeEnd,
  });
  const automationCalendarMonthRaw = format(automationCurrentMonth, "LLLL yyyy", { locale: ru });
  const automationCalendarMonthTitle =
    automationCalendarMonthRaw.charAt(0).toUpperCase() + automationCalendarMonthRaw.slice(1);

  const handleCalendarDateSelect = (day: Date) => {
    if (isBefore(day, todayStart)) return;
    setCalendarDate(day);
    setCalendarTime(null);
  };

  const previousMonth = () => {
    setCurrentMonth((prev) => subMonths(prev, 1));
  };

  const nextMonth = () => {
    setCurrentMonth((prev) => addMonths(prev, 1));
  };

  const previousAutomationMonth = () => {
    setAutomationCurrentMonth((prev) => subMonths(prev, 1));
  };

  const nextAutomationMonth = () => {
    setAutomationCurrentMonth((prev) => addMonths(prev, 1));
  };

  const handleAutomationDateSelect = (day: Date) => {
    const dayNumber = format(day, "d");
    setFormData((prev) => ({
      ...prev,
      automationSelectedDate: day,
      automationDayNumber: dayNumber,
      automationByDay: true,
      automationDays: [],
      automationEveryDay: false,
    }));
    setShowAutomationCalendar(false);
  };

  useEffect(() => {
    const formatted = format(calendarDate, "yyyy-MM-dd");
    setFormData((prev) => (prev.deadline === formatted ? prev : { ...prev, deadline: formatted }));
  }, [calendarDate]);

  useEffect(() => {
    const nextTime = !calendarTime || calendarTime === "Весь день" ? "" : calendarTime;
    setFormData((prev) => (prev.deadlineTime === nextTime ? prev : { ...prev, deadlineTime: nextTime }));
  }, [calendarTime]);

  const handleSubmit = () => {
    debugLog("Form data:", formData);
    // Здесь будет логика сохранения задачи
    alert("Задача создана!");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <BurgerMenu />
      <main className="pt-20 px-4 pb-8">
        <div className="mx-auto" style={{ maxWidth: "694px" }}>
          <Card className="bg-card shadow-lg border-0" style={{ width: "692px", marginTop: "115px" }}>
            <CardContent className="p-8" style={{ marginTop: "-66px" }}>
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Создать задачу себе</h1>
                  <p className="text-muted-foreground">
                    Заполните информацию о задаче
                  </p>
                </div>

                {/* Название задачи */}
                <div className="space-y-2">
                  <Label htmlFor="title">
                    Название задачи <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="Введите название задачи"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                {/* Описание задачи */}
                <div className="space-y-2">
                  <Label htmlFor="description">Описание задачи</Label>
                  <Textarea
                    id="description"
                    rows={4}
                    placeholder="Опишите детали задачи"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                {/* Accordion для остальных полей */}
                <Accordion type="single" collapsible className="w-full">
                  {/* Срок выполнения */}
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
                                  <div className="text-sm font-medium">{calendarMonthTitle}</div>
                                  <div className="absolute top-0 flex w-full justify-between">
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
                                  {calendarDays.map((day, idx) => {
                                    const isCurrentMonth = isSameMonth(day, currentMonth);
                                    const isSelected = isSameDay(day, calendarDate);
                                    const isDisabled = isBefore(day, todayStart);
                                    const isToday = isSameDay(day, calendarToday);

                                    return (
                                      <div key={idx} className="group size-9 px-0 py-px text-sm">
                                        <button
                                          onClick={() => handleCalendarDateSelect(day)}
                                          disabled={isDisabled}
                                          className={cn(
                                            "relative flex size-9 items-center justify-center whitespace-nowrap rounded-md p-0 text-foreground transition-[color,background-color,border-radius,box-shadow] duration-150 focus-visible:z-10 outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                                            isDisabled && "pointer-events-none text-foreground/30 line-through",
                                            !isCurrentMonth && "text-foreground/30",
                                            isSelected && isCurrentMonth && "bg-primary text-primary-foreground",
                                            !isSelected && !isDisabled && isCurrentMonth && "hover:bg-accent",
                                            isToday && !isSelected && "after:pointer-events-none after:absolute after:bottom-1 after:start-1/2 after:z-10 after:size-[3px] after:-translate-x-1/2 after:rounded-full after:bg-primary after:transition-colors",
                                            isToday && isSelected && "after:pointer-events-none after:absolute after:bottom-1 after:start-1/2 after:z-10 after:size-[3px] after:-translate-x-1/2 after:rounded-full after:bg-background after:transition-colors"
                                          )}
                                          type="button"
                                        >
                                          {format(day, "d")}
                                        </button>
                                      </div>
                                    );
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
                                          onClick={() => setCalendarTime("Весь день")}
                                          className={cn(
                                            "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 h-8 rounded-md px-3 text-xs w-full",
                                            calendarTime === "Весь день"
                                              ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                                              : "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground"
                                          )}
                                          type="button"
                                        >
                                          Весь день
                                        </button>
                                      </div>
                                      <div className="grid gap-1.5 px-5 max-sm:grid-cols-2">
                                        {TIME_SLOTS.map(({ time: slotTime, available }) => (
                                          <button
                                            key={slotTime}
                                            onClick={() => available && setCalendarTime(slotTime)}
                                            disabled={!available}
                                            className={cn(
                                              "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 h-8 rounded-md px-3 text-xs w-full",
                                              calendarTime === slotTime
                                                ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                                                : "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground"
                                            )}
                                            type="button"
                                          >
                                            {slotTime}
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
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
                    <AccordionContent className="pb-2 text-muted-foreground overflow-visible">
                      <div className="space-y-4 pt-2 overflow-visible">
                        <p className="text-sm">
                          Настройте автоматические действия для задачи: уведомления, переходы между статусами, создание связанных задач и другие автоматические процессы.
                        </p>
                        <div className="flex flex-wrap gap-2 items-center relative">
                          {/* Дни недели */}
                          {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((day) => (
                            <button
                              key={day}
                              type="button"
                              onClick={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  automationDays: prev.automationDays.includes(day)
                                    ? prev.automationDays.filter((d) => d !== day)
                                    : [...prev.automationDays, day],
                                  automationEveryDay: false,
                                  automationByDay: false,
                                  automationSelectedDate: null,
                                }));
                                setShowAutomationCalendar(false);
                              }}
                              className={cn(
                                "px-3 py-1.5 text-sm rounded-md border transition-colors",
                                formData.automationDays.includes(day)
                                  ? "bg-primary text-primary-foreground border-primary"
                                  : "bg-background text-foreground border-border hover:bg-accent"
                              )}
                            >
                              {day}
                            </button>
                          ))}

                          {/* Каждый день */}
                          <button
                            type="button"
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                automationEveryDay: !prev.automationEveryDay,
                                automationDays: [],
                                automationByDay: false,
                                automationSelectedDate: null,
                              }));
                              setShowAutomationCalendar(false);
                            }}
                            className={cn(
                              "px-3 py-1.5 text-sm rounded-md border transition-colors",
                              formData.automationEveryDay
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-background text-foreground border-border hover:bg-accent"
                            )}
                          >
                            Каждый день
                          </button>

                          {/* Выбрать дату */}
                          <button
                            type="button"
                            onClick={() => {
                              const newAutomationByDay = !formData.automationByDay;
                              setFormData((prev) => ({
                                ...prev,
                                automationByDay: newAutomationByDay,
                                automationDays: [],
                                automationEveryDay: false,
                                automationSelectedDate: newAutomationByDay ? prev.automationSelectedDate : null,
                              }));
                              if (newAutomationByDay) {
                                setShowAutomationCalendar(true);
                              }
                            }}
                            className={cn(
                              "px-3 py-1.5 text-sm rounded-md border transition-colors",
                              formData.automationByDay
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-background text-foreground border-border hover:bg-accent"
                            )}
                          >
                            {formData.automationSelectedDate
                              ? format(formData.automationSelectedDate, "d MMMM", { locale: ru })
                              : "Выбрать д��ту"}
                          </button>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {/* Кнопка сохранения */}
                <div className="flex justify-end mt-8 pt-6 border-t">
                  <Button onClick={handleSubmit} variant="outline">
                    Создать задачу
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Диалог выбора даты для автоматизации */}
      <AlertDialog open={showAutomationCalendar} onOpenChange={setShowAutomationCalendar}>
        <AlertDialogContent className="max-w-[600px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Выберите дату</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="py-4">
            <div className="w-full">
              <div className="relative mx-10 mb-1 flex h-9 items-center justify-center">
                <div className="text-sm font-medium">{automationCalendarMonthTitle}</div>
                <div className="absolute top-0 flex w-full justify-between">
                  <button
                    onClick={previousAutomationMonth}
                    className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 size-9 p-0 text-muted-foreground/80 hover:text-foreground hover:bg-accent hover:text-accent-foreground"
                    type="button"
                  >
                    <ChevronLeftIcon size={16} aria-hidden="true" />
                  </button>
                  <button
                    onClick={nextAutomationMonth}
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
                {automationCalendarDays.map((day, idx) => {
                  const isCurrentMonth = isSameMonth(day, automationCurrentMonth);
                  const dayNumber = format(day, "d");
                  const isSelectedNumber = formData.automationDayNumber === dayNumber && isCurrentMonth;

                  return (
                    <div key={idx} className="group size-9 px-0 py-px text-sm">
                      <button
                        onClick={() => handleAutomationDateSelect(day)}
                        className={cn(
                          "relative flex size-9 items-center justify-center whitespace-nowrap rounded-md p-0 text-foreground transition-[color,background-color,border-radius,box-shadow] duration-150 focus-visible:z-10 outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                          !isCurrentMonth && "text-foreground/30",
                          isSelectedNumber && "bg-primary text-primary-foreground",
                          !isSelectedNumber && isCurrentMonth && "hover:bg-accent"
                        )}
                      >
                        {format(day, "d")}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}