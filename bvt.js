/*
  BVT = Build Verification Test
  A BVT ensures the units under test can build, successfully run all classes
  of tests, and verifies that production servers are operating as expected.

  BVT tests the products in this order:
  - liveness
  - rest
  - BITBOX
  - slp-sdk

  BVT runs tests in this order:
  - unit
  - integration
  - e2e
*/

"use strict";

const PERIOD = 60000 * 60 * 4; // 4 hrs
//const PERIOD = 60000 * 60

const GARBAGE_PERIOD = 60000 * 60 * 24; // 1 day
//const GARBAGE_PERIOD = 60000 * 60 * 4 // 4 hours

const utils = require("./lib/util");

const Liveness = require("./lib/liveness");
const liveness = new Liveness();

const REST = require("./lib/rest");
const rest = new REST()

// const BITBOX = require("./lib/bitbox")
// const bitbox = new BITBOX()

// const SLPSDK = require("./lib/slp-sdk")
// const slpsdk = new SLPSDK()

// Used for debugging and iterrogating JS objects.
const util = require("util");
util.inspect.defaultOptions = { depth: 1 };

// Have the BVT run all tests.
async function runTests() {
  try {
    // Cleanup old data and prepare for a new run of tests.
    utils.clearUutDir();
    utils.clearLogs();
    utils.log(`Prepared BVT for new run.`);

    // Initialize the logs.
    const startTime = new Date();
    await utils.logAll(`BVT tests started...`);

    // Run all liveness tests first.
    await liveness.runTests();

    // Run the suite of rest tests.
    await rest.runTests()

    // Run the suite of BITBOX tests.
    // await bitbox.runTests()

    // Run the suite of SLP-SDK tests.
    // await slpsdk.runTests()

    // Signal the tests have completed.
    const endTime = new Date();
    await utils.logAll(`...BVT tests completed.`);

    // Signal when the next run will be
    const nextRun = new Date(startTime.getTime() + PERIOD);
    await utils.logAll(
      `Next BVT run will be at ${nextRun.toLocaleString("en-US", {
        timeZone: "America/Los_Angeles"
      })}.`
    );
  } catch (err) {
    console.error(`Error in runTests(): `, err);
    utils.log(`Error running BVT: ${err.message}`);
  }
}

// Periodically run the BVT
setInterval(function() {
  runTests();
}, PERIOD);

// Also run the tests immediately
runTests();

// Run garbage collection once per day, to delete any old logs.
setInterval(function() {
  utils.collectGarbage();
}, GARBAGE_PERIOD);