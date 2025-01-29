"use client";
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction'
import { Box, Button } from '@mui/material';
import { useCallback, useState } from 'react';

// 参考: https://zenn.dev/sushizanmai/articles/6f25590061de2c
export default function CalendarPage() {
  const initialEditDate = getISO8601Date(new Date());
  const [editDate, setEditDate] = useState<string>(initialEditDate);

  const initialEvents: Event[] = []
  const [events, setEvents] = useState<Event[]>(initialEvents);

  const [decoration, setDecoration] = useState<Decoration>({
    date: initialEditDate,
    color: 'grey',
    display: 'background',
  });

  const handleClickDateCell = (arg: DateClickArg) => {
    setEditDate(arg.dateStr);
    setDecoration({ date: arg.dateStr, color: 'grey', display: 'background' });
  }
  const handleClickShiftButton = useCallback((shiftPatern: string) => {
    const hasExistingEvent = () => {
      for (const event of events) {
        if (event.date === editDate) {
          setEvents(events.map((e) => e.date === editDate ? { title: shiftPatern, date: editDate } : e));
          return true;
        }
      }
      return false;
    }

    if (!hasExistingEvent()) {
      setEvents([...events, { title: shiftPatern, date: editDate }]);
    }
    const date = new Date(editDate);
    const nextDate = new Date(date.setDate(date.getDate() + 1));
    setEditDate(getISO8601Date(nextDate));
    setDecoration({ date: getISO8601Date(nextDate), color: 'grey', display: 'background' });
  }, [events, editDate, setEvents]);

  return (
    <>
      <Calendar
        events={events}
        decoration={decoration}
        onDateClick={handleClickDateCell}
      />
      <ShiftSelector onSelectShift={handleClickShiftButton} />
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
      <Button color="primary" variant="outlined" sx={{ margin: '4px' }} onClick={() => props.onSelectShift('日勤')}>日勤</Button>
      <Button color="secondary" variant="outlined" sx={{ margin: '4px' }} onClick={() => props.onSelectShift('夜勤')}>夜勤</Button>
      <Button color="error" variant="outlined" sx={{ margin: '4px' }} onClick={() => props.onSelectShift('明け')}>明け</Button>
      <Button color="warning" variant="outlined" sx={{ margin: '4px' }} onClick={() => props.onSelectShift('休み')}>休み</Button>
    </Box>
  );
}

type CalendarProps = {
  events: (Event | Decoration)[]
  decoration: Decoration;
  onDateClick: (arg: DateClickArg) => void;
}
const Calendar: React.FC<CalendarProps> = (props) => {
  // TODO: 次の日が月跨ぎの場合は次の月に移動する
  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      // eventsとdecorationを結合して渡す
      events={props.events.concat(props.decoration)}
      locale={'ja'}
      buttonText={{ today: '今日' }
      }
      height={'auto'}
      dateClick={props.onDateClick}
      dayCellContent={(arg) => arg.dayNumberText.replace(/日/, '')}
    />
  );
}

type Event = {
  title: string;
  date: string;
  color?: string;
}

type Decoration = {
  date: string;
  color: string;
  display: string;
}

const getISO8601Date = (date: Date) => {
  return date.toISOString().split('T')[0];
}