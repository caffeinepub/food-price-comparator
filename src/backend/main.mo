import Array "mo:core/Array";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";

actor {
  type Store = {
    name : Text;
    id : Text;
  };

  module Store {
    public func compare(store1 : Store, store2 : Store) : Order.Order {
      Text.compare(store1.name, store2.name);
    };
  };

  type Item = {
    name : Text;
    id : Text;
  };

  module Item {
    public func compare(item1 : Item, item2 : Item) : Order.Order {
      Text.compare(item1.name, item2.name);
    };
  };

  type Price = {
    itemId : Text;
    storeId : Text;
    price : Float;
  };

  // Food delivery platforms
  let stores : [Store] = [
    { name = "Zomato";    id = "ZOM" },
    { name = "Swiggy";    id = "SWG" },
    { name = "Domino's";  id = "DOM" },
    { name = "EatSure";   id = "EAT" },
    { name = "Uber Eats"; id = "UBR" },
  ];

  // Food items
  let items : [Item] = [
    { name = "Burger";        id = "burger" },
    { name = "Pizza";         id = "pizza" },
    { name = "Biryani";       id = "biryani" },
    { name = "Pasta";         id = "pasta" },
    { name = "Sandwich";      id = "sandwich" },
    { name = "Noodles";       id = "noodles" },
    { name = "Paneer Tikka";  id = "paneer_tikka" },
    { name = "Chicken Wings"; id = "chicken_wings" },
    { name = "French Fries";  id = "french_fries" },
    { name = "Cold Drink";    id = "cold_drink" },
  ];

  // Prices in INR
  let prices : [Price] = [
    // Burger
    { itemId = "burger"; storeId = "ZOM"; price = 149.0 },
    { itemId = "burger"; storeId = "SWG"; price = 139.0 },
    { itemId = "burger"; storeId = "DOM"; price = 159.0 },
    { itemId = "burger"; storeId = "EAT"; price = 145.0 },
    { itemId = "burger"; storeId = "UBR"; price = 155.0 },
    // Pizza
    { itemId = "pizza"; storeId = "ZOM"; price = 299.0 },
    { itemId = "pizza"; storeId = "SWG"; price = 279.0 },
    { itemId = "pizza"; storeId = "DOM"; price = 249.0 },
    { itemId = "pizza"; storeId = "EAT"; price = 289.0 },
    { itemId = "pizza"; storeId = "UBR"; price = 309.0 },
    // Biryani
    { itemId = "biryani"; storeId = "ZOM"; price = 199.0 },
    { itemId = "biryani"; storeId = "SWG"; price = 189.0 },
    { itemId = "biryani"; storeId = "DOM"; price = 229.0 },
    { itemId = "biryani"; storeId = "EAT"; price = 179.0 },
    { itemId = "biryani"; storeId = "UBR"; price = 209.0 },
    // Pasta
    { itemId = "pasta"; storeId = "ZOM"; price = 179.0 },
    { itemId = "pasta"; storeId = "SWG"; price = 169.0 },
    { itemId = "pasta"; storeId = "DOM"; price = 189.0 },
    { itemId = "pasta"; storeId = "EAT"; price = 159.0 },
    { itemId = "pasta"; storeId = "UBR"; price = 185.0 },
    // Sandwich
    { itemId = "sandwich"; storeId = "ZOM"; price = 99.0 },
    { itemId = "sandwich"; storeId = "SWG"; price = 89.0 },
    { itemId = "sandwich"; storeId = "DOM"; price = 109.0 },
    { itemId = "sandwich"; storeId = "EAT"; price = 95.0 },
    { itemId = "sandwich"; storeId = "UBR"; price = 105.0 },
    // Noodles
    { itemId = "noodles"; storeId = "ZOM"; price = 129.0 },
    { itemId = "noodles"; storeId = "SWG"; price = 119.0 },
    { itemId = "noodles"; storeId = "DOM"; price = 139.0 },
    { itemId = "noodles"; storeId = "EAT"; price = 125.0 },
    { itemId = "noodles"; storeId = "UBR"; price = 135.0 },
    // Paneer Tikka
    { itemId = "paneer_tikka"; storeId = "ZOM"; price = 249.0 },
    { itemId = "paneer_tikka"; storeId = "SWG"; price = 239.0 },
    { itemId = "paneer_tikka"; storeId = "DOM"; price = 269.0 },
    { itemId = "paneer_tikka"; storeId = "EAT"; price = 229.0 },
    { itemId = "paneer_tikka"; storeId = "UBR"; price = 255.0 },
    // Chicken Wings
    { itemId = "chicken_wings"; storeId = "ZOM"; price = 219.0 },
    { itemId = "chicken_wings"; storeId = "SWG"; price = 209.0 },
    { itemId = "chicken_wings"; storeId = "DOM"; price = 199.0 },
    { itemId = "chicken_wings"; storeId = "EAT"; price = 225.0 },
    { itemId = "chicken_wings"; storeId = "UBR"; price = 229.0 },
    // French Fries
    { itemId = "french_fries"; storeId = "ZOM"; price = 79.0 },
    { itemId = "french_fries"; storeId = "SWG"; price = 69.0 },
    { itemId = "french_fries"; storeId = "DOM"; price = 89.0 },
    { itemId = "french_fries"; storeId = "EAT"; price = 75.0 },
    { itemId = "french_fries"; storeId = "UBR"; price = 85.0 },
    // Cold Drink
    { itemId = "cold_drink"; storeId = "ZOM"; price = 49.0 },
    { itemId = "cold_drink"; storeId = "SWG"; price = 45.0 },
    { itemId = "cold_drink"; storeId = "DOM"; price = 55.0 },
    { itemId = "cold_drink"; storeId = "EAT"; price = 49.0 },
    { itemId = "cold_drink"; storeId = "UBR"; price = 52.0 },
  ];

  public query ({ caller }) func getAllPrices() : async {
    items : [Item];
    stores : [Store];
    prices : [Price];
  } {
    {
      items;
      stores;
      prices;
    };
  };

  public query ({ caller }) func getBestDeals() : async [(Item, { store : Store; price : Float })] {
    items.map(
      func(item) {
        var bestStore = stores[0];
        var bestPrice = 999999.99;

        for (store in stores.values()) {
          let priceOpt = prices.find(func(p) { p.itemId == item.id and p.storeId == store.id });
          switch (priceOpt) {
            case (null) {};
            case (?p) {
              if (p.price < bestPrice) {
                bestPrice := p.price;
                bestStore := store;
              };
            };
          };
        };

        (
          item,
          {
            store = bestStore;
            price = bestPrice;
          },
        );
      }
    );
  };

  public query ({ caller }) func getBasketSuggestion(itemIds : [Text]) : async {
    totalPerStore : [(Store, Float)];
    bestStore : Store;
    bestTotal : Float;
  } {
    let storeTotals = stores.map(
      func(store) {
        var total : Float = 0;
        for (itemId in itemIds.values()) {
          let item = items.find(
            func(item) { Text.equal(item.id, itemId) }
          );
          switch (item) {
            case (null) { Runtime.trap("Item " # itemId # " not found") };
            case (?item) {
              let priceOpt = prices.find(func(p) { p.itemId == item.id and p.storeId == store.id });
              switch (priceOpt) {
                case (null) {
                  Runtime.trap("Price for " # itemId # " in store " # store.id # " not found");
                };
                case (?price) {
                  total += price.price;
                };
              };
            };
          };
        };
        (store, total);
      }
    );

    var bestStore = stores[0];
    var bestTotal = storeTotals[0].1;
    for (totalInfo in storeTotals.values()) {
      if (totalInfo.1 < bestTotal) {
        bestTotal := totalInfo.1;
        bestStore := totalInfo.0;
      };
    };

    {
      totalPerStore = storeTotals;
      bestStore;
      bestTotal;
    };
  };
};
