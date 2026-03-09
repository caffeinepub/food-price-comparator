import { BasketBuilder } from "@/components/BasketBuilder";
import { BestDeals } from "@/components/BestDeals";
import { PricesTable } from "@/components/PricesTable";
import { Toaster } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutGrid, Leaf, ShoppingBasket, Tag } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

type TabValue = "prices" | "deals" | "basket";

const tabs: { value: TabValue; label: string; icon: React.ReactNode }[] = [
  {
    value: "prices",
    label: "All Prices",
    icon: <LayoutGrid className="w-4 h-4" />,
  },
  {
    value: "deals",
    label: "Best Deals",
    icon: <Tag className="w-4 h-4" />,
  },
  {
    value: "basket",
    label: "Basket Builder",
    icon: <ShoppingBasket className="w-4 h-4" />,
  },
];

const tabDescriptions: Record<TabValue, string> = {
  prices:
    "Compare prices across all stores — find where each item is cheapest.",
  deals: "The absolute best price available for every item, right now.",
  basket: "Pick your groceries and find which store gives you the best total.",
};

export default function App() {
  const [activeTab, setActiveTab] = useState<TabValue>("prices");

  return (
    <div className="min-h-screen bg-background noise-bg flex flex-col">
      <Toaster />

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary text-primary-foreground shrink-0">
            <Leaf className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl text-foreground leading-none">
              FreshPrice
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Smart grocery price comparison
            </p>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8">
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as TabValue)}
          className="space-y-6"
        >
          {/* Tab navigation */}
          <div className="space-y-4">
            <TabsList className="h-auto p-1 bg-muted/60 border border-border rounded-xl w-full sm:w-auto grid grid-cols-3 sm:inline-grid gap-1">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  data-ocid="nav.tab"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
                >
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden text-xs">
                    {tab.label.split(" ")[0]}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Active tab description */}
            <AnimatePresence mode="wait">
              <motion.p
                key={activeTab}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="text-sm text-muted-foreground"
              >
                {tabDescriptions[activeTab]}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Tab content */}
          <TabsContent value="prices" className="mt-0">
            <AnimatePresence mode="wait">
              <motion.div
                key="prices"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <PricesTable />
              </motion.div>
            </AnimatePresence>
          </TabsContent>

          <TabsContent value="deals" className="mt-0">
            <AnimatePresence mode="wait">
              <motion.div
                key="deals"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <BestDeals />
              </motion.div>
            </AnimatePresence>
          </TabsContent>

          <TabsContent value="basket" className="mt-0">
            <AnimatePresence mode="wait">
              <motion.div
                key="basket"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <BasketBuilder />
              </motion.div>
            </AnimatePresence>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-5 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Leaf className="w-3.5 h-3.5 text-primary/60" />
            <span className="font-medium text-foreground/80">FreshPrice</span>
            <span>— Know before you go.</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()}.{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                window.location.hostname,
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Built with ♥ using caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
