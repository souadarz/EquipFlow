import { MaintenanceContext } from "@/context/MaintenanceContext";
import { useContext } from "react";

export function useMaintenance() {
    const ctx = useContext(MaintenanceContext);
    if (!ctx) throw new Error('useMaintenance doit être utilisé dans un MaintenanceProvider');
    return ctx;
}
