'use strict';
var fetch = require("node-fetch")
var Pact = require("../fe/node_modules/pact-lang-api/pact-lang-api.js")
var config = require("./config.json")

//compose url for api request
//NOTE: must be changed to mainnet when change is made
const apiHost = `https://${config.network.node}.testnet.chainweb.com/chainweb/0.0/${config.network.networkId}/chain/${config.meta.chainId}/pact`


//current time - 15 secs
const creationTime = () => Math.round((new Date).getTime()/1000)-15

//poll a request key for result
//right now only consolelogs result
var pollResult = async function(reqKey) {
  Pact.fetch.poll({"requestKeys": [reqKey]}, apiHost).then(r => {
    if (r[reqKey].result.status === "failure") {
      console.log("TX FAILED WITH ERROR: ", r[reqKey].result.status.error)
    } else {
      console.log("TX SUCCESS ", r)
    }
  })
}

var sleep = async function (ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

var convertDecimal = (decimal) => {
  decimal = decimal.toString();
  if (decimal.includes('.')) { return decimal }
  if ((decimal / Math.floor(decimal)) === 1) {
    decimal = decimal + ".0"
  }
  return decimal
}

module.exports = {
  creationTime: creationTime,
  apiHost: apiHost,
  pollResult: pollResult,
  sleep: sleep,
  convertDecimal: convertDecimal
}
