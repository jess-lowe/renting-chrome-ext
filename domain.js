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

Promise.all([getIdeal, getHardLimit]).then(([ideal, hard_limit]) => {
  updatePrice(ideal, hard_limit);
});

function updatePrice(ideal, hard_limit) {
  // Rest of your code here
  console.log(ideal);
  console.log(hard_limit);
  var x = document.getElementsByClassName("css-mgq8yx");
  var y = document.getElementsByClassName("css-18biwo");
  var z = [];
  for (i = 0; i < y.length; i++) {
    z.push(y[i].children[0].innerText[0]);
  }

  for (i = 0; i < x.length; i++) {
    var price = x[i].innerHTML;
    var bedrooms = z[i];
    if (price.includes(",")) {
      price = price.replace(",", "");
    }
    price.toLowerCase();

    if (price.includes("single")) {
      price = "single bedroom";
    }
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
    if (!price.match(/[0-9]/g)) {
      price = "No price";
    } else {
      price = price;
      price_per_bedroom = (price / bedrooms).toFixed(0);
      var styledPPB = '<em style="color:purple">$' + price_per_bedroom;
      // styled price_per_bed
      if (price_per_bedroom >= hard_limit) {
        styledPPB = '<em style="color:red">$' + price_per_bedroom;
      } else if (price_per_bedroom < hard_limit && price_per_bedroom >= ideal) {
        styledPPB = '<em style="color:orange">$' + price_per_bedroom;
      } else if (price_per_bedroom < ideal) {
        styledPPB = '<em style="color:green">$' + price_per_bedroom;
      }

      x[i].innerHTML = styledPPB + "pw per bedroom </em> - " + x[i].innerHTML;
    }
  }
}
// var x = document.getElementsByClassName("css-mgq8yx");
// var y = document.getElementsByClassName("css-18biwo");
// var z = [];
// for (i = 0; i < y.length; i++) {
//   z.push(y[i].children[0].innerText[0]);
// }

// for (i = 0; i < x.length; i++) {
//   var price = x[i].innerHTML;
//   var bedrooms = z[i];
//   if (price.includes(",")) {
//     price = price.replace(",", "");
//   }
//   price.toLowerCase();

//   if (price.includes("single")) {
//     price = "single bedroom";
//   }
//   //find just the numbers including decimals
//   // price = price.match(/[0-9]+/g);

//   if (price.includes("$")) {
//     price = price.split("$")[1];
//   }

//   if (price.includes("p")) {
//     price = price.split("p")[0];
//   }
//   //if price has no numbers

//   if (price.includes(" ")) {
//     price = price.split(" ")[0];
//   }

//   if (price.includes("<")) {
//     price = price.split("<")[0];
//   }
//   if (!price.match(/[0-9]/g)) {
//     price = "No price";
//   } else {
//     price = price;
//     price_per_bedroom = (price / bedrooms).toFixed(0);
//     var styledPPB = '<em style="color:purple">$' + price_per_bedroom;
//     // styled price_per_bed
//     if (price_per_bedroom >= hard_limit) {
//       styledPPB = '<em style="color:red">$' + price_per_bedroom;
//     } else if (price_per_bedroom < hard_limit && price_per_bedroom >= ideal) {
//       styledPPB = '<em style="color:orange">$' + price_per_bedroom;
//     } else if (price_per_bedroom < ideal) {
//       styledPPB = '<em style="color:green">$' + price_per_bedroom;
//     }

//     x[i].innerHTML = styledPPB + "pw per bedroom </em> - " + x[i].innerHTML;
//   }
// }
