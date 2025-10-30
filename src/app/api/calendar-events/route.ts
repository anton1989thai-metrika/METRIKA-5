import { NextRequest, NextResponse } from 'next/server'
import { calendarEvents, ExtendedCalendarEvent } from '@/data/calendar-events'

// GET - получить события (с фильтрацией по пользователю и роли)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    const userRole = searchParams.get('userRole')

    // Базовый запрос всех событий
    let filteredEvents = [...calendarEvents]

    // Если это не админ, фильтруем события
    if (userRole !== 'admin') {
      if (userId) {
        filteredEvents = calendarEvents.filter(event => 
          event.visibility === 'public' || 
          (event.visibility === 'private' && event.createdBy === userId)
        )
      } else {
        // Если userId не указан, показываем только публичные
        filteredEvents = calendarEvents.filter(event => event.visibility === 'public')
      }
    }
    // Если админ - видит всё

    return NextResponse.json(filteredEvents, { status: 200 })
  } catch (error) {
    console.error('API Error fetching calendar events:', error)
    return NextResponse.json({ 
      message: 'Failed to fetch calendar events.', 
      error: (error as Error).message 
    }, { status: 500 })
  }
}

// POST - создать новое событие
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const newEvent: ExtendedCalendarEvent = body

    if (!newEvent.title || !newEvent.start || !newEvent.end) {
      return NextResponse.json({ 
        message: 'Invalid data format.' 
      }, { status: 400 })
    }

    // В реальном приложении здесь была бы логика сохранения в базу данных
    console.log('Calendar event created:', newEvent.title)

    return NextResponse.json({ 
      message: 'Calendar event created successfully.',
      event: newEvent
    }, { status: 201 })
  } catch (error) {
    console.error('API Error creating calendar event:', error)
    return NextResponse.json({ 
      message: 'Failed to create calendar event.', 
      error: (error as Error).message 
    }, { status: 500 })
  }
}

// PUT - обновить событие
export async function PUT(request: NextRequest) {
  try {
    const event: ExtendedCalendarEvent = await request.json()

    // В реальном приложении здесь была бы логика обновления в базу данных
    console.log('Calendar event updated:', event.title)

    return NextResponse.json({ 
      message: 'Calendar event updated successfully.',
      event
    }, { status: 200 })
  } catch (error) {
    console.error('API Error updating calendar event:', error)
    return NextResponse.json({ 
      message: 'Failed to update calendar event.', 
      error: (error as Error).message 
    }, { status: 500 })
  }
}

// DELETE - удалить событие
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const eventId = searchParams.get('id')

    if (!eventId) {
      return NextResponse.json({ 
        message: 'Event ID is required.' 
      }, { status: 400 })
    }

    // В реальном приложении здесь была бы логика удаления из базы данных
    console.log('Calendar event deleted:', eventId)

    return NextResponse.json({ 
      message: 'Calendar event deleted successfully.'
    }, { status: 200 })
  } catch (error) {
    console.error('API Error deleting calendar event:', error)
    return NextResponse.json({ 
      message: 'Failed to delete calendar event.', 
      error: (error as Error).message 
    }, { status: 500 })
  }
}

