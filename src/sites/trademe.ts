import { Site } from "./site";

const parsePrice = (price: string) => {
  price = price.split(" ")[0];
  price = price.replace("$", "");
  if (price.includes(",")) {
    price = price.replace(",", "");
  }
  return parseInt(price);
};

export default {
  checkHref: (site) => site.includes("trademe"),
  createObserver: (callbackFn) => {
    const targetNode = document.getElementsByClassName(
      "tm-search-results__row",
    )[0];
    const observerTradeMe = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
          callbackFn();
        }
      });
    });
    const configTradeMe = { childList: true, subtree: true };
    observerTradeMe.observe(targetNode, configTradeMe);
    return observerTradeMe;
  },
  getElements: () => {
    const prices = document.getElementsByClassName(
      "tm-property-search-card-price-attribute__price",
    );
    const rooms = document.getElementsByName("bedroom");
    // @ts-ignore
    const bedrooms = [...rooms].map((room) => room.nextSibling.innerText);

    console.log("bedrooms", bedrooms);

    return [...prices].map((priceElement, index) => ({
      // @ts-ignore
      price: parsePrice(priceElement.innerText),
      priceElement,
      rooms: bedrooms[index],
    }));
  },
} as Site;
