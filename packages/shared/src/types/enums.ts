export enum Role {
  USER  = 'user',
  ADMIN = 'admin',
}

export enum EquipementStatus {
  DISPONIBLE      = 'disponible',
  RESERVE         = 'reserve',
  EN_MAINTENANCE  = 'en_maintenance',
  HORS_SERVICE    = 'hors_service',
}

export enum ReservationStatus {
  ACTIVE    = 'active',
  CONFIRME  = 'confirme',
  ANNULE    = 'annule',
  COMPLETE  = 'complete',
}