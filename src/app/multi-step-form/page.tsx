"use client";

import { useState, useRef, useEffect, useId } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import MetrikaSelect from "@/components/metrika/MetrikaSelect";
import Checklist from "@/components/metrika/Checklist";
import FileUploader from "@/components/metrika/FileUploader";
import InputList from "@/components/metrika/InputList";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import Header from "@/components/Header";
import BurgerMenu from "@/components/BurgerMenu";
import { ChevronDown, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
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

interface User {
  id: string;
  name: string;
  role: string;
}

const steps = [
  { number: 1, title: "Основная информация", subtitle: "Название и описание" },
  { number: 2, title: "Дополнительные параметры", subtitle: "Приоритет и сроки" },
  { number: 3, title: "Дополнительные настройки", subtitle: "Подзадачи и вложения" },
  { number: 4, title: "Итоги", subtitle: "Проверка данных" },
];

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
];


export default function MultiStepFormPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    executors: [] as string[],
    curators: [] as string[],
    priority: "low",
    isHiddenTask: false,
    deadline: "",
    deadlineTime: "",
    startDate: "",
    startTime: "",
    completionTime: "",
    isBlocking: false,
  });
  const [showExecutorsDropdown, setShowExecutorsDropdown] = useState(false);
  const [showCuratorsDropdown, setShowCuratorsDropdown] = useState(false);
  const [subtasks, setSubtasks] = useState<Array<{
    id: string;
    title: string;
    description: string;
    deadline: string;
    deadlineTime: string;
    completionTime: string;
  }>>([]);
  const executorsRef = useRef<HTMLDivElement>(null);
  const curatorsRef = useRef<HTMLDivElement>(null);
  const hiddenTaskId = useId();
  const blockingTaskId = useId();
  const priorityId = useId();
  const [showBlockingDialog, setShowBlockingDialog] = useState(false);
  const [blockingSwitchChecked, setBlockingSwitchChecked] = useState(formData.isBlocking);
  const calendarTodayRef = useRef<Date | null>(null);
  if (!calendarTodayRef.current) {
    calendarTodayRef.current = new Date();
  }
  const calendarToday = calendarTodayRef.current;
  const todayStart = startOfDay(calendarToday);
  const [calendarDate, setCalendarDate] = useState<Date>(calendarToday);
  const [calendarTime, setCalendarTime] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState<Date>(calendarToday);
  const [startCalendarDate, setStartCalendarDate] = useState<Date>(
    formData.startDate ? new Date(formData.startDate) : calendarToday
  );
  const [startCalendarTime, setStartCalendarTime] = useState<string | null>(
    formData.startTime ? formData.startTime : null
  );
  const [startCurrentMonth, setStartCurrentMonth] = useState<Date>(
    formData.startDate ? new Date(formData.startDate) : calendarToday
  );
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const weekdayStart = (getDay(monthStart) + 6) % 7;
  const weekdayEnd = (getDay(monthEnd) + 6) % 7;
  const calendarRangeStart = startOfDay(subDays(monthStart, weekdayStart));
  const calendarRangeEnd = addDays(monthEnd, 6 - weekdayEnd);
  const calendarDays = eachDayOfInterval({ start: calendarRangeStart, end: calendarRangeEnd });
  const calendarMonthRaw = format(currentMonth, "LLLL yyyy", { locale: ru });
  const calendarMonthTitle = calendarMonthRaw.charAt(0).toUpperCase() + calendarMonthRaw.slice(1);

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

  useEffect(() => {
    const formatted = format(calendarDate, "yyyy-MM-dd");
    setFormData((prev) => (prev.deadline === formatted ? prev : { ...prev, deadline: formatted }));
  }, [calendarDate, setFormData]);

  useEffect(() => {
    const nextTime = !calendarTime || calendarTime === "Весь день" ? "" : calendarTime;
    setFormData((prev) => (prev.deadlineTime === nextTime ? prev : { ...prev, deadlineTime: nextTime }));
  }, [calendarTime, setFormData]);

  const startMonthStart = startOfMonth(startCurrentMonth);
  const startMonthEnd = endOfMonth(startCurrentMonth);
  const startWeekdayStart = (getDay(startMonthStart) + 6) % 7;
  const startWeekdayEnd = (getDay(startMonthEnd) + 6) % 7;
  const startCalendarRangeStart = startOfDay(subDays(startMonthStart, startWeekdayStart));
  const startCalendarRangeEnd = addDays(startMonthEnd, 6 - startWeekdayEnd);
  const startCalendarDays = eachDayOfInterval({
    start: startCalendarRangeStart,
    end: startCalendarRangeEnd,
  });
  const startCalendarMonthRaw = format(startCurrentMonth, "LLLL yyyy", { locale: ru });
  const startCalendarMonthTitle =
    startCalendarMonthRaw.charAt(0).toUpperCase() + startCalendarMonthRaw.slice(1);

  const handleStartCalendarDateSelect = (day: Date) => {
    if (isBefore(day, todayStart)) return;
    setStartCalendarDate(day);
    setStartCalendarTime(null);
  };

  const previousStartMonth = () => {
    setStartCurrentMonth((prev) => subMonths(prev, 1));
  };

  const nextStartMonth = () => {
    setStartCurrentMonth((prev) => addMonths(prev, 1));
  };

  useEffect(() => {
    const formatted = format(startCalendarDate, "yyyy-MM-dd");
    setFormData((prev) => (prev.startDate === formatted ? prev : { ...prev, startDate: formatted }));
  }, [startCalendarDate, setFormData]);

  useEffect(() => {
    const nextTime = !startCalendarTime || startCalendarTime === "Весь день" ? "" : startCalendarTime;
    setFormData((prev) => (prev.startTime === nextTime ? prev : { ...prev, startTime: nextTime }));
  }, [startCalendarTime, setFormData]);

  // Закрытие dropdown при клике вне
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (executorsRef.current && !executorsRef.current.contains(event.target as Node)) {
        setShowExecutorsDropdown(false);
      }
      if (curatorsRef.current && !curatorsRef.current.contains(event.target as Node)) {
        setShowCuratorsDropdown(false);
      }
    };

    if (showExecutorsDropdown || showCuratorsDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [showExecutorsDropdown, showCuratorsDropdown]);

  useEffect(() => {
    setBlockingSwitchChecked(formData.isBlocking);
  }, [formData.isBlocking]);

  const nextStep = () => {
    // Валидация перед переходом на следующий шаг
    if (currentStep === 1) {
      if (!formData.title.trim()) {
        alert("Пожалуйста, укажите название задачи");
        return;
      }
      if (formData.executors.length === 0) {
        alert("Пожалуйста, выберите хо��я бы одного исполнителя");
        return;
      }
    }
    
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    alert("Форма отправлена успешно!");
  };

  const handleBlockingToggle = (checked: boolean) => {
    if (checked) {
      setBlockingSwitchChecked(true);
      setShowBlockingDialog(true);
      return;
    }
    setBlockingSwitchChecked(false);
    setFormData((prev) => ({ ...prev, isBlocking: false }));
  };

  const confirmBlockingToggle = () => {
    setFormData((prev) => ({ ...prev, isBlocking: true }));
    setShowBlockingDialog(false);
  };

  const cancelBlockingToggle = () => {
    setBlockingSwitchChecked(formData.isBlocking);
    setShowBlockingDialog(false);
  };

  const handleExecutorToggle = (userId: string) => {
    setFormData((prev) => ({
      ...prev,
      executors: prev.executors.includes(userId)
        ? prev.executors.filter((id) => id !== userId)
        : [...prev.executors, userId],
    }));
  };

  const handleCuratorToggle = (userId: string) => {
    setFormData((prev) => ({
      ...prev,
      curators: prev.curators.includes(userId)
        ? prev.curators.filter((id) => id !== userId)
        : [...prev.curators, userId],
    }));
  };

  // Фильтр пользователей для исполнителей (только определенные роли)
  const executorUsers = users.filter((user) =>
    ["admin", "manager", "employee", "freelancer"].includes(user.role)
  );

  // Получение имен выбранных пользователей
  const getSelectedUserNames = (userIds: string[]) => {
    return userIds
      .map((id) => users.find((u) => u.id === id)?.name)
      .filter(Boolean)
      .join(", ");
  };

  // Получение названия приоритета
  const getPriorityLabel = (priority: string) => {
    const labels: Record<string, string> = {
      low: "🟢 Обычная",
      medium: "🟠 Важная",
      high: "🔴 Срочная",
      boss: "🟡 Задача от руководителя",
    };
    return labels[priority] || priority;
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <Header />
      <BurgerMenu />
      <main className="pt-32 px-4 pb-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-[274px_1fr] gap-6 p-4">
            {/* Левая боковая панель с шагами */}
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
                        <span className="text-sm font-semibold text-foreground">
                          {step.title}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Мобильная версия шагов */}
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

            {/* Основной контент формы */}
            <Card className="bg-card shadow-lg border-0">
              <CardContent className="p-8">
                {/* Шаг 1: Основная информация */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <h1 className="text-3xl font-bold mb-2">Основная информация</h1>
                      <p className="text-muted-foreground">
                        Укажите название задачи, описание и выберите исполнителей и кураторов.
                      </p>
                    </div>
                    <div className="space-y-6">
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

                      {/* Исполнители и Кураторы */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Исполнители */}
                        <div className="space-y-2" ref={executorsRef}>
                          <Label htmlFor="executors">
                            Испол��ители <span className="text-destructive">*</span>
                          </Label>
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => setShowExecutorsDropdown(!showExecutorsDropdown)}
                              className={cn(
                                "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-left bg-background flex items-center justify-between",
                                formData.executors.length === 0 && "border-destructive"
                              )}
                            >
                              <span className="text-sm">
                                {formData.executors.length > 0
                                  ? `${formData.executors.length} выбрано`
                                  : "Выберите исполнителей"}
                              </span>
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            </button>
                            {showExecutorsDropdown && (
                              <div className="absolute z-[100] w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-auto">
                                <div className="p-2">
                                  {executorUsers.map((user) => {
                                    const isSelected = formData.executors.includes(user.id);
                                    return (
                                      <label
                                        key={user.id}
                                        className="flex items-center px-3 py-2 hover:bg-accent hover:text-accent-foreground cursor-pointer rounded-sm"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <Checkbox
                                          checked={isSelected}
                                          onCheckedChange={() => handleExecutorToggle(user.id)}
                                          className="mr-2"
                                        />
                                        <span className="text-sm flex-1">
                                          {user.name} ({user.role})
                                        </span>
                                      </label>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Кураторы */}
                        <div className="space-y-2" ref={curatorsRef}>
                          <Label htmlFor="curators">Кураторы</Label>
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => setShowCuratorsDropdown(!showCuratorsDropdown)}
                              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-left bg-background flex items-center justify-between"
                            >
                              <span className="text-sm">
                                {formData.curators.length > 0
                                  ? `${formData.curators.length} выбрано`
                                  : "Выберите кураторов"}
                              </span>
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            </button>
                            {showCuratorsDropdown && (
                              <div className="absolute z-[100] w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-auto">
                                <div className="p-2">
                                  {users.map((user) => {
                                    const isSelected = formData.curators.includes(user.id);
                                    return (
                                      <label
                                        key={user.id}
                                        className="flex items-center px-3 py-2 hover:bg-accent hover:text-accent-foreground cursor-pointer rounded-sm"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <Checkbox
                                          checked={isSelected}
                                          onCheckedChange={() => handleCuratorToggle(user.id)}
                                          className="mr-2"
                                        />
                                        <span className="text-sm flex-1">
                                          {user.name} ({user.role})
                                        </span>
                                      </label>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Шаг 2: Дополнительные параметры */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h1 className="text-3xl font-bold mb-2">Дополнительные параметры</h1>
                      <p className="text-muted-foreground">
                        Укажите приоритет, сроки выполнения и другие параметры задачи.
                      </p>
                    </div>
                    <div className="space-y-6">
                      {/* Приоритет и Скрытая задача */}
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between md:gap-[64px] gap-4 pr-0.5">
                        {/* Приоритет */}
                        <MetrikaSelect
                          label="Приоритет"
                          id={priorityId}
                          value={formData.priority}
                          onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                          className="w-auto max-w-max"
                        >
                          <option value="low">🟢 Обычная</option>
                          <option value="medium">🟠 Важная</option>
                          <option value="high">🔴 Срочная</option>
                          <option value="boss">🟡 Задача от руководителя</option>
                        </MetrikaSelect>

                        {/* Скрытая задача */}
                        <div className="w-auto max-w-max space-y-2 ml-0.5 w-[150px]">
                          <div className="flex flex-col-reverse items-start gap-2">
                            <div className="relative inline-grid h-9 w-[110px] grid-cols-[1fr_1fr] items-center text-sm font-medium">
                              <Switch
                                id={hiddenTaskId}
                                checked={formData.isHiddenTask}
                                onCheckedChange={(checked) => setFormData({ ...formData, isHiddenTask: checked })}
                                className="peer absolute inset-0 h-[inherit] w-[110px] rounded-md data-[state=unchecked]:bg-input/50 [&_span]:z-10 [&_span]:h-full [&_span]:w-1/2 [&_span]:rounded-sm [&_span]:transition-transform [&_span]:duration-300 [&_span]:ease-[cubic-bezier(0.16,1,0.3,1)] [&_span]:data-[state=checked]:translate-x-full [&_span]:data-[state=checked]:rtl:-translate-x-full"
                              />
                              <span className="pointer-events-none relative ml-0.5 flex items-center justify-center px-2 text-center transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] peer-data-[state=checked]:invisible peer-data-[state=unchecked]:translate-x-full peer-data-[state=unchecked]:rtl:-translate-x-full">
                                <span className="text-[10px] font-medium uppercase text-foreground">Выкл</span>
                              </span>
                              <span className="pointer-events-none relative mr-0.5 flex items-center justify-center px-2 text-center transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] peer-data-[state=checked]:-translate-x-full peer-data-[state=unchecked]:invisible peer-data-[state=checked]:rtl:translate-x-full">
                                <span className="text-[10px] font-medium uppercase text-foreground">Вкл</span>
                              </span>
                            </div>
                            <Label htmlFor={hiddenTaskId} className="text-sm text-muted-foreground whitespace-nowrap">
                              Скрытая задача
                            </Label>
                          </div>
                        </div>

                        {/* Блокирующая задача */}
                        <div className="w-auto max-w-max space-y-2 ml-0.5 w-[150px]">
                          <div className="flex flex-col-reverse items-start gap-2">
                            <div className="relative inline-grid h-9 w-[110px] grid-cols-[1fr_1fr] items-center text-sm font-medium">
                              <Switch
                                id={blockingTaskId}
                                checked={blockingSwitchChecked}
                                onCheckedChange={(checked) => handleBlockingToggle(!!checked)}
                                className="peer absolute inset-0 h-[inherit] w-[110px] rounded-md data-[state=unchecked]:bg-input/50 [&_span]:z-10 [&_span]:h-full [&_span]:w-1/2 [&_span]:rounded-sm [&_span]:transition-transform [&_span]:duration-300 [&_span]:ease-[cubic-bezier(0.16,1,0.3,1)] [&_span]:data-[state=checked]:translate-x-full [&_span]:data-[state=checked]:rtl:-translate-x-full"
                              />
                              <span className="pointer-events-none relative ml-0.5 flex items-center justify-center px-2 text-center transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] peer-data-[state=checked]:invisible peer-data-[state=unchecked]:translate-x-full peer-data-[state=unchecked]:rtl:-translate-x-full">
                                <span className="text-[10px] font-medium uppercase text-foreground">Выкл</span>
                              </span>
                              <span className="pointer-events-none relative mr-0.5 flex items-center justify-center px-2 text-center transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] peer-data-[state=checked]:-translate-x-full peer-data-[state=unchecked]:invisible peer-data-[state=checked]:rtl:translate-x-full">
                                <span className="text-[10px] font-medium uppercase text-foreground">Вкл</span>
                              </span>
                            </div>
                            <Label htmlFor={blockingTaskId} className="text-sm text-muted-foreground whitespace-nowrap">
                              Блокирующая задача
                            </Label>
                          </div>
                          {blockingSwitchChecked && (
                            <div className="space-y-3 pt-2">
                              <p className="text-sm text-muted-foreground">
                                Внимание. Постановка других задач для этого исполнителя блокируется, до момента закрытия этой задачи. Пока эта задача не будет завершена, этому исполнителю нельзя поставить другие задачи.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Accordion для дат и времени */}
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
                                                className={`
                                                  inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap
                                                  transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px]
                                                  focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50
                                                  h-8 rounded-md px-3 text-xs w-full
                                                  ${
                                                    calendarTime === "Весь день"
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
                                              {TIME_SLOTS.map(({ time: slotTime, available }) => (
                                                <button
                                                  key={slotTime}
                                                  onClick={() => available && setCalendarTime(slotTime)}
                                                  disabled={!available}
                                                  className={`
                                                    inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap
                                                    transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px]
                                                    focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50
                                                    h-8 rounded-md px-3 text-xs w-full
                                                    ${
                                                      calendarTime === slotTime
                                                        ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                                                        : "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground"
                                                    }
                                                  `}
                                                  type="button"
                                                >
                                                  {slotTime}
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
                          </AccordionContent>
                        </AccordionItem>

                        {/* Начало выполнения */}
                        <AccordionItem value="startDate" className="border-border">
                          <AccordionTrigger className="py-2 text-[15px] leading-6 hover:no-underline">
                            Начало выполнения
                          </AccordionTrigger>
                          <AccordionContent className="pb-[17px]">
                            <div className="w-full overflow-x-auto">
                              <div className="inline-flex flex-col rounded-md border bg-background shadow-sm md:flex-row">
                                <div className="border-border p-2 md:border-r w-[450px]">
                                  <div className="relative flex flex-col gap-4">
                                    <div className="w-full">
                                      <div className="relative mx-10 mb-1 flex h-9 items-center justify-center">
                                        <div className="text-sm font-medium">{startCalendarMonthTitle}</div>
                                        <div className="absolute top-0 flex w-full justify-between">
                                          <button
                                            onClick={previousStartMonth}
                                            className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 size-9 p-0 text-muted-foreground/80 hover:text-foreground hover:bg-accent hover:text-accent-foreground"
                                            type="button"
                                          >
                                            <ChevronLeftIcon size={16} aria-hidden="true" />
                                          </button>
                                          <button
                                            onClick={nextStartMonth}
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
                                          const isCurrentMonth = isSameMonth(day, startCurrentMonth);
                                          const isSelected = isSameDay(day, startCalendarDate);
                                          const isDisabled = isBefore(day, todayStart);
                                          const isToday = isSameDay(day, calendarToday);

                                          return (
                                            <div key={idx} className="group size-9 px-0 py-px text-sm">
                                              <button
                                                onClick={() => handleStartCalendarDateSelect(day)}
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
                                              {TIME_SLOTS.map(({ time: slotTime, available }) => (
                                                <button
                                                  key={slotTime}
                                                  onClick={() => available && setStartCalendarTime(slotTime)}
                                                  disabled={!available}
                                                  className={`
                                                    inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap
                                                    transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px]
                                                    focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50
                                                    h-8 rounded-md px-3 text-xs w-full
                                                    ${
                                                      startCalendarTime === slotTime
                                                        ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                                                        : "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground"
                                                    }
                                                  `}
                                                  type="button"
                                                >
                                                  {slotTime}
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
                          </AccordionContent>
                        </AccordionItem>

                        {/* Время на выполнение */}
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
                                    onClick={() => setFormData({ ...formData, completionTime: `${hours}:00` })}
                                    className={cn(
                                      formData.completionTime === `${hours}:00` && "bg-primary text-primary-foreground"
                                    )}
                                  >
                                    {hours} {hours === 1 ? "час" : hours < 5 ? "часа" : "часов"}
                                  </Button>
                                ))}
                              </div>
                              <div>
                                <Label htmlFor="completion-time-input">Или укажите время вручную (ЧЧ:ММ)</Label>
                                <Input
                                  id="completion-time-input"
                                  type="text"
                                  placeholder="ЧЧ:ММ"
                                  value={formData.completionTime}
                                  onChange={(e) => setFormData({ ...formData, completionTime: e.target.value })}
                                />
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>

                    </div>
                  </div>
                )}

                {/* Шаг 3: Дополнительные настройки */}
                {currentStep === 3 && (
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
                              {/* Назв��ние задачи */}
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
                                    const newSubtasks = [...subtasks];
                                    if (newSubtasks.length === 0) {
                                      newSubtasks.push({
                                        id: Date.now().toString(),
                                        title: "",
                                        description: "",
                                        deadline: "",
                                        deadlineTime: "",
                                        completionTime: "",
                                      });
                                    }
                                    newSubtasks[0].title = e.target.value;
                                    setSubtasks(newSubtasks);
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
                                    const newSubtasks = [...subtasks];
                                    if (newSubtasks.length === 0) {
                                      newSubtasks.push({
                                        id: Date.now().toString(),
                                        title: "",
                                        description: "",
                                        deadline: "",
                                        deadlineTime: "",
                                        completionTime: "",
                                      });
                                    }
                                    newSubtasks[0].description = e.target.value;
                                    setSubtasks(newSubtasks);
                                  }}
                                />
                              </div>

                              {/* Срок выполнения */}
                              <div className="space-y-2">
                                <Label htmlFor="subtask-deadline" className="text-sm font-medium">
                                  Срок выполнения
                                </Label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  <Input
                                    id="subtask-deadline"
                                    type="date"
                                    value={subtasks[0]?.deadline || ""}
                                    onChange={(e) => {
                                      const newSubtasks = [...subtasks];
                                      if (newSubtasks.length === 0) {
                                      newSubtasks.push({
                                        id: Date.now().toString(),
                                        title: "",
                                        description: "",
                                        deadline: "",
                                        deadlineTime: "",
                                        completionTime: "",
                                      });
                                    }
                                    newSubtasks[0].deadline = e.target.value;
                                    setSubtasks(newSubtasks);
                                    }}
                                  />
                                  <Input
                                    id="subtask-deadline-time"
                                    type="time"
                                    value={subtasks[0]?.deadlineTime || ""}
                                    onChange={(e) => {
                                      const newSubtasks = [...subtasks];
                                      if (newSubtasks.length === 0) {
                                      newSubtasks.push({
                                        id: Date.now().toString(),
                                        title: "",
                                        description: "",
                                        deadline: "",
                                        deadlineTime: "",
                                        completionTime: "",
                                      });
                                    }
                                    newSubtasks[0].deadlineTime = e.target.value;
                                    setSubtasks(newSubtasks);
                                    }}
                                  />
                                </div>
                              </div>

                              {/* Время на выполнение */}
                              <div className="space-y-2">
                                <Label htmlFor="subtask-completion-time" className="text-sm font-medium">
                                  Время на выполнение
                                </Label>
                                <Input
                                  id="subtask-completion-time"
                                  type="text"
                                  placeholder="��Ч:ММ или количество часов"
                                  value={subtasks[0]?.completionTime || ""}
                                  onChange={(e) => {
                                    const newSubtasks = [...subtasks];
                                    if (newSubtasks.length === 0) {
                                      newSubtasks.push({
                                        id: Date.now().toString(),
                                        title: "",
                                        description: "",
                                        deadline: "",
                                        deadlineTime: "",
                                        completionTime: "",
                                      });
                                    }
                                    newSubtasks[0].completionTime = e.target.value;
                                    setSubtasks(newSubtasks);
                                  }}
                                />
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

                        {/* Автоматиза��ия */}
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
                )}

                {/* Шаг 4: Итоги */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div>
                      <h1 className="text-3xl font-bold mb-2">Итоги</h1>
                      <p className="text-muted-foreground">
                        Дважды проверьте, всё ли в порядке, прежде чем подтвердить.
                      </p>
                    </div>
                    <div className="bg-muted rounded-lg p-6 space-y-4">
                      {/* Основная информация */}
                      <div className="space-y-3 pb-4 border-b">
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">Название задачи</div>
                          <div className="font-semibold">{formData.title || "��е указано"}</div>
                          <button
                            onClick={() => setCurrentStep(1)}
                            className="text-sm text-muted-foreground hover:text-primary underline mt-1"
                          >
                            Изменить
                          </button>
                        </div>
                        {formData.description && (
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">Описание</div>
                            <div className="text-sm">{formData.description}</div>
                          </div>
                        )}
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">Исполнители</div>
                          <div className="text-sm font-medium">
                            {formData.executors.length > 0
                              ? getSelectedUserNames(formData.executors)
                              : "Не выбрано"}
                          </div>
                        </div>
                        {formData.curators.length > 0 && (
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">Кураторы</div>
                            <div className="text-sm font-medium">
                              {getSelectedUserNames(formData.curators)}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Дополнительные параметры */}
                      <div className="space-y-3 pb-4 border-b">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">Приоритет</div>
                            <div className="font-semibold">{getPriorityLabel(formData.priority)}</div>
                          </div>
                          <button
                            onClick={() => setCurrentStep(2)}
                            className="text-sm text-muted-foreground hover:text-primary underline"
                          >
                            Изменить
                          </button>
                        </div>
                        {formData.isHiddenTask && (
                          <div className="text-sm text-destructive font-medium">
                            ⚠️ Скрытая задача
                          </div>
                        )}
                        {formData.deadline && (
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">Срок выполнения</div>
                            <div className="text-sm">
                              {new Date(formData.deadline).toLocaleDateString("ru-RU")}
                              {formData.deadlineTime && ` в ${formData.deadlineTime}`}
                            </div>
                          </div>
                        )}
                        {formData.startDate && (
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">Начало выполнения</div>
                            <div className="text-sm">
                              {new Date(formData.startDate).toLocaleDateString("ru-RU")}
                              {formData.startTime && ` в ${formData.startTime}`}
                            </div>
                          </div>
                        )}
                        {formData.completionTime && (
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">Время на выполнение</div>
                            <div className="text-sm font-medium">{formData.completionTime}</div>
                          </div>
                        )}
                        {formData.isBlocking && (
                          <div className="text-sm text-destructive font-medium">
                            🔒 Блокирующая задача
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Кнопки навигации */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t">
                  {currentStep > 1 ? (
                    <Button variant="ghost" onClick={prevStep}>
                      Назад
                    </Button>
                  ) : (
                    <div />
                  )}
                  {currentStep < 4 ? (
                    <Button onClick={nextStep}>Далее</Button>
                  ) : (
                    <Button onClick={handleSubmit}>Подтвердить</Button>
                  )}
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
              Вы уверены, что хотите сделать задачу блокирующей? Пока она не будет завершена, исполнителю нельзя поставить другие задачи.
            </AlertDialogDescription>
          </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={cancelBlockingToggle}>Отмена</AlertDialogCancel>
          <AlertDialogAction onClick={confirmBlockingToggle}>Подтвердить</AlertDialogAction>
        </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
