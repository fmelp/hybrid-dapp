'use strict';
var fetch = require("node-fetch")
var Pact = require("../fe/node_modules/pact-lang-api/pact-lang-api.js")
var config = require("./config.json")

//compose url for api request
const apiHost = `https://${config.network.node}/chainweb/0.0/${config.network.networkId}/chain/${config.meta.chainId}/pact`

//current time - 15 secs
const creationTime = () => Math.round((new Date).getTime()/1000)-15

//poll a request key for result
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

async function localCW(pactCode) {
  const cmd = Pact.fetch.local({
    pactCode: pactCode,
    keyPairs: config.adminAccount.keypair,
    meta: Pact.lang.mkMeta("not-real", config.meta.chainId, config.meta.gasPrice, config.meta.gasLimit, creationTime(), config.meta.ttl)
    }, apiHost)
  const res = await cmd;
  return res;
}

async function localKuro(pactCode) {
  const cmd = Pact.fetch.local({
    pactCode: pactCode,
    keyPairs: config.adminAccount.keypair,
    meta: Pact.lang.mkMeta("not-real", config.meta.chainId, config.meta.gasPrice, config.meta.gasLimit, creationTime(), config.meta.ttl),
    envData: {
      [config.adminAccount.id] : {
        "keys": [config.adminAccount.keypair.publicKey],
        "pred": "keys-all"
      }
    }
    }, config.network.kuroUrls[0])
  const res = await cmd;
  return res;
}

async function sendCW(pactCode) {
  const reqKeys = await Pact.fetch.send({
    pactCode: pactCode,
    keyPairs: config.adminAccount.keypair,
    caps: [
      Pact.lang.mkCap("Gas capability", "description of gas cap", "coin.GAS", []),
      Pact.lang.mkCap("admin cap", "description admin cap", "hybrid-exchange.ADMIN", []),
    ],
    networkId: "testnet04",
    envData: {},
    meta: Pact.lang.mkMeta(config.adminAccount.id, "0", 0.00000001, 5000, creationTime(), 135)
  }, apiHost)
  return reqKeys;
}

async function sendKuro(pactCode, keysets) {
  const reqKeys = await Pact.fetch.send({
    pactCode: pactCode,
    keyPairs: config.adminAccount.keypair,
    caps: [
      Pact.lang.mkCap("Gas capability", "description of gas cap", "coin.GAS", []),
      Pact.lang.mkCap("admin cap", "description admin cap", "hybrid-token.ADMIN", []),
    ],
    networkId: "kuro",
    envData: {
      [config.adminAccount.id] : {
        "keys": [config.adminAccount.keypair.publicKey],
        "pred": "keys-all"
      }, ...keysets
    },
    meta: Pact.lang.mkMeta(config.adminAccount.id, "0", 0.00000001, 5000, creationTime(), 105)
  }, config.network.kuroUrls[0])
  return reqKeys;
}

module.exports = {
  creationTime: creationTime,
  apiHost: apiHost,
  pollResult: pollResult,
  sleep: sleep,
  convertDecimal: convertDecimal,
  sendKuro: sendKuro,
  sendCW: sendCW,
  localCW: localCW,
  localKuro: localKuro
}
