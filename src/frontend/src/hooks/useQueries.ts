import { useMutation, useQuery } from "@tanstack/react-query";
import type { Item, Price, Store } from "../backend.d";
import { useActor } from "./useActor";

export type { Item, Store, Price };

export interface AllPricesData {
  stores: Store[];
  prices: Price[];
  items: Item[];
}

export interface DealEntry {
  item: Item;
  store: Store;
  price: number;
}

export interface BasketSuggestionResult {
  bestTotal: number;
  totalPerStore: Array<[Store, number]>;
  bestStore: Store;
}

export function useAllPrices() {
  const { actor, isFetching } = useActor();
  return useQuery<AllPricesData>({
    queryKey: ["allPrices"],
    queryFn: async () => {
      if (!actor) return { stores: [], prices: [], items: [] };
      const result = await actor.getAllPrices();
      return {
        stores: [...result.stores],
        prices: [...result.prices],
        items: [...result.items],
      };
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useBestDeals() {
  const { actor, isFetching } = useActor();
  return useQuery<DealEntry[]>({
    queryKey: ["bestDeals"],
    queryFn: async () => {
      if (!actor) return [];
      const result = await actor.getBestDeals();
      return result.map(([item, deal]) => ({
        item,
        store: deal.store,
        price: deal.price,
      }));
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useBasketSuggestion() {
  const { actor } = useActor();
  return useMutation<BasketSuggestionResult, Error, string[]>({
    mutationFn: async (itemIds: string[]) => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.getBasketSuggestion(itemIds);
      return {
        bestTotal: result.bestTotal,
        totalPerStore: [...result.totalPerStore],
        bestStore: result.bestStore,
      };
    },
  });
}
