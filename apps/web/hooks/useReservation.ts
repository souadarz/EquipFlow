import { ReservationContext } from "@/context/ReservationContext";
import { useContext } from "react";

export function useReservation() {

  const ctx = useContext(ReservationContext);
  if (!ctx) throw new Error('useReservation doit être utilisé dans un ReservationProvider');
  return ctx;
}