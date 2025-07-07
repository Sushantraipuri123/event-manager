import React, { useState, useEffect } from 'react';
import { Calendar, X, Plus, Edit2, Trash2, Clock, MapPin, User } from 'lucide-react';

// Fake JSON data for events
const initialEvents = [
  {
    id: 1,
    date: '2025-01-15',
    title: 'Team Meeting',
    description: 'Weekly team sync and project updates',
    time: '10:00 AM',
    location: 'Conference Room A',
    attendees: ['John Doe', 'Jane Smith', 'Bob Wilson']
  },
  {
    id: 2,
    date: '2025-01-15',
    title: 'Client Presentation',
    description: 'Present Q4 results to stakeholders',
    time: '2:00 PM',
    location: 'Board Room',
    attendees: ['Sarah Johnson', 'Mike Chen']
  },
  {
    id: 3,
    date: '2025-01-20',
    title: 'Code Review',
    description: 'Review latest feature implementation',
    time: '11:00 AM',
    location: 'Dev Room',
    attendees: ['Alice Brown', 'Tom Davis']
  },
  {
    id: 4,
    date: '2025-01-25',
    title: 'Product Launch',
    description: 'Launch new product feature',
    time: '9:00 AM',
    location: 'Main Auditorium',
    attendees: ['Marketing Team', 'Dev Team', 'Sales Team']
  }
];

const EventManagerCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [events, setEvents] = useState(initialEvents);
  const [selectedDateEvents, setSelectedDateEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    time: '',
    location: '',
    attendees: ''
  });
  const [editingEvent, setEditingEvent] = useState(null);

  // Format date to YYYY-MM-DD for comparison
  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  // Get events for a specific date
  const getEventsForDate = (date) => {
    const dateStr = formatDate(date);
    return events.filter(event => event.date === dateStr);
  };

  // Handle date click
  const handleDateClick = (date) => {
    setSelectedDate(date);
    const dateEvents = getEventsForDate(date);
    setSelectedDateEvents(dateEvents);
    setIsModalOpen(true);
    setEditingEvent(null);
    setNewEvent({
      title: '',
      description: '',
      time: '',
      location: '',
      attendees: ''
    });
  };

  // Handle save event
  const handleSaveEvent = () => {
    if (!newEvent.title.trim()) return;

    const eventData = {
      id: editingEvent ? editingEvent.id : Date.now(),
      date: formatDate(selectedDate),
      title: newEvent.title,
      description: newEvent.description,
      time: newEvent.time,
      location: newEvent.location,
      attendees: newEvent.attendees.split(',').map(a => a.trim()).filter(a => a)
    };

    if (editingEvent) {
      setEvents(events.map(event => 
        event.id === editingEvent.id ? eventData : event
      ));
    } else {
      setEvents([...events, eventData]);
    }

    setSelectedDateEvents(getEventsForDate(selectedDate));
    setNewEvent({
      title: '',
      description: '',
      time: '',
      location: '',
      attendees: ''
    });
    setEditingEvent(null);
  };

  // Handle edit event
  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setNewEvent({
      title: event.title,
      description: event.description,
      time: event.time,
      location: event.location,
      attendees: event.attendees.join(', ')
    });
  };

  // Handle delete event
  const handleDeleteEvent = (eventId) => {
    setEvents(events.filter(event => event.id !== eventId));
    setSelectedDateEvents(selectedDateEvents.filter(event => event.id !== eventId));
  };

  // Check if date has events
  const dateHasEvents = (date) => {
    return getEventsForDate(date).length > 0;
  };

  // Custom calendar component
  const CustomCalendar = () => {
    const today = new Date();
    const [currentDate, setCurrentDate] = useState(today);
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const firstDayWeekday = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const goToPrevMonth = () => {
      setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
    };

    const goToNextMonth = () => {
      setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
    };

    const renderCalendarDays = () => {
      const days = [];
      
      // Empty cells for days before month starts
      for (let i = 0; i < firstDayWeekday; i++) {
        days.push(<div key={`empty-${i}`} className="h-12"></div>);
      }

      // Days of the month
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentYear, currentMonth, day);
        const hasEvents = dateHasEvents(date);
        const isToday = date.toDateString() === today.toDateString();
        
        days.push(
          <div
            key={day}
            onClick={() => handleDateClick(date)}
            className={`
              h-12 flex items-center justify-center cursor-pointer rounded-lg relative
              hover:bg-blue-50 transition-colors
              ${isToday ? 'bg-blue-100 text-blue-600 font-semibold' : ''}
              ${hasEvents ? 'bg-green-50 text-green-700' : ''}
            `}
          >
            <span className="text-sm">{day}</span>
            {hasEvents && (
              <div className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></div>
            )}
          </div>
        );
      }

      return days;
    };

    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            {monthNames[currentMonth]} {currentYear}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={goToPrevMonth}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              ←
            </button>
            <button
              onClick={goToNextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map(day => (
            <div key={day} className="h-8 flex items-center justify-center text-sm font-medium text-gray-600">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {renderCalendarDays()}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="w-6 h-6 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-800">Event Manager</h1>
      </div>

      <CustomCalendar />

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Events for {selectedDate.toLocaleDateString()}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Existing Events */}
            {selectedDateEvents.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-700 mb-3">Existing Events</h3>
                <div className="space-y-3">
                  {selectedDateEvents.map(event => (
                    <div key={event.id} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-800">{event.title}</h4>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditEvent(event)}
                            className="p-1 hover:bg-gray-200 rounded"
                          >
                            <Edit2 className="w-4 h-4 text-gray-600" />
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(event.id)}
                            className="p-1 hover:bg-gray-200 rounded"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </div>
                      {event.description && (
                        <p className="text-gray-600 mb-2">{event.description}</p>
                      )}
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        {event.time && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {event.time}
                          </div>
                        )}
                        {event.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {event.location}
                          </div>
                        )}
                        {event.attendees && event.attendees.length > 0 && (
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {event.attendees.join(', ')}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add/Edit Event Form */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium text-gray-700 mb-3">
                {editingEvent ? 'Edit Event' : 'Add New Event'}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter event title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                    placeholder="Enter event description"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time
                    </label>
                    <input
                      type="text"
                      value={newEvent.time}
                      onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., 10:00 AM"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={newEvent.location}
                      onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter location"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Attendees (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={newEvent.attendees}
                    onChange={(e) => setNewEvent({...newEvent, attendees: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="John Doe, Jane Smith, Bob Wilson"
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    onClick={handleSaveEvent}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    {editingEvent ? 'Update Event' : 'Save Event'}
                  </button>
                  {editingEvent && (
                    <button
                      onClick={() => {
                        setEditingEvent(null);
                        setNewEvent({
                          title: '',
                          description: '',
                          time: '',
                          location: '',
                          attendees: ''
                        });
                      }}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventManagerCalendar;