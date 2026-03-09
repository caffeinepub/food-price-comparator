import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAllPrices } from "@/hooks/useQueries";
import { TrendingDown } from "lucide-react";
import { motion } from "motion/react";

export function PricesTable() {
  const { data, isLoading, isError } = useAllPrices();

  if (isLoading) {
    return (
      <div data-ocid="prices.loading_state" className="space-y-3 p-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-10 w-5/6" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div
        data-ocid="prices.error_state"
        className="flex flex-col items-center justify-center p-12 text-muted-foreground"
      >
        <span className="text-4xl mb-3">⚠️</span>
        <p className="font-medium">Could not load prices.</p>
        <p className="text-sm mt-1">Please try again later.</p>
      </div>
    );
  }

  const { stores, prices, items } = data;

  // Build a lookup: itemId -> storeId -> price
  const priceMap: Record<string, Record<string, number>> = {};
  for (const p of prices) {
    if (!priceMap[p.itemId]) priceMap[p.itemId] = {};
    priceMap[p.itemId][p.storeId] = p.price;
  }

  // For each item, find the minimum price across stores
  const minPriceForItem: Record<string, number> = {};
  for (const item of items) {
    const storePrices = Object.values(priceMap[item.id] ?? {});
    if (storePrices.length > 0) {
      minPriceForItem[item.id] = Math.min(...storePrices);
    }
  }

  const sortedItems = [...items].sort((a, b) => a.name.localeCompare(b.name));

  if (sortedItems.length === 0) {
    return (
      <div
        data-ocid="prices.empty_state"
        className="flex flex-col items-center justify-center p-12 text-muted-foreground"
      >
        <span className="text-4xl mb-3">🛒</span>
        <p className="font-medium">No price data available yet.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-xl border border-border overflow-hidden"
    >
      <div className="flex items-center gap-2 px-5 py-3 bg-muted/50 border-b border-border">
        <TrendingDown className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium text-muted-foreground">
          Green cells = cheapest price for that item
        </span>
      </div>
      <div className="overflow-x-auto">
        <Table data-ocid="prices.table">
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="font-display font-semibold text-foreground w-48 min-w-[10rem]">
                Item
              </TableHead>
              {stores.map((store) => (
                <TableHead
                  key={store.id}
                  className="font-display font-semibold text-foreground text-center min-w-[7rem]"
                >
                  {store.name}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedItems.map((item, idx) => {
              const itemPrices = priceMap[item.id] ?? {};
              const isBest = (storeId: string) =>
                itemPrices[storeId] !== undefined &&
                itemPrices[storeId] === minPriceForItem[item.id];

              return (
                <TableRow
                  key={item.id}
                  className={
                    idx % 2 === 0
                      ? "bg-background hover:bg-muted/20"
                      : "bg-muted/10 hover:bg-muted/20"
                  }
                >
                  <TableCell className="font-medium text-foreground">
                    {item.name}
                  </TableCell>
                  {stores.map((store) => {
                    const price = itemPrices[store.id];
                    const best = isBest(store.id);
                    return (
                      <TableCell
                        key={store.id}
                        className={`text-center tabular-nums transition-colors ${
                          best
                            ? "success-cell rounded"
                            : "text-muted-foreground"
                        }`}
                      >
                        {price !== undefined ? (
                          <span className="flex items-center justify-center gap-1">
                            {best && (
                              <TrendingDown className="w-3 h-3 text-success-muted-foreground" />
                            )}
                            ${price.toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-muted-foreground/40">—</span>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
}
