import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Item {
    id: string;
    name: string;
}
export interface Store {
    id: string;
    name: string;
}
export interface Price {
    itemId: string;
    storeId: string;
    price: number;
}
export interface backendInterface {
    getAllPrices(): Promise<{
        stores: Array<Store>;
        prices: Array<Price>;
        items: Array<Item>;
    }>;
    getBasketSuggestion(itemIds: Array<string>): Promise<{
        bestTotal: number;
        totalPerStore: Array<[Store, number]>;
        bestStore: Store;
    }>;
    getBestDeals(): Promise<Array<[Item, {
            store: Store;
            price: number;
        }]>>;
}
