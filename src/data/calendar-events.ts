import { CalendarEvent } from "@/components/event-calendar/types"

// Расширяем CalendarEvent для хранения дополнительных полей
export interface ExtendedCalendarEvent extends CalendarEvent {
  visibility: "private" | "public"
  createdBy: string // ID пользователя
  createdAt: Date
}

// Импортируем функцию для форматирования
const addDays = (date: Date, days: number) => new Date(date.getTime() + days * 24 * 60 * 60 * 1000)
const setHours = (date: Date, hours: number) => {
  const newDate = new Date(date)
  newDate.setHours(hours)
  return newDate
}
const setMinutes = (date: Date, minutes: number) => {
  const newDate = new Date(date)
  newDate.setMinutes(minutes)
  return newDate
}

// Примеры событий
export const calendarEvents: ExtendedCalendarEvent[] = [
  {
    id: "1",
    title: "Встреча команды",
    description: "Еженедельный синхронизация",
    start: setMinutes(setHours(new Date(), 10), 0),
    end: setMinutes(setHours(new Date(), 11), 0),
    color: "sky",
    location: "Переговорная 1",
    visibility: "public",
    createdBy: "1",
    createdAt: new Date(),
  },
  {
    id: "2",
    title: "Презентация клиенту",
    description: "Обсуждение проекта",
    start: setMinutes(setHours(addDays(new Date(), 1), 14), 0),
    end: setMinutes(setHours(addDays(new Date(), 1), 15), 30),
    color: "amber",
    location: "Переговорная 2",
    visibility: "public",
    createdBy: "1",
    createdAt: new Date(),
  },
]

