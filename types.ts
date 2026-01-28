
export enum ActingStatus {
  ACTIVE = 'ACTIVE',
  EXPIRING_SOON = 'EXPIRING SOON',
  EXPIRED = 'EXPIRED'
}

export interface EmployeeActingData {
  no: string;
  name: string;
  dept: string;
  position: string;
  startDate: string;
  endDate: string;
  status: ActingStatus;
  daysRemaining: number;
}

export interface SummaryStats {
  total: number;
  active: number;
  expiringSoon: number;
  expired: number;
}
