/*
  Functions used to run tests on the BITBOX repo.
*/

"use strict";

const shell = require("shelljs");
const telegram = require("./telegram");
const utils = require("./util");
const config = require("../config");

class Tests {
  constructor() {}

  // Parent function called by the BVT.
  async runTests() {
    this.installBchjs();
    utils.log(`bch-js dependencies installed.`);

    await this.runUnitTests();

    await this.runIntegrationTests();

    await this.runTestnetIntegrationTests();

    utils.log(`bch-js tests complete.`)
    utils.log(` `)
  }

  // Install the bch-js repository.
  installBchjs() {
    try {
      utils.clearUutDir();

      shell.cd(`${__dirname}`); // Ensure the function is on a known directory path

      shell.cd(`${__dirname}/../uut`);
      shell.exec(`git clone https://github.com/christroutner/bch-js`);

      shell.cd(`bch-js`);
      shell.exec(`npm install > ${__dirname}/../html/logs/bitbox/install.txt`);
    } catch (err) {
      console.log(`Error in installBitbox(): `, err);
    }
  }

  // Unit Tests
  runUnitTests() {
    return new Promise((resolve, reject) => {
      try {
        shell.cd(`${__dirname}`); // Ensure the function is on a known directory path
        shell.cd(`${__dirname}/../uut/bch-js`);

        const execStr = `npm run test > ${__dirname}/../html/logs/bitbox/unit-test.txt`;
        shell.exec(execStr, async function(code, stdout, stderr) {
          // A unit test failed.
          if (code !== 0) {
            utils.log(`bch-js unit tests: FAILED`);

            await telegram.send(
              `bch-js unit test failed. Details here: ${
                config.bvtServer
              }/bitbox/unit-tests.html`
            );
            // All unit tests succeeded.
          } else {
            utils.log(`bch-js unit tests: OK`);
          }

          resolve();
        });
      } catch (err) {
        console.log(`Error in bch-js.js/runUnitTests(): `, err);
        reject(err);
      }
    });
  }

  // Integration Tests
  async runIntegrationTests() {
    return new Promise((resolve, reject) => {
      try {
        shell.cd(`${__dirname}`); // Ensure the function is on a known directory path
        shell.cd(`${__dirname}/../uut/bch-js`);

        const execStr = `BCHJSTOKEN=${config.apiToken} npm run test:integration > ${__dirname}/../html/logs/bitbox/integration-test.txt`;

        shell.exec(execStr, async function(code, stdout, stderr) {
          if (code !== 0) {
            utils.log(`bch-js integration tests: FAILED`);

            await telegram.send(
              `bch-js integration test failed. Details here: ${
                config.bvtServer
              }/bitbox/integration-tests.html`
            );

            // All integration tests succeeded.
          } else {
            utils.log(`bch-js integration tests: OK`);
          }

          resolve();
        });
      } catch (err) {
        console.log(`Error in bch-js.js/runIntegrationTests(): `, err);
        reject(err);
      }
    });
  }

  // Integration Tests
  async runTestnetIntegrationTests() {
    return new Promise((resolve, reject) => {
      try {
        shell.cd(`${__dirname}`); // Ensure the function is on a known directory path
        shell.cd(`${__dirname}/../uut/bch-js`);

        // console.log(`BCHJSTOKEN: ${process.env.BCHJSTOKEN}`)

        const execStr = `BCHJSTOKEN=${process.env.BCHJSTOKEN} npm run test:integration:testnet > ${__dirname}/../html/logs/bitbox/testnet-test.txt`;

        shell.exec(execStr, async function(code, stdout, stderr) {
          if (code !== 0) {
            utils.log(`bch-js testnet tests: FAILED`);

            await telegram.send(
              `bch-js testnet tests failed. Details here: ${
                config.bvtServer
              }/bitbox/testnet-tests.html`
            );

            // All testnet tests succeeded.
          } else {
            utils.log(`bch-js testnet tests: OK`);
          }

          resolve();
        });
      } catch (err) {
        console.log(`Error in bch-js.js/runTestnetIntegrationTests(): `, err);
        reject(err);
      }
    });
  }
}

module.exports = Tests;