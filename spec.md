# Food Delivery Price Comparator

## Current State
The app compares grocery prices across Walmart, Kroger, Target, and Aldi. Items are groceries (Apple, Milk, Bread, etc.).

## Requested Changes (Diff)

### Add
- Food delivery app platforms: Zomato, Swiggy, Domino's, EatSure, Uber Eats
- Food items relevant to delivery apps: Burger, Pizza, Biryani, Pasta, Sandwich, Noodles, Paneer Tikka, Chicken Wings, French Fries, Cold Drink

### Modify
- Backend: Replace stores (Walmart/Kroger/Target/Aldi) with food delivery apps (Zomato/Swiggy/Dominos/EatSure/UberEats)
- Backend: Replace grocery items with food delivery menu items
- Backend: Update all price data for new items and platforms (in INR)
- Frontend: Rebrand from "FreshPrice" to "FoodDeal" — food delivery comparison
- Frontend: Update tab descriptions to match food delivery context
- Frontend: Change currency from $ to ₹
- Frontend: Update icon from Leaf to Utensils

### Remove
- Grocery items and grocery store data

## Implementation Plan
1. Update `main.mo` — new stores, items, price data
2. Update frontend App.tsx — rebrand name, icon, descriptions
3. Update PricesTable, BestDeals, BasketBuilder — currency symbol ₹
