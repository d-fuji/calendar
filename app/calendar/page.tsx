"use client";
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction'
import { Box, Button, Container, Paper } from '@mui/material';
import { useState } from 'react';
import styles from './page.module.css';

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
    <>
      <Calendar
        events={events}
        onDateClick={handleDateClick}
      />
      <ShiftSelector onSelectShift={handleSetShift} />
    </>
  );
}

type ShiftSelectorProps = {
  onSelectShift: (shiftPatern: string) => void;
}
const ShiftSelector: React.FC<ShiftSelectorProps> = (props) => {
  // https://mui.com/material-ui/customization/palette/#custom-colors
  return (
    <Box m={2} display="flex" flexWrap="wrap">
      <Button color="primary" variant="outlined" sx={{ margin: '4px' }}>日勤</Button>
      <Button color="secondary" variant="outlined" sx={{ margin: '4px' }}>夜勤</Button>
      <Button color="error" variant="outlined" sx={{ margin: '4px' }}>明け</Button>
      <Button color="warning" variant="outlined" sx={{ margin: '4px' }}>休み</Button>
    </Box>
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
      locale={'ja'}
      buttonText={
        {
          today: '今日',
          month: '月',
          week: '週',
          day: '日'
        }
      }
      height={'auto'}
      contentHeight={'auto'}
      aspectRatio={2}
      // editable
      dateClick={props.onDateClick}
    // eventChange={(arg) => alert(arg.event)}
    />
  );
}

type Event = {
  title: string;
  date: string;
  color?: string;
}
