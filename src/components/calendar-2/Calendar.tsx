"use client";

import { useState, type ReactNode } from "react";
import { addMonths, subMonths, format, startOfMonth, startOfWeek, addDays, isSameMonth, isSameDay, isToday } from "date-fns";
import { ru } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  description?: string;
}

export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const headerDate = format(currentMonth, "LLLL yyyy", { locale: ru });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const resetToday = () => setCurrentMonth(new Date());

  const startDate = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 });

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setIsOpen(true);
  };

  const handleCreateTaskForSelf = () => {
    window.location.href = '/task-myself';
    setIsOpen(false);
    setSelectedDate(null);
  };

  const handleCreateTask = () => {
    window.location.href = '/multi-step-form';
    setIsOpen(false);
    setSelectedDate(null);
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(events.filter((e) => e.id !== eventId));
  };

  const handleAddEventClick = () => {
    setSelectedDate(new Date());
    setIsOpen(true);
  };

  // Генерируем ровно 6 недель (42 дня) для календаря
  const days: ReactNode[] = [];
  let day = startDate;
  for (let weekIndex = 0; weekIndex < 6; weekIndex++) {
    const week: ReactNode[] = [];
    for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
      const clone = day;
      const formatted = format(day, "d");
      const inMonth = isSameMonth(day, currentMonth);
      const today = isToday(day);
      const dayEvents = events.filter((e) => isSameDay(e.date, day));

      week.push(
        <div
          key={day.toString()}
          onClick={() => handleDayClick(clone)}
          className={cn(
            "min-h-[120px] h-32 border-r border-b border-border text-right p-2 relative cursor-pointer transition-colors select-none",
            inMonth ? "bg-card text-foreground" : "bg-muted/10 text-muted-foreground",
            today && "ring-2 ring-primary/50 ring-inset bg-primary/5",
            "hover:bg-muted/30 active:bg-muted/50"
          )}
        >
          <span className={cn("text-sm font-medium", today && "text-primary font-bold")}>
            {formatted}
          </span>
          <div className="absolute left-1 top-7 right-1 flex flex-col gap-0.5 max-h-[96px] overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20">
            {dayEvents.slice(0, 4).map((event) => (
              <div
                key={event.id}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteEvent(event.id);
                }}
                className="bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded-sm truncate hover:bg-primary/90 cursor-pointer group relative"
                title={event.description || event.title}
              >
                {event.title}
              </div>
            ))}
            {dayEvents.length > 4 && (
              <div className="text-[10px] text-muted-foreground px-1 py-0.5">
                +{dayEvents.length - 4} ещё
              </div>
            )}
          </div>
        </div>
      );
      day = addDays(day, 1);
    }
    days.push(<div key={`week-${weekIndex}`} className="grid grid-cols-7">{week}</div>);
  }

  return (
    <div className="w-full space-y-4">
      {/* Заголовок с кнопками */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={resetToday}>
            Сегодня
          </Button>
          <Button variant="outline" size="sm" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <h2 className="text-xl font-semibold capitalize">{headerDate}</h2>
        <Button onClick={handleAddEventClick} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Добавить событие
        </Button>
      </div>

      {/* Календарная сетка с днями недели внутри */}
      <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
        {/* Дни недели */}
        <div className="grid grid-cols-7 text-center text-sm font-medium border-b border-border bg-muted/30">
          {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((day, i) => (
            <div key={i} className="text-muted-foreground font-semibold py-2 border-r border-border last:border-r-0">
              {day}
            </div>
          ))}
        </div>
        {/* Дни календаря */}
        <div>
          {days}
        </div>
      </div>

      {/* Модальное окно создания задачи */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>
              {selectedDate ? `Задача на ${format(selectedDate, "d MMMM yyyy", { locale: ru })}` : "Новая задача"}
            </DialogTitle>
          </DialogHeader>
          <div className="py-6">
            <div className="flex flex-col gap-3">
              <Button onClick={handleCreateTaskForSelf} className="w-full">
                Создать задачу себе
              </Button>
              <Button onClick={handleCreateTask} variant="outline" className="w-full">
                Создать задачу
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
