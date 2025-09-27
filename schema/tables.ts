import { TableStatus } from "@/types/table";
import { z } from "zod";

export const tableSchema = z.object({
  tableNumber: z.string().min(1, "Table number is required"),
  capacity: z.number().int().min(1, "Capacity must be at least 1"),
  status: z.nativeEnum(TableStatus),
  qrCodeUrl: z.string(),
  isActive: z.boolean(),
});
export type TablesFormValues = z.infer<typeof tableSchema>;
