export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

export enum EquipementStatus {
  DISPONIBLE = 'disponible',
  RESERVE = 'réservé',
  EN_MAINTENANCE = 'en maintenance',
  HORS_SERVICE = 'hors service',
}

export enum ReservationStatus {
  ATTENTE = 'attente',
  ACTIVE = 'active',
  CONFIRME = 'confirme',
  ANNULE = 'annule',
  COMPLETE = 'complete',
}