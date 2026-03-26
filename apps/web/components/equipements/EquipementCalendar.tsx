'use client';

import { useEffect, useState } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { findAllReservations } from '@/services/reservation.service';
import { ReservationStatus } from '@repo/shared';
import type { IReservation } from '@repo/shared';

moment.locale('fr');
const localizer = momentLocalizer(moment);

interface CalendarEvent {
  title: string;
  start: Date;
  end: Date;
  resource?: { status: ReservationStatus };
}

interface Props {
  equipementId: string;
}

const statusColors: Record<string, string> = {
  [ReservationStatus.ACTIVE]: '#3b82f6',
  [ReservationStatus.CONFIRME]: '#22c55e',
  [ReservationStatus.ANNULE]: '#ef4444',
  [ReservationStatus.COMPLETE]: '#6b7280',
};

export default function EquipementCalendar({ equipementId }: Props) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await findAllReservations({ equipement: equipementId, limit: 200 });
      if (data?.data) {
        const mapped: CalendarEvent[] = data.data.map((res: IReservation) => ({
          title: res.user?.fullname ?? 'Réservé',
          start: new Date(res.startDate),
          end: new Date(res.endDate),
          resource: { status: res.status },
        }));
        setEvents(mapped);
      }
      setLoading(false);
    }
    load();
  }, [equipementId]);

  const eventStyleGetter = (event: CalendarEvent) => {
    const bg = statusColors[event.resource?.status ?? ''] ?? '#274c77';
    return {
      style: {
        backgroundColor: bg,
        borderRadius: '6px',
        border: 'none',
        color: 'white',
        fontSize: '11px',
        fontWeight: 600,
        padding: '2px 6px',
      },
    };
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <span className="material-icons text-primary bg-primary/10 rounded-lg p-1.5" style={{ fontSize: '20px' }}>
            calendar_month
          </span>
          Disponibilités
        </h2>
        {/* Légende */}
        <div className="flex items-center gap-3 flex-wrap">
          {Object.entries(statusColors).map(([status, color]) => (
            <span key={status} className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: color }} />
              {status.charAt(0) + status.slice(1).toLowerCase()}
            </span>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      ) : (
        <div style={{ height: 450 }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            defaultView={Views.MONTH}
            views={[Views.MONTH, Views.WEEK]}
            eventPropGetter={eventStyleGetter}
            messages={{
              today: "Aujourd'hui",
              previous: '← Précédent',
              next: 'Suivant →',
              month: 'Mois',
              week: 'Semaine',
              noEventsInRange: 'Aucune réservation sur cette période.',
            }}
            style={{
              fontFamily: 'inherit',
            }}
          />
        </div>
      )}
    </div>
  );
}
