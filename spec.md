# Food Price Comparator

## Current State
A food price comparison app with a Motoko backend storing price data for 4 stores (Walmart, Kroger, Target, Aldi) and 8 items. The frontend has three views: PricesTable, BestDeals, and BasketBuilder. The basket builder lets users select items by checkbox and calls `getBasketSuggestion` to find the cheapest store.

## Requested Changes (Diff)

### Add
- Nothing new

### Modify
- Fix bug in `getBasketSuggestion`: the backend currently looks up items by `name` (e.g. "Apple") but the frontend passes item `id` values (e.g. "apple"). Change the lookup to match by `id` instead of `name`.

### Remove
- Nothing

## Implementation Plan
1. Regenerate backend with `getBasketSuggestion` using `i.id` instead of `i.name` for item lookup.
