"use client";

import React, { useState } from "react";
import { Calendar as LucideCalendar } from "lucide-react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import type { EventClickArg } from "@fullcalendar/core";
import { EventInput } from "@fullcalendar/core";
import EventModal from "./EventModal";

const initialEvents: EventInput[] = [
  {
    id: "1",
    title: "Team Meeting",
    start: "2025-01-15T10:00:00",
    extendedProps: {
      description: "Weekly team sync and project updates",
      location: "Conference Room A",
      attendees: ["John Doe", "Jane Smith", "Bob Wilson"]
    }
  },
  {
    id: "2",
    title: "Client Presentation",
    start: "2025-01-15T14:00:00",
    extendedProps: {
      description: "Present Q4 results to stakeholders",
      location: "Board Room",
      attendees: ["Sarah Johnson", "Mike Chen"]
    }
  },
  {
    id: "3",
    title: "Code Review",
    start: "2025-01-20T11:00:00",
    extendedProps: {
      description: "Review latest feature implementation",
      location: "Dev Room",
      attendees: ["Alice Brown", "Tom Davis"]
    }
  },
  {
    id: "4",
    title: "Product Launch",
    start: "2025-01-25T09:00:00",
    extendedProps: {
      description: "Launch new product feature",
      location: "Main Auditorium",
      attendees: ["Marketing Team", "Dev Team", "Sales Team"]
    }
  }
];

const EventManagerCalendar: React.FC = () => {
  const [events, setEvents] = useState<EventInput[]>(initialEvents);
  const [selectedEvent, setSelectedEvent] = useState<EventInput | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | undefined>(undefined);
  const [eventsForDate, setEventsForDate] = useState<EventInput[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleEventClick = (clickInfo: EventClickArg) => {
    const { event } = clickInfo;
    setSelectedEvent({
      id: event.id,
      title: event.title,
      start: event.startStr,
      extendedProps: event.extendedProps
    });

    setSelectedDate(event.startStr.split("T")[0]); // extract date part only
    const matchingEvents = events.filter(ev =>
      ev.start?.toString().startsWith(event.startStr.split("T")[0])
    );
    setEventsForDate(matchingEvents);
    setIsModalOpen(true);
  };

  const handleDateClick = (arg: DateClickArg) => {
    const clickedDate = arg.dateStr;
    setSelectedEvent(null);
    setSelectedDate(clickedDate);

    const matchingEvents = events.filter(event =>
      event.start?.toString().startsWith(clickedDate)
    );
    setEventsForDate(matchingEvents);
    setIsModalOpen(true);
  };

  const handleAddEvent = (newEvent: EventInput) => {
    setEvents((prev) => [...prev, newEvent]);

    // Update eventsForDate if it matches the selectedDate
    if (newEvent.start?.toString().startsWith(selectedDate || "")) {
      setEventsForDate((prev) => [...prev, newEvent]);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <LucideCalendar className="w-6 h-6 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-800">Event Manager</h1>
      </div>

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        eventClick={handleEventClick}
        dateClick={handleDateClick}
        height="auto"
        headerToolbar={{ start: "prev,next today", center: "title", end: "" }}
      />

      {isModalOpen && (
        <EventModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          event={selectedEvent || undefined}
          selectedDate={selectedDate}
          eventsForDate={eventsForDate}
          onAddEvent={handleAddEvent}
        />
      )}
    </div>
  );
};

export default EventManagerCalendar;
