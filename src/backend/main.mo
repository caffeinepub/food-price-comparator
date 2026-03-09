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

  let stores : [Store] = [
    { name = "Walmart"; id = "WAL" },
    { name = "Kroger"; id = "KRO" },
    { name = "Target"; id = "TAR" },
    { name = "Aldi"; id = "ALD" },
  ];

  let items : [Item] = [
    { name = "Apple"; id = "apple" },
    { name = "Banana"; id = "banana" },
    { name = "Milk"; id = "milk" },
    { name = "Bread"; id = "bread" },
    { name = "Eggs"; id = "eggs" },
    { name = "Chicken Breast"; id = "chicken_breast" },
    { name = "Rice"; id = "rice" },
    { name = "Orange Juice"; id = "orange_juice" },
  ];

  let prices : [Price] = [
    { itemId = "apple"; storeId = "WAL"; price = 0.5 },
    { itemId = "banana"; storeId = "WAL"; price = 0.3 },
    { itemId = "milk"; storeId = "WAL"; price = 1.2 },
    { itemId = "bread"; storeId = "WAL"; price = 1.0 },
    { itemId = "eggs"; storeId = "WAL"; price = 2.0 },
    { itemId = "chicken_breast"; storeId = "WAL"; price = 5.0 },
    { itemId = "rice"; storeId = "WAL"; price = 2.5 },
    { itemId = "orange_juice"; storeId = "WAL"; price = 3.0 },
    { itemId = "apple"; storeId = "KRO"; price = 0.55 },
    { itemId = "banana"; storeId = "KRO"; price = 0.28 },
    { itemId = "milk"; storeId = "KRO"; price = 1.15 },
    { itemId = "bread"; storeId = "KRO"; price = 1.1 },
    { itemId = "eggs"; storeId = "KRO"; price = 1.95 },
    { itemId = "chicken_breast"; storeId = "KRO"; price = 5.5 },
    { itemId = "rice"; storeId = "KRO"; price = 2.6 },
    { itemId = "orange_juice"; storeId = "KRO"; price = 2.9 },
    { itemId = "apple"; storeId = "TAR"; price = 0.6 },
    { itemId = "banana"; storeId = "TAR"; price = 0.35 },
    { itemId = "milk"; storeId = "TAR"; price = 1.25 },
    { itemId = "bread"; storeId = "TAR"; price = 1.05 },
    { itemId = "eggs"; storeId = "TAR"; price = 2.1 },
    { itemId = "chicken_breast"; storeId = "TAR"; price = 5.2 },
    { itemId = "rice"; storeId = "TAR"; price = 2.4 },
    { itemId = "orange_juice"; storeId = "TAR"; price = 3.1 },
    { itemId = "apple"; storeId = "ALD"; price = 0.48 },
    { itemId = "banana"; storeId = "ALD"; price = 0.29 },
    { itemId = "milk"; storeId = "ALD"; price = 1.1 },
    { itemId = "bread"; storeId = "ALD"; price = 0.95 },
    { itemId = "eggs"; storeId = "ALD"; price = 1.89 },
    { itemId = "chicken_breast"; storeId = "ALD"; price = 4.90 },
    { itemId = "rice"; storeId = "ALD"; price = 2.3 },
    { itemId = "orange_juice"; storeId = "ALD"; price = 2.95 },
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
        var bestPrice = 999.99;

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
