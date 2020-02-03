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

// async function cwListenOne() {
//   // let debits = [];
//   let credits = [];
//   let confs = [];
//   // let rejs = [];
//   let accounts = [];
//   try {
//     const cmd = Pact.fetch.local({
//     pactCode: `(map (user.hybrid-exchange.get-tx) (user.hybrid-exchange.get-tx-keys))`,
//       keyPairs: config.adminAccount.keypair,
//       // caps: [Pact.lang.mkCap("Gas capability", "description of gas cap", "coin.GAS", [])],
//           //account name, chain id, gas price, gas limit, creation time, time-to-live
//           meta: Pact.lang.mkMeta("not-real", config.meta.chainId, config.meta.gasPrice, config.meta.gasLimit, utils.creationTime(), config.meta.ttl)
//       }, utils.apiHost)
//       const res = await cmd;
//       const open = res.result.data.filter(x => x.status === 'open');
//       console.log(open);
//       if (open.length !== 0) {
//         //format pact commands
//         res.result.data.map((x, i) => {
//           // debits.push(`(user.hybrid-exchange.debit-ht ${JSON.stringify(x.account)} ${utils.convertDecimal(x.amount)})`)
//           credits.push(`(hybrid-token.create-and-credit-ht ${JSON.stringify(x.account)} (read-keyset ${JSON.stringify(x.account)}) ${utils.convertDecimal(x.amount)})`)
//           confs.push(`(user.hybrid-exchange.confirm-transfer-to-kuro ${JSON.stringify(x.account + "-" + x.time)})`)
//           // rejs.push(`(user.hybrid-exchange.reject-transfer-to-kuro ${x.account + "-" + x.time})`)
//           accounts.push(x.account);
//         })
//         console.log(debits, credits, confs)
//         //get only unique accounts
//         const acctsSet = new Set(accounts);
//         const acctsUniq = [...acctsSet];
//         //get guards
//         const cmdGuards = Pact.fetch.local({
//           pactCode: `(map (coin.details) ${JSON.stringify(acctsUniq)})`,
//           keyPairs: config.adminAccount.keypair,
//           caps: [Pact.lang.mkCap("Gas capability", "description of gas cap", "coin.GAS", [])],
//               //account name, chain id, gas price, gas limit, creation time, time-to-live
//               meta: Pact.lang.mkMeta("not-real", config.meta.chainId, config.meta.gasPrice, config.meta.gasLimit, utils.creationTime(), config.meta.ttl)
//           }, utils.apiHost)
//         const resGuards = await cmdGuards;
//         const guards = resGuards.result.data;
//         console.log(guards)
//         //debit -> DONT NEED TO  DO THIS
//         // const reqKeys = await Pact.fetch.send({
//         //   pactCode: debits.join(" "),
//         //   keyPairs: config.adminAccount.keypair,
//         //   caps: [
//         //     Pact.lang.mkCap("Gas capability", "description of gas cap", "coin.GAS", []),
//         //     Pact.lang.mkCap("admin cap", "description admin cap", "hybrid-exchange.ADMIN", []),
//         //   ],
//         //   networkId: "testnet04",
//         //   envData: {},
//         //   meta: Pact.lang.mkMeta(config.adminAccount.id, "0", 0.00000001, 5000, utils.creationTime(), 105)
//         // }, utils.apiHost)
//         // console.log(reqKeys);
//         // console.log('sleeping 90 secs...')
//         // await utils.sleep(90000)
//         // const pollRes = await Pact.fetch.poll({ requestKeys: reqKeys.requestKeys }, utils.apiHost)
//         // console.log('debits poll')
//         // console.log(pollRes)
//         // if (Object.keys(pollRes).length !== 0 && res.result.status === "success") {
//           //credit on kuro
//           let keysets = {};
//           guards.map((x, i) => {
//             keysets = {
//               [x.account]: {
//                 "keys": x.guard.keys,
//                 "pred": x.guard.pred
//               }
//             , ...keysets}
//           })
//           console.log("keysets")
//           console.log(keysets);
//           console.log({
//             [config.adminAccount.id] : {
//               "keys": [config.adminAccount.keypair.publicKey],
//               "pred": "keys-all"
//             }, ...keysets
//           })
//           const reqKeysKuro = await Pact.fetch.send({
//             pactCode: credits.join(" "),
//             keyPairs: config.adminAccount.keypair,
//             caps: [
//               Pact.lang.mkCap("Gas capability", "description of gas cap", "coin.GAS", []),
//               Pact.lang.mkCap("admin cap", "description admin cap", "hybrid-token.ADMIN", []),
//             ],
//             networkId: "kuro",
//             envData: {
//               [config.adminAccount.id] : {
//                 "keys": [config.adminAccount.keypair.publicKey],
//                 "pred": "keys-all"
//               }, ...keysets
//             },
//             meta: Pact.lang.mkMeta(config.adminAccount.id, "0", 0.00000001, 5000, utils.creationTime(), 105)
//           }, config.network.kuroUrls[0])
//           console.log(reqKeysKuro);
//           const kuroRes = await Pact.fetch.listen({ listen: reqKeysKuro.requestKeys[0] }, config.network.kuroUrls[0])
//           console.log('credits poll')
//           console.log(kuroRes)
//           if (kuroRes.result.status === "success") {
//             //confirm in chainweb
//             const confReq = await Pact.fetch.send({
//               pactCode: confs.join(" "),
//               keyPairs: config.adminAccount.keypair,
//               caps: [
//                 Pact.lang.mkCap("Gas capability", "description of gas cap", "coin.GAS", []),
//                 Pact.lang.mkCap("admin cap", "description admin cap", "hybrid-exchange.ADMIN", []),
//               ],
//               networkId: "testnet04",
//               envData: {},
//               meta: Pact.lang.mkMeta(config.adminAccount.id, "0", 0.00000001, 5000, utils.creationTime(), 105)
//             }, utils.apiHost)
//             console.log('sleeping 90 secs...')
//             await utils.sleep(90000)
//             const confRes = await Pact.fetch.poll({ requestKeys: confReq.requestKeys }, utils.apiHost)
//             console.log(confRes);
//             if (Object.keys(confRes).length !== 0 && confRes[confReq.requestKeys[0]].result.status === "success") {
//               console.log("transfers to kuro successfully completed");
//               cwListen();
//             } else {
//               //confirmation on cw failed
//               console.log("confirmations on kuro failed. Stopping work on these tx's");
//               console.log(confs);
//             }
//           } else {
//             //error credit in kuro
//             console.log("credits on kuro failed. Stopping work on these tx's");
//             console.log(credits);
//           }
//
//         // } else {
//         //   //debits on cw failed
//         //   console.log("debits on chainweb failed, sleeping 30 secs then trying again. failed txs:")
//         //   console.log(debits)
//         //   //potentially mark them all as rejected??
//         //   await utils.sleep(30000);
//         //   cwListen();
//         // }
//
//         //recall cwListen()
//     } else {
//       //no open tx's
//       //sleep 30 secs and repeat function
//       await utils.sleep(30000);
//       cwListen();
//     }
//   } catch(e) {
//     //stop function for now
//     console.log("something went wrong in try/catch");
//     console.log(e);
//   }
// }
//
