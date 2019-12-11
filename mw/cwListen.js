
//kuro.credit
  //wait for confirm of credit (store reqKey + kuro+credit + account + amount + timestamp)
//cw.mark-complete
  //wait for confirm of complete (store reqKey + cw-kuro-trans + id + timestamp)

async function cwListen() {
  let debits = [];
  let credits = [];
  let confs = [];
  //perform cw.check-status every 30 seconds
  //returns list
  //loop through
  //if open append to three lists of composed commands
    //[(cw.debit ... ... ...)()()]
    //[(kuro.credit ... ... ...)()()]
    //[(cw.mark-complete ... ... ...)()()]

  // cw /send of composed debits
    //set ttl to 90secs
    //wait for confirm of debit (store reqKey + cw-debit + account + amount + timestamp)
    //sleep 90 secs
      //if success
        //(store reqKey + cw-debit + account + amount + timestamp)
      //else throw error to stop everything and append error to csv

  // kuro /send of composed credits
    //sleep 5 seconds
      //if success
        //(store reqKey + kuro-credit + account + amount + timestamp)
      //else throw error to stop everything and append error to csv

  //if none are open sleep 30 seconds
}
