var fetch = require("node-fetch")
var Pact = require("../fe/node_modules/pact-lang-api/pact-lang-api.js")
var config = require("./config.json")
var utils = require("./utils.js")


async function cwListen() {
  let credits = [];
  let confs = [];
  let accounts = [];
  let rejs = [];
  try {
    const txsRes = await utils.localCW(`(map (user.hybrid-exchange.get-tx) (user.hybrid-exchange.get-tx-keys))`);
    const txsOpen = txsRes.result.data.filter(x => x.status === 'open');
    if (txsOpen.length !== 0) {
      //prepare pact code
      txsOpen.map((x, i) => {
        credits.push(`(hybrid-token.create-and-credit-ht ${JSON.stringify(x.account)} (read-keyset ${JSON.stringify(x.account)}) ${utils.convertDecimal(x.amount)})`)
        confs.push(`(user.hybrid-exchange.confirm-transfer-to-kuro ${JSON.stringify(x.account + "-" + x.time)})`)
        rejs.push(`(user.hybrid-exchange.reject-transfer-to-kuro ${x.account + "-" + x.time})`)
        accounts.push(x.account);
      })
      //get only unique accounts
      const acctsSet = new Set(accounts);
      const acctsUniq = [...acctsSet];
      //get guards
      const guardsRes = await utils.localCW(`(map (coin.details) ${JSON.stringify(acctsUniq)})`);
      const guards = guardsRes.result.data;
      //format keysets
      let keysets = {};
      guards.map((x, i) => {
        keysets = {
          [x.account]: {
            "keys": x.guard.keys,
            "pred": x.guard.pred
          }
        , ...keysets}
      })
      const creditsRK = await utils.sendKuro(credits.join(" "), keysets);
      //listen to tx since its almost instant
      const creditsRes = await Pact.fetch.listen({ listen: creditsRK.requestKeys[0] }, config.network.kuroUrls[0]);
      if (creditsRes.result.status === "success") {
        //confirm tx in cw
        const confRK = await utils.sendCW(confs.join(" "));
        await utils.sleep(120000)
        const confRes = await Pact.fetch.poll({ requestKeys: confRK.requestKeys }, utils.apiHost)
        if (Object.keys(confRK).length !== 0 && confRes[confRK.requestKeys[0]].result.status === "success") {
          console.log("transfers to kuro successfully completed");
          //repeat function
          cwListen();
        } else {
          //confirmation on cw failed
          console.log("confirmations on chainweb failed. Stopping middleware for manual inspection");
          console.log(confs);
        }
      } else {
        //credits in kuro failed
        console.log("one or more credits in kuro have failed. Rejecting all transfers and returning money to user")
        //reject and refund request in CW
        const rejsRK = await utils.sendCW(rejs.join(" "));
        await utils.sleep(120000)
        const rejsRes = await Pact.fetch.poll({ requestKeys: rejsRK.requestKeys }, utils.apiHost)
        if (Object.keys(rejsRes).length !== 0 && rejsRes[rejsRK.requestKeys[0]].result.status === "success") {
          console.log("transfers rejected and money returned to users");
          console.log(rejs)
          //repeat function
          cwListen();
        } else {
          //confirmation on cw failed
          console.log("rejections on chainweb failed. Stopping middleware for manual inspection");
          console.log(rejs);
        }
      }
    } else {
      //no open tx's
      //sleep 30 secs and repeat function
      await utils.sleep(30000);
      cwListen();
    }
  } catch(e) {
    console.log("Stopping CW listen. Something went wrong in try/catch");
    console.log(e);
  }
}

cwListen()
