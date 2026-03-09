import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useBestDeals } from "@/hooks/useQueries";
import { Store as StoreIcon, Tag } from "lucide-react";
import { motion } from "motion/react";

export function BestDeals() {
  const { data, isLoading, isError } = useBestDeals();

  if (isLoading) {
    return (
      <div data-ocid="deals.loading_state" className="space-y-3 p-4">
        {["sk1", "sk2", "sk3", "sk4", "sk5", "sk6"].map((k) => (
          <Skeleton key={k} className="h-20 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div
        data-ocid="deals.error_state"
        className="flex flex-col items-center justify-center p-12 text-muted-foreground"
      >
        <span className="text-4xl mb-3">⚠️</span>
        <p className="font-medium">Could not load deals.</p>
      </div>
    );
  }

  const sorted = [...data].sort((a, b) =>
    a.item.name.localeCompare(b.item.name),
  );

  if (sorted.length === 0) {
    return (
      <div
        data-ocid="deals.empty_state"
        className="flex flex-col items-center justify-center p-12 text-muted-foreground"
      >
        <span className="text-4xl mb-3">🏷️</span>
        <p className="font-medium">No deals available yet.</p>
      </div>
    );
  }

  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.06,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      data-ocid="deals.list"
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      {sorted.map((deal, idx) => (
        <motion.div
          key={deal.item.id}
          data-ocid={`deals.item.${idx + 1}`}
          variants={itemVariants}
          className="group relative bg-card border border-border rounded-xl p-5 hover:shadow-md transition-shadow overflow-hidden"
        >
          {/* Subtle bg pattern */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(circle_at_80%_20%,oklch(0.5_0.2_148),transparent_60%)]" />

          <div className="relative flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <Tag className="w-3.5 h-3.5 text-primary opacity-70 shrink-0" />
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                  Best price
                </p>
              </div>
              <h3 className="font-display font-semibold text-foreground text-lg leading-tight truncate">
                {deal.item.name}
              </h3>
              <div className="flex items-center gap-1.5 mt-2">
                <StoreIcon className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <Badge
                  variant="secondary"
                  className="bg-secondary text-secondary-foreground border-0 text-xs font-medium"
                >
                  {deal.store.name}
                </Badge>
              </div>
            </div>
            <div className="shrink-0 text-right">
              <span className="font-display font-bold text-2xl text-primary tabular-nums">
                ${deal.price.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Bottom accent line */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/40 via-primary/80 to-primary/40 opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.div>
      ))}
    </motion.div>
  );
}
