import { EquipementContext } from "@/context/EquipementContext";
import { useContext } from "react";

export function useEquipement() {
    const ctx = useContext(EquipementContext);

    if (!ctx) throw new Error('useEquipement doit être utilisé dans un EquipementProvider');
    
    return ctx;
}