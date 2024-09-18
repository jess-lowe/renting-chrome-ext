// Copyright 2023 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const SAVE_BUTTON_ID = "save-button";
const TYPE_IDEAL_BUDGET = "ideal";
const TYPE_HARD_LIMIT = "hard_limit";
const FORM_ID = "settings-form";
const FORM = document.getElementById(FORM_ID);
const IDEAL = document.getElementById(TYPE_IDEAL_BUDGET);
const HARD_LIMIT = document.getElementById(TYPE_HARD_LIMIT);

async function updateUi() {
  // To retrieve data
  chrome.storage.sync.get(["ideal"], function (result) {
    if (result.ideal == undefined) {
      IDEAL.value = 200;
      console.log("undefined - ideal");
    } else {
      console.log("Data retrieved:", result.ideal);
      IDEAL.value = result.ideal;
    }
  });
  chrome.storage.sync.get(["hard_limit"], function (result) {
    if (result.hard_limit == undefined) {
      HARD_LIMIT.value = 1000;
      console.log("undefined - hardlimit");
    } else {
      HARD_LIMIT.value = result.hard_limit;
      console.log("Data retrieved:", result.hard_limit);
    }
  });
}

async function onSave() {
  const ideal = parseInt(IDEAL.value);
  console.log(ideal);
  const hard_limit = parseInt(HARD_LIMIT.value);
  console.log(hard_limit);
  // To save data
  chrome.storage.sync.set({ ideal: ideal, hard_limit: hard_limit }, () => {
    alert("Data saved");
  });
}

// Update UI immediately, and on any storage changes.
updateUi();
chrome.storage.sync.onChanged.addListener(updateUi);

// Register listener for save button click.
document.getElementById(SAVE_BUTTON_ID).addEventListener("click", onSave);
