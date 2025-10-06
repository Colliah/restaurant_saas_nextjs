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
} from "lucide-react";
import { formatMoney } from "@/lib/utils";

interface IngredientTransactionsDialogDetailProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  detail: IngredientTransaction | null;
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
    <span className="font-medium text-sm">{value}</span>
  </div>
);

export function IngredientTransactionsDialogDetail({
  open,
  onOpenChange,
  detail,
}: IngredientTransactionsDialogDetailProps) {
  if (!detail) {
    return null;
  }
  const totalValue = detail.price * detail.quantity;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-base text-muted-foreground">
            Transaction #{detail?.id}
          </DialogTitle>
          <div className="flex items-end justify-between">
            <p className="text-2xl font-bold">
              Ingredient: {detail.ingredient.name}
            </p>
            <p className="text-2xl font-bold text-primary">
              {formatMoney(totalValue)}
            </p>
          </div>
        </DialogHeader>

        <div className="space-y-3">
          <DetailItem
            icon={
              detail.type === "IMPORT" ? (
                <ArrowUpRight className="size-4 text-green-500" />
              ) : (
                <ArrowDownLeft className="size-4 text-red-500" />
              )
            }
            label="Type"
            value={
              <Badge
                variant={detail.type === "IMPORT" ? "outline" : "destructive"}
              >
                {detail.type}
              </Badge>
            }
          />
          <DetailItem
            icon={<CalendarDays className="size-4" />}
            label="Date"
            value={new Date(detail.createdAt).toLocaleDateString()}
          />
          <DetailItem
            icon={<Hash className="size-4" />}
            label="Quantity"
            value={`${detail.quantity} ${detail.ingredient.unit}`}
          />
          <DetailItem
            icon={<DollarSign className="size-4" />}
            label="Price"
            value={formatMoney(detail.price)}
          />
        </div>

        {detail.notes && (
          <>
            <Separator />
            <div>
              <h4 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                <ClipboardList className="size-4" /> Notes
              </h4>
              <p className="text-sm bg-secondary p-3 rounded-md border text-secondary-foreground">
                {detail.notes}
              </p>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
