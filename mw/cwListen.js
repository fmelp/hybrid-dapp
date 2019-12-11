var fetch = require("node-fetch")
var Pact = require("../fe/node_modules/pact-lang-api/pact-lang-api.js")
var config = require("./config.json")
var utils = require("./utils.js")

//kuro.credit
  //wait for confirm of credit (store reqKey + kuro+credit + account + amount + timestamp)
//cw.mark-complete
  //wait for confirm of complete (store reqKey + cw-kuro-trans + id + timestamp)

async function cwListen() {
  let debits = [];
  let credits = [];
  let confs = [];
  const cmd = Pact.fetch.local({
  pactCode: `(map (user.hybrid-exchange.get-tx) (user.hybrid-exchange.get-tx-keys))`,
    keyPairs: config.adminAccount.keypair,
    caps: [Pact.lang.mkCap("Gas capability", "description of gas cap", "coin.GAS", [])],
        //account name, chain id, gas price, gas limit, creation time, time-to-live
        meta: Pact.lang.mkMeta("not-real", config.meta.chainId, config.meta.gasPrice, config.meta.gasLimit, utils.creationTime(), config.meta.ttl)
    }, utils.apiHost)
    const res = await cmd;
    console.log(res.result.data);
    const open = res.result.data.filter(x => x.status === 'open');
    if (open.length !== 0) {
      //format pact commands
      res.result.data.map((x) => {
        debits.push(`(user.hybrid-exchange.debit-ht ${JSON.stringify(x.account)} ${utils.convertDecimal(x.amount)})`)
        credits.push(`(user.hybrid-exchange)`)
        confs.push(`(user.hybrid-exchange)`)
      })
      console.log(debits)
    } else {
      //sleep for 30 seconds before repeating function
      await utils.sleep(30000);
    }

  //returns list
  //loop through
  //if open append to three lists of composed commands
    //[(cw.debit ... ... ...)()()]
    //[(kuro.credit ... ... ...)()()]
    //[(cw.mark-complete ... ... ...)()()]

  //if lists not empty
    // cw /send of composed debitsy
      //set ttl to 90secs
      //wait for confirm of debit (store reqKey + cw-debit + [accounts] + [amounts] + timestamp)
      //sleep 90 secs
        //poll req reqkey if success
          //(store reqKey + cw-debit + [accounts] + [amounts] + timestamp)
        //else throw error to stop everything and append error to csv

    // kuro /send of composed credits
      //sleep 5 seconds
        //poll req reqkey if success
          //(store reqKey + kuro-credit + [account] + [amount] + timestamp)
        //else throw error to stop everything and append error to csv

    //cw send of composed confs
      //set ttl to 90secs
      //sleep 90secs
      //poll reqkey if success
        //(store reqKey + kuro-credit + [req-id] + timestamp)
      //else throw error to stop everything and append error to csv


  //(else) if lists empty sleep 30 seconds
}

cwListen()
