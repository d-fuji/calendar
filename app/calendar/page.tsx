"use client";
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction'
import { Box, Button } from '@mui/material';
import { useCallback, useState } from 'react';

// 参考: https://zenn.dev/sushizanmai/articles/6f25590061de2c
export default function CalendarPage() {
  const initialEvents: Event[] = [
    { title: 'event 1', date: '2025-01-24' },
    { title: 'event 2', date: '2025-01-23' },
  ]
  const initialEditDate = getISO8601Date(new Date());

  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [editDate, setEditDate] = useState<string>(initialEditDate);

  const handleClickDateCell = (arg: DateClickArg) => {
    setEditDate(arg.dateStr);
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
  }, [events, editDate, setEvents]);

  return (
    <>
      <Calendar
        events={events}
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
  events: Event[];
  onDateClick: (arg: DateClickArg) => void;
}
const Calendar: React.FC<CalendarProps> = (props) => {
  // TODO: フォーカルを当てる
  // TODO: シフトボタンを押すと次の日にフォーカルを当てる
  // TODO: 次の日が月跨ぎの場合は次の月に移動する
  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      events={props.events}
      locale={'ja'}
      buttonText={{ today: '今日' }
      }
      height={'auto'}
      contentHeight={'auto'}
      aspectRatio={2}
      // editable
      dateClick={props.onDateClick}
      datesSet={(dateInfo) => {
        console.log(dateInfo.start.toISOString())
        console.log(dateInfo.end.toISOString())
      }}
      dayCellContent={(arg) => arg.dayNumberText.replace(/日/, '')}
    // eventChange={(arg) => alert(arg.event)}
    />
  );
}

type Event = {
  title: string;
  date: string;
  color?: string;
}

const getISO8601Date = (date: Date) => {
  return date.toISOString().split('T')[0];
}