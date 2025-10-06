"use client";

import { DarkMode } from "@/components/dark-mode";
import { IngredientTransactionsDialogDetail } from "@/components/ingredient-transactions/ingredient-transactions-dialog-detail";
import { TransactionForm } from "@/components/ingredient-transactions/ingredient-transactions-form";
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
import { IngredientTransaction } from "@/types/ingredient-recipe";
import { Eye } from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

export default function Page() {
  const [transactions, setTransactions] = useState<IngredientTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [transactionView, setTransactionView] =
    useState<IngredientTransaction | null>(null);

  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/ingredient-transactions");
      if (!res.ok) throw new Error("Failed to fetch transactions");
      const data = await res.json();
      setTransactions(data);
    } catch (error) {
      toast.error(`Could not load transactions, ${error}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleSuccess = () => {
    setIsSheetOpen(false);
    fetchTransactions();
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Ingredient Transactions</h1>
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button>Add Transaction</Button>
          </SheetTrigger>

          <SheetContent className="sm:max-w-lg">
            <SheetHeader>
              <SheetTitle className="text-2xl">New Transaction</SheetTitle>
            </SheetHeader>
            <TransactionForm onSuccess={handleSuccess} />
          </SheetContent>
        </Sheet>
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Ingredient</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24">
                  Loading transactions...
                </TableCell>
              </TableRow>
            ) : transactions.length > 0 ? (
              transactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        tx.type === "IMPORT"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      {tx.type}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium">
                    {tx.ingredient?.name || "N/A"}
                  </TableCell>
                  <TableCell>{tx.quantity}</TableCell>
                  <TableCell>${tx.price.toFixed(2)}</TableCell>
                  <TableCell>
                    {new Date(tx.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setTransactionView(tx)}
                    >
                      <Eye className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
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
          open={!!transactionView}
          onOpenChange={(isDialogOpen) => {
            if (!isDialogOpen) {
              setTransactionView(null);
            }
          }}
          detail={transactionView}
        />
      </div>
    </div>
  );
}
