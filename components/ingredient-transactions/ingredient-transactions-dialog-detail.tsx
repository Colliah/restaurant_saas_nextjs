import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { IngredientTransaction } from "@/types/ingredient-recipe";
import {
  CalendarDays,
  Hash,
  DollarSign,
  ClipboardList,
  ArrowDownLeft,
  ArrowUpRight,
  Package,
} from "lucide-react";
import { formatMoney } from "@/lib/utils";

interface IngredientTransactionsDialogDetailProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  details: IngredientTransaction[] | null;
}

const DetailItem = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | React.ReactNode;
}) => (
  <div className="flex items-center justify-between py-2">
    <div className="flex items-center gap-3 text-sm text-muted-foreground">
      {icon}
      <span>{label}</span>
    </div>
    <span className="font-medium text-sm text-right">{value}</span>
  </div>
);

export function IngredientTransactionsDialogDetail({
  open,
  onOpenChange,
  details,
}: IngredientTransactionsDialogDetailProps) {
  if (!details || details.length === 0) {
    return null;
  }

  const grandTotal = details.reduce(
    (acc, transaction) => acc + transaction.price * transaction.quantity,
    0
  );

  const allNotes = [...new Set(details.map((d) => d.notes).filter(Boolean))];
  const representativeDetail = details[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-6">
        <DialogHeader>
          <DialogTitle className="text-base text-gray-500">
            Transaction Details ({details.length} item
            {details.length > 1 ? "s" : ""})
          </DialogTitle>
          <div className="flex items-end justify-between">
            <p className="text-2xl font-bold">Total Value</p>
            <p className="text-2xl font-bold ">{formatMoney(grandTotal)}</p>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <Badge
              variant={
                representativeDetail.type === "IMPORT"
                  ? "success"
                  : "destructive"
              }
            >
              {representativeDetail.type}
            </Badge>
            <div className="flex items-center gap-2">
              <CalendarDays className="size-4" />
              <span>
                {new Date(representativeDetail.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto space-y-4 pr-3 hide-scrollbar">
          {details.map((detail, index) => (
            <div key={detail.id}>
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Package className="size-5" />
                {detail.ingredient?.name || "N/A"}
              </h3>
              <div className="space-y-1">
                <DetailItem
                  icon={<Hash className="size-4" />}
                  label="Quantity"
                  value={`${detail.quantity} ${detail.ingredient?.unit || ""}`}
                />
                <DetailItem
                  icon={<DollarSign className="size-4" />}
                  label="Price"
                  value={formatMoney(detail.price)}
                />
                <DetailItem
                  icon={<DollarSign className="size-4" />}
                  label="Total"
                  value={formatMoney(detail.price * detail.quantity)}
                />
              </div>
              {index < details.length - 1 && <Separator />}
            </div>
          ))}

          {allNotes.length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="text-sm font-semibold text-gray-500 mb-2 flex items-center gap-2">
                  <ClipboardList className="size-4" /> Notes
                </h4>
                {allNotes.map((note, index) => (
                  <p
                    key={index}
                    className="text-sm bg-gray-100 dark:bg-gray-800 p-3 rounded-md border border-gray-200 dark:border-gray-700 mb-2"
                  >
                    {note}
                  </p>
                ))}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
