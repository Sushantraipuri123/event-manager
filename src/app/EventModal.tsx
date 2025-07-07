import React, { useState } from "react";
import { X, Clock, MapPin, User, Plus } from "lucide-react";
import { EventInput } from "@fullcalendar/core";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event?: EventInput;
  selectedDate?: string;
  onAddEvent?: (newEvent: EventInput) => void;
  eventsForDate?: EventInput[];
}

const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  event,
  selectedDate,
  onAddEvent,
  eventsForDate = []
}) => {
  const [activeTab, setActiveTab] = useState("details");

  const [form, setForm] = useState({
    title: "",
    description: "",
    time: "",
    location: "",
    attendees: ""
  });

  const handleSubmit = () => {
    if (!form.title || !selectedDate) return;

    const newEvent: EventInput = {
      id: Date.now().toString(),
      title: form.title,
      start: `${selectedDate}T${form.time}`,
      extendedProps: {
        description: form.description,
        location: form.location,
        attendees: form.attendees.split(",").map(a => a.trim())
      }
    };

    onAddEvent?.(newEvent);

    // Reset form and switch tab
    setForm({ title: "", description: "", time: "", location: "", attendees: "" });
    setActiveTab("details");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {event ? event.title : `Events for ${selectedDate}`}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex gap-4 border-b mb-4">
          <button
            className={`pb-2 ${activeTab === "details" ? "border-b-2 border-blue-600 font-semibold" : "text-gray-600"}`}
            onClick={() => setActiveTab("details")}
          >
            Previous Events
          </button>
          <button
            className={`pb-2 ${activeTab === "form" ? "border-b-2 border-blue-600 font-semibold" : "text-gray-600"}`}
            onClick={() => setActiveTab("form")}
          >
            Add Event
          </button>
        </div>

        {activeTab === "details" ? (
          eventsForDate.length > 0 ? (
            <div className="space-y-4">
              {eventsForDate.map((ev) => (
                <div key={ev.id} className="border p-4 rounded">
                  <h3 className="font-semibold text-lg">{ev.title}</h3>
                  <p className="text-gray-600">{ev.extendedProps?.description}</p>
                  <div className="mt-2 flex flex-col gap-1 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />{" "}
                      {new Date(ev.start as string).toLocaleTimeString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" /> {ev.extendedProps?.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />{" "}
                      {(ev.extendedProps?.attendees || []).join(", ")}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No events for this date.</p>
          )
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title *</label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full p-2 border rounded"
                placeholder="Event Title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full p-2 border rounded"
                placeholder="Event Description"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Time (HH:MM)</label>
              <input
                type="time"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full p-2 border rounded"
                placeholder="Event Location"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Attendees (comma-separated)</label>
              <input
                value={form.attendees}
                onChange={(e) => setForm({ ...form, attendees: e.target.value })}
                className="w-full p-2 border rounded"
                placeholder="John, Jane, Bob"
              />
            </div>
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Save Event
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventModal;
