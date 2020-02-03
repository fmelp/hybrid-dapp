var fetch = require("node-fetch")
var Pact = require("../fe/node_modules/pact-lang-api/pact-lang-api.js")
var config = require("./config.json")
var utils = require("./utils.js")

async function kuroListen() {
  let credits = [];
  let confs = [];
  let rejs = [];
  try {
    //get open txs
    const txsRes = await utils.localKuro(`(map (hybrid-token.get-tx) (hybrid-token.get-tx-keys))`);
    const txsOpen = txsRes.result.data.filter(x => x.status === 'open');
    if (txsOpen.length !== 0) {
      //prepare pact code
      txsOpen.map((x, i) => {
        credits.push(`(user.hybrid-exchange.credit-ht ${JSON.stringify(x.account)} ${utils.convertDecimal(x.amount)})`)
        confs.push(`(hybrid-token.confirm-transfer-to-cw ${JSON.stringify(x.account + "-" + x.time.int)})`)
        rejs.push(`(hybrid-token.reject-transfer-to-cw ${x.account + "-" + x.time.int})`)
      })
      //credit in chainweb
      const creditsRK = await utils.sendCW(credits.join(" "));
      await utils.sleep(120000)
      const creditsRes = await Pact.fetch.poll({ requestKeys: creditsRK.requestKeys }, utils.apiHost)
      if (Object.keys(creditsRes).length !== 0 && creditsRes[creditsRK.requestKeys[0]].result.status === "success") {
        //confirm in kuro
        const confsRK = await utils.sendKuro(confs.join(" "), {});
        const confsRes = await Pact.fetch.listen({ listen: confsRK.requestKeys[0] }, config.network.kuroUrls[0]);
        if (confsRes.result.status === "success") {
          console.log("transfers to chainweb successfully completed");
          //repeat function
          kuroListen();
        } else {
          console.log("Stopping Kuro listen. Something went wrong during the confirmations");
          console.log(confs)
        }
      } else {
        //credits on cw failed, reject the transfer request in kuro
        console.log("credits on chainweb failed. Rejecting requests and refunding money");
        const rejsRK = await utils.sendKuro(rejs.join(" "), {});
        const rejsRes = await Pact.fetch.listen({ listen: rejsRK.requestKeys[0] }, config.network.kuroUrls[0]);
        if (rejsRes.result.status === "success") {
          console.log("transfers to chainweb have failed, money returned to user on Kuro");
          kuroListen();
        } else {
          //rejects failed, stop mw to check errors
          console.log("Stopping Kuro listen. Something went wrong during the rejections");
          console.log(rejs)
        }
      }
    } else {
      //no open tx's
      //sleep 30 secs and repeat function
      await utils.sleep(30000);
      kuroListen();
    }
  } catch(e) {
    console.log("Stopping Kuro listen. Something went wrong in try/catch");
    console.log(e);
  }
}

kuroListen();
