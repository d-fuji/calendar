"use client";
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction'
import { Container, Dialog, Paper } from '@mui/material';
import { useState } from 'react';

// 参考: https://zenn.dev/sushizanmai/articles/6f25590061de2c
export default function CalendarPage() {
  const initialEvents: Event[] = [
    { title: 'event 1', date: '2025-01-24' },
    { title: 'event 2', date: '2025-01-23' }
  ]
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [editDate, setEditDate] = useState<string>('');
  const handleChangeEditDate = (date: string) => {
    setEditDate(date);
  }
  const handleDateClick = (arg: DateClickArg) => {
    handleChangeEditDate(arg.dateStr);
  }
  const handleSetShift = (shiftPatern: string) => {
    setEvents([...events, { title: shiftPatern, date: editDate }]);
  }
  return (
    <Container>
      <ShiftSelector
        onSelectShift={handleSetShift}
      />
      <Calendar
        events={events}
        onDateClick={handleDateClick}
      />
    </Container>
  );
}

type ShiftSelectorProps = {
  onSelectShift: (shiftPatern: string) => void;
}
const ShiftSelector: React.FC<ShiftSelectorProps> = (props) => {
  return (
    <Paper>
      <button onClick={() => props.onSelectShift('入り')}>入り</button>
      <button onClick={() => props.onSelectShift('明け')}>明け</button>
    </Paper>
  );
}

type CalendarProps = {
  events: Event[];
  onDateClick: (arg: DateClickArg) => void;
}
const Calendar: React.FC<CalendarProps> = (props) => {
  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      events={props.events}
      dateClick={props.onDateClick}
    />
  );
}

type Event = {
  title: string;
  date: string;
}
