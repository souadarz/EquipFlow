'use client';

import { useState } from 'react';

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  bookedRanges?: { start: Date; end: Date }[];
  onChange: (dates: { startDate: string; endDate: string }) => void;
}

const WEEKDAYS = ['LU', 'MA', 'ME', 'JE', 'VE', 'SA', 'DI'];
const MONTHS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

function toLocalDateStr(d: Date) {
  return d.toISOString().split('T')[0];
}

function isSameDay(a: Date, b: Date) {
  return toLocalDateStr(a) === toLocalDateStr(b);
}

function isBooked(day: Date, bookedRanges: { start: Date; end: Date }[]) {
  return bookedRanges.some(r => day >= r.start && day <= r.end);
}

export default function DateRangePicker({ startDate, endDate, bookedRanges = [], onChange }: DateRangePickerProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [viewDate, setViewDate] = useState(() => {
    const d = startDate ? new Date(startDate) : new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const [hovered, setHovered] = useState<Date | null>(null);

  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;

  const prevMonth = () => setViewDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const nextMonth = () => setViewDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfWeek = (year: number, month: number) => {
    // Monday = 0 in our grid
    const d = new Date(year, month, 1).getDay();
    return d === 0 ? 6 : d - 1;
  };

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOffset = getFirstDayOfWeek(year, month);

  const handleDayClick = (day: Date) => {
    if (day < today) return;
    if (isBooked(day, bookedRanges)) return;

    const dayStr = toLocalDateStr(day);

    // Si pas de start ou si on a les deux, recommencer avec un nouveau start
    if (!start || (start && end)) {
      onChange({ startDate: dayStr, endDate: '' });
    } else {
      // On a un start, on sélectionne le end
      if (day < start) {
        onChange({ startDate: dayStr, endDate: toLocalDateStr(start) });
      } else {
        onChange({ startDate: toLocalDateStr(start), endDate: dayStr });
      }
    }
  };

  const isInRange = (day: Date) => {
    if (!start) return false;
    const endRef = end || hovered;
    if (!endRef) return false;
    const [from, to] = start < endRef ? [start, endRef] : [endRef, start];
    return day > from && day < to;
  };

  const isStart = (day: Date) => !!start && isSameDay(day, start);
  const isEnd = (day: Date) => !!end && isSameDay(day, end);

  // Build calendar cells
  const cells: (Date | null)[] = [];
  for (let i = 0; i < firstDayOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  // Night count
  let nights: number | null = null;
  if (start && end) {
    nights = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  }

  return (
    <div className="select-none">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={prevMonth}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
        >
          <span className="material-icons" style={{ fontSize: '20px' }}>chevron_left</span>
        </button>
        <span className="font-bold text-gray-900 text-sm">
          {MONTHS[month]} {year}
        </span>
        <button
          type="button"
          onClick={nextMonth}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
        >
          <span className="material-icons" style={{ fontSize: '20px' }}>chevron_right</span>
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-2">
        {WEEKDAYS.map(d => (
          <div key={d} className="text-center text-xs font-bold text-gray-400 py-1">{d}</div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;

          const isPast = day < today;
          const booked = isBooked(day, bookedRanges);
          const inRange = isInRange(day);
          const isStartDay = isStart(day);
          const isEndDay = isEnd(day);
          const isToday = isSameDay(day, today);
          const disabled = isPast || booked;

          return (
            <div
              key={i}
              className={`relative flex items-center justify-center
                ${inRange ? 'bg-primary/10' : ''}
                ${isStartDay && end ? 'rounded-l-full' : ''}
                ${isEndDay ? 'rounded-r-full' : ''}
              `}
            >
              <button
                type="button"
                disabled={disabled}
                onClick={() => handleDayClick(day)}
                onMouseEnter={() => !end && start && setHovered(day)}
                onMouseLeave={() => setHovered(null)}
                className={`w-9 h-9 rounded-full text-sm font-semibold transition-all
                  ${disabled
                    ? booked
                      ? 'bg-red-100 text-red-400 cursor-not-allowed line-through'
                      : 'text-gray-300 cursor-not-allowed'
                    : isStartDay || isEndDay
                      ? 'bg-primary text-white shadow-md shadow-primary/30'
                      : isToday
                        ? 'border-2 border-primary text-primary'
                        : 'text-gray-700 hover:bg-primary/20 hover:text-primary'
                  }
                `}
              >
                {day.getDate()}
              </button>
            </div>
          );
        })}
      </div>

      {/* Selected range summary */}
      <div className="grid grid-cols-2 gap-3 mt-5">
        <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Date de début</p>
          <p className="text-sm font-semibold text-gray-900">
            {start ? start.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
          </p>
        </div>
        <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Date de fin</p>
          <p className="text-sm font-semibold text-gray-900">
            {end ? end.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
          </p>
        </div>
      </div>

      {nights !== null && nights > 0 && (
        <div className="mt-3 text-center">
          <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full">
            {nights} jour{nights > 1 ? 's' : ''}
          </span>
        </div>
      )}

      {/* Légende */}
      <div className="flex items-center gap-4 mt-4 text-xs text-gray-400">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-primary inline-block"></span> Sélectionné
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-200 inline-block"></span> Réservé
        </span>
      </div>
    </div>
  );
}
