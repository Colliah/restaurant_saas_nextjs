export enum TableStatus {
  AVAILABLE = "AVAILABLE",
  OCCUPIED = "OCCUPIED",
  RESERVED = "RESERVED",
}

export interface TableData {
  tableNumber: string;
  capacity: number;
  status: TableStatus;
  qrCodeUrl: string;
  isActive: boolean;
}