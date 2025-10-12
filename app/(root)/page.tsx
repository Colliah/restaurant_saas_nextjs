"use client";
import { IngredientTransactionsDialogDetail } from "@/components/ingredient-transactions/ingredient-transactions-dialog-detail";
import { TransactionForm } from "@/components/ingredient-transactions/ingredient-transactions-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatMoney } from "@/lib/utils";
import { IngredientTransaction } from "@/types/ingredient-recipe";
import { Eye } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export default function Page() {
  const [transactions, setTransactions] = useState<IngredientTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [transactionsToView, setTransactionsToView] = useState<
    IngredientTransaction[] | null
  >(null);

  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/ingredient-transactions");
      if (!res.ok) throw new Error("Failed to fetch transactions");
      const data = await res.json();
      setTransactions(data);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      toast.error(`Could not load transactions: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const transactionBatches = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return [];
    }

    const sortedTxs = [...transactions].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    const batches: IngredientTransaction[][] = [];
    let currentBatch: IngredientTransaction[] = [];

    sortedTxs.forEach((tx, index) => {
      if (index === 0) {
        currentBatch.push(tx);
        return;
      }

      const prevTx = currentBatch[currentBatch.length - 1];
      const timeDiff =
        new Date(tx.createdAt).getTime() - new Date(prevTx.createdAt).getTime();

      if (
        tx.type === prevTx.type &&
        tx.createdBy?.name === prevTx.createdBy?.name &&
        timeDiff < 5000
      ) {
        currentBatch.push(tx);
      } else {
        batches.push(currentBatch);
        currentBatch = [tx];
      }
    });

    if (currentBatch.length > 0) {
      batches.push(currentBatch);
    }

    return batches;
  }, [transactions]);

  const handleSuccess = () => {
    setIsSheetOpen(false);
    fetchTransactions();
    toast.success("Transaction added successfully!");
  };

  return (
    <div className="container mx-auto py-8 px-4 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Ingredient Transactions</h1>
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button onClick={() => setIsSheetOpen(true)}>
              Add Transaction
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-lg">
            <SheetHeader>
              <SheetTitle>New Transaction</SheetTitle>
            </SheetHeader>
            <TransactionForm onSuccess={handleSuccess} />
          </SheetContent>
        </Sheet>
      </div>
      <div className="border rounded-lg bg-white dark:bg-gray-800 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total Cost</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24">
                  Loading transactions...
                </TableCell>
              </TableRow>
            ) : transactionBatches.length > 0 ? (
              transactionBatches.map((batch) => {
                const representativeTx = batch[0];
                const totalCost = batch.reduce(
                  (sum, tx) => sum + tx.price * tx.quantity,
                  0
                );

                return (
                  <TableRow
                    key={representativeTx.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <TableCell>
                      <Badge
                        variant={
                          representativeTx.type === "IMPORT"
                            ? "success"
                            : "destructive"
                        }
                      >
                        {representativeTx.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {batch.length} item{batch.length > 1 ? "s" : ""}
                    </TableCell>
                    <TableCell>{formatMoney(totalCost)}</TableCell>
                    <TableCell>
                      {new Date(
                        representativeTx.createdAt
                      ).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {representativeTx.createdBy?.name || "Unknown"}
                    </TableCell>
                    <TableCell className="text-right">
                      {/* Truyền cả lô (mảng) vào dialog */}
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setTransactionsToView(batch)}
                        className="border p-2 rounded-md"
                      >
                        <Eye className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24">
                  No transactions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <IngredientTransactionsDialogDetail
          open={!!transactionsToView}
          onOpenChange={(isDialogOpen) => {
            if (!isDialogOpen) {
              setTransactionsToView(null);
            }
          }}
          details={transactionsToView}
        />
      </div>
    </div>
  );
}
