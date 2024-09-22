import { Site } from "./site";

const parsePrice = (price: string) => {
  if (price.includes(",")) {
    price = price.replace(",", "");
  }
  price.toLowerCase();

  if (price.includes("single")) {
    price = "single bedroom";
  } else {
    //find just the numbers including decimals
    // price = price.match(/[0-9]+/g);

    if (price.includes("$")) {
      price = price.split("$")[1];
    }

    if (price.includes("p")) {
      price = price.split("p")[0];
    }
    //if price has no numbers

    if (price.includes(" ")) {
      price = price.split(" ")[0];
    }

    if (price.includes("<")) {
      price = price.split("<")[0];
    }
  }

  return parseInt(price);
};

export default {
  checkHref: (domain) => domain.includes("domain"),

  getElements: () => {
    const pricesElements = document.getElementsByClassName("css-mgq8yx");
    const roomsElements = document.getElementsByClassName("css-18biwo");

    const rooms: number[] = [];
    for (let i = 0; i < roomsElements.length; i++) {
      // @ts-ignore
      rooms.push(parseInt(roomsElements[i].children[0].innerText[0]) || 1);
    }

    if (pricesElements.length < rooms.length) {
      console.log("x != y");
      return [];
    }

    return [...pricesElements].map((priceElement, index) => ({
      rooms: Math.max(1, rooms[index]),
      priceElement,
      price: parsePrice(priceElement.innerHTML),
    }));
  },

  createObserver: (updateFn) => {
    const observerDomain = new MutationObserver((mutations) =>
      mutations.forEach((mutation) => {
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
          updateFn();
        }
      }),
    );
    const configDomain = { childList: true, subtree: true };
    observerDomain.observe(
      document.getElementsByClassName("css-8tedj6")[0],
      configDomain,
    );

    return observerDomain;
  },
} as Site;
