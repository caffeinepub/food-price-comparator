import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useAllPrices, useBasketSuggestion } from "@/hooks/useQueries";
import {
  ChevronDown,
  ChevronUp,
  Loader2,
  ShoppingBasket,
  Sparkles,
  Store as StoreIcon,
  Trophy,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

export function BasketBuilder() {
  const { data: pricesData, isLoading: loadingItems } = useAllPrices();
  const basketMutation = useBasketSuggestion();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  if (loadingItems) {
    return (
      <div data-ocid="basket.loading_state" className="space-y-3 p-4">
        {["sk1", "sk2", "sk3", "sk4", "sk5", "sk6", "sk7", "sk8"].map((k) => (
          <Skeleton key={k} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  const items = pricesData?.items ?? [];
  const sortedItems = [...items].sort((a, b) => a.name.localeCompare(b.name));

  const toggleItem = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => setSelectedIds(new Set(sortedItems.map((i) => i.id)));
  const clearAll = () => setSelectedIds(new Set());

  const handleFind = () => {
    if (selectedIds.size === 0) return;
    basketMutation.mutate(Array.from(selectedIds));
  };

  const result = basketMutation.data;
  const storeTotals = result
    ? [...result.totalPerStore].sort(([, a], [, b]) => a - b)
    : [];

  const maxTotal =
    storeTotals.length > 0 ? Math.max(...storeTotals.map(([, t]) => t)) : 0;
  const savings = storeTotals.length > 0 ? maxTotal - result!.bestTotal : 0;

  return (
    <div className="space-y-6">
      {/* Item Selection */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2">
            <ShoppingBasket className="w-4 h-4 text-primary" />
            <span className="font-display font-semibold text-foreground">
              Select Items
            </span>
            {selectedIds.size > 0 && (
              <span className="inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold w-5 h-5">
                {selectedIds.size}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={selectAll}
              className="text-xs h-7 px-2 text-muted-foreground hover:text-foreground"
            >
              Select all
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="text-xs h-7 px-2 text-muted-foreground hover:text-foreground"
            >
              Clear
            </Button>
          </div>
        </div>

        {sortedItems.length === 0 ? (
          <div
            data-ocid="basket.empty_state"
            className="p-8 text-center text-muted-foreground"
          >
            <span className="text-3xl">🍔</span>
            <p className="mt-2">No items available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 divide-y sm:divide-y-0 sm:divide-x-0">
            {sortedItems.map((item, idx) => {
              const checked = selectedIds.has(item.id);
              return (
                <div
                  key={item.id}
                  className={`flex items-center gap-3 px-5 py-3.5 cursor-pointer transition-colors select-none border-b border-border/50 last:border-b-0 ${
                    checked ? "bg-success-muted/30" : "hover:bg-muted/30"
                  }`}
                  onClick={() => toggleItem(item.id)}
                  onKeyDown={(e) => {
                    if (e.key === " " || e.key === "Enter") toggleItem(item.id);
                  }}
                >
                  <Checkbox
                    data-ocid={`basket.checkbox.${idx + 1}`}
                    id={`item-${item.id}`}
                    checked={checked}
                    onCheckedChange={() => toggleItem(item.id)}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <Label
                    htmlFor={`item-${item.id}`}
                    className={`cursor-pointer font-medium text-sm transition-colors pointer-events-none ${
                      checked ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {item.name}
                  </Label>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Action button */}
      <Button
        data-ocid="basket.submit_button"
        onClick={handleFind}
        disabled={selectedIds.size === 0 || basketMutation.isPending}
        size="lg"
        className="w-full font-display font-semibold text-base h-12"
      >
        {basketMutation.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Finding best app…
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            Find Best App
            {selectedIds.size > 0 && (
              <span className="ml-2 text-primary-foreground/70">
                ({selectedIds.size} item{selectedIds.size !== 1 ? "s" : ""})
              </span>
            )}
          </>
        )}
      </Button>

      {basketMutation.isPending && (
        <div
          data-ocid="basket.loading_state"
          className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl"
        >
          <Loader2 className="w-4 h-4 animate-spin text-primary" />
          <span className="text-sm text-muted-foreground">
            Comparing prices across apps…
          </span>
        </div>
      )}

      {basketMutation.isError && (
        <div
          data-ocid="basket.error_state"
          className="p-4 bg-destructive/10 text-destructive rounded-xl text-sm font-medium"
        >
          Could not fetch basket suggestions. Please try again.
        </div>
      )}

      {/* Results */}
      <AnimatePresence>
        {result && !basketMutation.isPending && (
          <motion.div
            data-ocid="basket.result.panel"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            {/* Winner callout */}
            <motion.div
              initial={{ scale: 0.97 }}
              animate={{ scale: 1 }}
              className="relative bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-2xl p-6 overflow-hidden"
            >
              <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
                <Trophy className="w-32 h-32 -translate-y-4 translate-x-4" />
              </div>
              <div className="relative">
                <div className="flex items-center gap-2 mb-1">
                  <Trophy className="w-4 h-4" />
                  <span className="text-sm font-medium opacity-90 uppercase tracking-wide">
                    Best App
                  </span>
                </div>
                <h3 className="font-display font-bold text-2xl mb-2">
                  {result.bestStore.name}
                </h3>
                <div className="flex items-baseline gap-2">
                  <span className="font-display font-bold text-4xl tabular-nums">
                    ₹{result.bestTotal.toFixed(2)}
                  </span>
                  <span className="text-primary-foreground/70 text-sm">
                    total
                  </span>
                </div>
                {savings > 0.005 && (
                  <div className="mt-3 inline-flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1 text-sm font-semibold">
                    <ChevronDown className="w-3.5 h-3.5" />
                    Save ₹{savings.toFixed(2)} vs. most expensive option
                  </div>
                )}
              </div>
            </motion.div>

            {/* App rankings */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="px-5 py-3 border-b border-border bg-muted/30">
                <div className="flex items-center gap-2">
                  <StoreIcon className="w-4 h-4 text-primary" />
                  <span className="font-display font-semibold text-sm text-foreground">
                    All Apps Ranked
                  </span>
                </div>
              </div>
              <div className="divide-y divide-border">
                {storeTotals.map(([store, total], idx) => {
                  const isWinner = store.id === result.bestStore.id;
                  const pctOfMax = maxTotal > 0 ? total / maxTotal : 1;

                  return (
                    <motion.div
                      key={store.id}
                      data-ocid={`basket.result.item.${idx + 1}`}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.07 }}
                      className={`flex items-center gap-4 px-5 py-4 ${
                        isWinner ? "bg-success-muted/30" : ""
                      }`}
                    >
                      {/* Rank */}
                      <span
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                          isWinner
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {isWinner ? (
                          <Trophy className="w-3.5 h-3.5" />
                        ) : (
                          idx + 1
                        )}
                      </span>

                      {/* App name + bar */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1.5">
                          <span
                            className={`font-medium text-sm ${
                              isWinner
                                ? "text-foreground"
                                : "text-muted-foreground"
                            }`}
                          >
                            {store.name}
                          </span>
                          <span
                            className={`font-display font-bold tabular-nums ${
                              isWinner
                                ? "text-primary text-lg"
                                : "text-foreground text-base"
                            }`}
                          >
                            ₹{total.toFixed(2)}
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pctOfMax * 100}%` }}
                            transition={{
                              delay: idx * 0.07 + 0.2,
                              duration: 0.5,
                            }}
                            className={`h-full rounded-full ${
                              isWinner ? "bg-primary" : "bg-muted-foreground/40"
                            }`}
                          />
                        </div>
                      </div>

                      {/* Diff from best */}
                      {!isWinner && (
                        <div className="shrink-0 flex items-center gap-0.5 text-xs text-muted-foreground">
                          <ChevronUp className="w-3 h-3 text-destructive/70" />
                          <span className="tabular-nums text-destructive/80 font-medium">
                            +₹{(total - result.bestTotal).toFixed(2)}
                          </span>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
