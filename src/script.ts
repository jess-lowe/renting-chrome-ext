import sites from "./sites/index";
import { SiteData } from "./sites/site";

let getIdeal = new Promise<number>((resolve) => {
  chrome.storage.sync.get(["ideal"], function (result) {
    console.log("Data retrieved:", result.ideal);
    resolve(parseInt(result.ideal));
  });
});

let getHardLimit = new Promise<number>((resolve) => {
  chrome.storage.sync.get(["hard_limit"], function (result) {
    console.log("Data retrieved:", result.hard_limit);
    resolve(parseInt(result.hard_limit));
  });
});

Promise.all([getIdeal, getHardLimit]).then(([ideal, hard]) => {
  const site = sites.find(({ checkHref: checkUrl }) =>
    checkUrl(window.location.href),
  );

  if (!site) {
    return;
  }

  let isUpdating = false;

  const updateFn = () => {
    if (isUpdating) {
      return;
    }

    isUpdating = true;

    site
      .getElements()
      .filter(({ priceElement }) => priceElement.classList.contains("done"))
      .forEach((data) => {
        updatePrice({ ideal, hard, data });
        data.priceElement.classList.add("done");
      });

    isUpdating = false;
  };

  site.createObserver(updateFn);
  updateFn();
});

const updatePrice = ({
  ideal,
  hard,
  data: { priceElement, price, rooms },
}: {
  ideal: number;
  hard: number;
  data: SiteData;
}) => {
  let pricePerBedroom = parseInt((price / rooms).toFixed(0));
  var styledPPB = '<em style="color:purple">$' + pricePerBedroom;

  if (pricePerBedroom >= hard) {
    styledPPB = '<em style="color:red">$' + pricePerBedroom;
    //hide the ones over budget;
    // a = document.getElementsByClassName("css-1qp9106")[i].style.display =
    //   "none";
  } else if (pricePerBedroom < hard && pricePerBedroom >= ideal) {
    styledPPB = '<em style="color:orange">$' + pricePerBedroom;
  } else if (pricePerBedroom < ideal) {
    styledPPB = '<em style="color:green">$' + pricePerBedroom;
  }

  priceElement.innerHTML =
    styledPPB + "pw per bedroom </em> - " + priceElement.innerHTML;
  return;
};
