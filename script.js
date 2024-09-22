let getIdeal = new Promise((resolve) => {
  chrome.storage.sync.get(["ideal"], function (result) {
    console.log("Data retrieved:", result.ideal);
    resolve(result.ideal);
  });
});

let getHardLimit = new Promise((resolve) => {
  chrome.storage.sync.get(["hard_limit"], function (result) {
    console.log("Data retrieved:", result.hard_limit);
    resolve(result.hard_limit);
  });
});

let isUpdating = false;
let ideal;
let hard_limit;

Promise.all([getIdeal, getHardLimit]).then(
  ([ideal_budget, hard_limit_budget]) => {
    ideal = ideal_budget;
    hard_limit = hard_limit_budget;

    switch (true) {
      case window.location.href.includes("trademe"):
        rent = document.getElementsByClassName(
          "tm-property-search-card-price-attribute__price"
        );
        rooms = document.getElementsByName("bedroom");
        bedrooms = [];
        for (room of rooms) {
          bedrooms.push(parseInt(room.nextSibling.innerText));
        }

        console.log("bedrooms", bedrooms);
        const targetNode = document.getElementsByClassName(
          "tm-search-results__row"
        )[0];
        const observerTradeMe = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (
              mutation.type === "childList" &&
              mutation.addedNodes.length > 0
            ) {
              if (!isUpdating) {
                updateElements(rent, bedrooms);
              }
            }
          });
        });
        const configTradeMe = { childList: true, subtree: true };
        observerTradeMe.observe(targetNode, configTradeMe);

        updateElements(rent, bedrooms);
        break;

      case window.location.href.includes("domain"):
        var p = document.getElementsByClassName("css-mgq8yx");
        var r = document.getElementsByClassName("css-18biwo");
        var rooms = [];
        for (i = 0; i < r.length; i++) {
          rooms.push(parseInt(r[i].children[0].innerText[0]) || 1);
        }

        const observerDomain = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (
              mutation.type === "childList" &&
              mutation.addedNodes.length > 0
            ) {
              if (!isUpdating) {
                updateElements(p, rooms);
              }
            }
          });
        });
        const configDomain = { childList: true, subtree: true };
        observerDomain.observe(
          document.getElementsByClassName("css-8tedj6")[0],
          configDomain
        );
        if (p.length != r.length) {
          console.log("x and y not equal");
        }
        updateElements(p, rooms);
        break;

      default:
        console.log("No matching case for the current URL.");
        break;
    }
  }
);

function updateElements(pricesElements, roomsElements) {
  if (isUpdating) {
    return;
  }
  isUpdating = true;
  const elements = [...pricesElements]
    .map((item, index) => [item, roomsElements[index]])
    .forEach(([price, rooms]) => {
      console.log(price, rooms);
      if (!price.classList.contains("done")) {
        updatePrice(ideal, hard_limit, price, rooms);
        price.classList.add("done");
      }
    });
  isUpdating = false;
}

function updatePrice(ideal, hard_limit, priceElement, rooms) {
  ideal = parseInt(ideal);
  hard_limit = parseInt(hard_limit);
  let price = priceElement.innerHTML;
  let bedrooms = rooms;
  if (window.location.href.includes("trademe")) {
    price = parsePriceTradeMe(price);
  } else if (window.location.href.includes("domain")) {
    if (bedrooms == 0 || bedrooms == 1) {
      bedrooms = 1;
    }
    price = parsePriceDomain(price);
  }
  if (price.match(/[0-9]/g)) {
    price = parseInt(price);
    price_per_bedroom = parseInt((price / bedrooms).toFixed(0));
    var styledPPB = '<em style="color:purple">$' + price_per_bedroom;

    if (price_per_bedroom >= hard_limit) {
      styledPPB = '<em style="color:red">$' + price_per_bedroom;
      //hide the ones over budget;
      // a = document.getElementsByClassName("css-1qp9106")[i].style.display =
      //   "none";
    } else if (price_per_bedroom < hard_limit && price_per_bedroom >= ideal) {
      styledPPB = '<em style="color:orange">$' + price_per_bedroom;
    } else if (price_per_bedroom < ideal) {
      styledPPB = '<em style="color:green">$' + price_per_bedroom;
    }
    priceElement.innerHTML =
      styledPPB + "pw per bedroom </em> - " + priceElement.innerHTML;
  }
}

function parsePriceDomain(price) {
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

  return price;
}

function parsePriceTradeMe(price) {
  price = price.split(" ")[0];
  price = price.replace("$", "");
  return price;
}
