# renting-chrome-ext

A chrome extension for getting the price of a place per bedroom - currently only on domain.com.au

## Overview

## Running this extension

1. Clone this repository.
2. Install dependencies: `npm i`
3. Build the extension: `npm run build`
4. **(Optional if developing)**: run `npm run build --watch` to run webpack in watch mode so that it will auto recomplie the code
5. Load this directory in Chrome as an [unpacked extension](https://developer.chrome.com/docs/extensions/mv3/getstarted/development-basics/#load-unpacked).
6. Click the extension's action icon to open the options page.
7. Once a user script has been configured, visit https://domain.com.au/.

## Features

When you navigate to a rental page on domain.com.au, you should be able to see the price per bedroom and change your budget settings in the popup.


