import React from 'react';
import Pact from 'pact-lang-api';

const Context = React.createContext();

const hosts = ["us1","us2","eu1","eu2","ap1","ap2"]
const kuroUrls = ["http://54.166.153.21:9000", "http://54.146.43.204:9001", "http://34.204.71.247:9002", "http://54.164.36.85:9003"]
const chainIds = ["0","1",'2',"3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19"]
const createAPIHost = (network, chainId) => `https://${network}.testnet.chainweb.com/chainweb/0.0/testnet04/chain/${chainId}/pact`
const dumKeyPair = Pact.crypto.genKeyPair();

export class PactStore extends React.Component {

  state = {
    accountName: "",
    coinBalance: "n/a",
    cwBalance: "n/a",
    kuroBalance: "n/a"
  }

  convertDecimal = (decimal) => {
    decimal = decimal.toString();
    if (decimal.includes('.')) { return decimal }
    if ((decimal / Math.floor(decimal)) === 1) {
      decimal = decimal + ".0"
    }
    return decimal
  }

  setAccountName = async (str) => {
    this.setState({ accountName: str })
  }

  getCoinBalance = async () => {
    const cmd = await Pact.fetch.local({
      pactCode: `(coin.get-balance ${JSON.stringify(this.state.accountName)})`,
      keyPairs: dumKeyPair,
      caps: [Pact.lang.mkCap("Gas capability", "description of gas cap", "coin.GAS", [])],
      meta: Pact.lang.mkMeta("not-real", "0", 0.0000001, 5000, (Math.round((new Date).getTime()/1000)-15), 28800)
  }, createAPIHost(hosts[0], "0"))
    const data = await cmd;
    if (data.result.status === "success") {
      console.log(data.result.data.toString())
      await this.setState({ coinBalance: data.result.data.toString().substring(0,15) })
    }
  }

  buyHT = async (amount) => {
    amount = this.convertDecimal(amount)
    try {
      const signCmd = {
          pactCode: `(user.hybrid-exchange.buy-ht ${JSON.stringify(this.state.accountName)} ${amount})`,
          // pactCode: `(coin.transfer "sender01" "sender00" 1.0)`,
          caps: [
            Pact.lang.mkCap("Gas capability", "description of gas cap", "coin.GAS", []),
            // Pact.lang.mkCap("transfer capability", "description of transfer cap", "coin.TRANSFER", [this.state.playerId, "sender00", 5.0]),
            Pact.lang.mkCap("transfer capability", "description of transfer cap", "coin.TRANSFER", [this.state.accountName, "hybrid-mg", parseFloat(amount)]),
          ],
          sender: this.state.accountName,
          gasLimit: 5000,
          chainId: "0",
          ttl: 28800,
          envData: {}
        }
      const cmd = await Pact.wallet.sign(signCmd)
      console.log(cmd)
      console.log(cmd)
      const reqKey = await Pact.wallet.sendSigned(cmd, createAPIHost(hosts[0], "0"))
      console.log(reqKey.requestKeys[0])
    } catch(err){
      console.log(err);
      alert("you cancelled the TX or you did not have the wallet app open")
      window.location.reload();
    }
  }


  sellHT = async (amount) => {
    amount = this.convertDecimal(amount)
    try {
      const signCmd = {
          pactCode: `(user.hybrid-exchange.sell-ht ${JSON.stringify(this.state.accountName)} ${amount})`,
          // pactCode: `(coin.transfer "sender01" "sender00" 1.0)`,
          caps: [
            Pact.lang.mkCap("Gas capability", "description of gas cap", "coin.GAS", []),
            Pact.lang.mkCap("transfer capability", "description of transfer cap", "coin.TRANSFER", ["hybrid-mg", this.state.accountName, parseFloat(amount)]),
            Pact.lang.mkCap("Registered account capability", "is registered in hybrid-exchange", "user.hybrid-exchange.REGISTERED_USER", [this.state.accountName]),
          ],
          sender: this.state.accountName,
          gasLimit: 5000,
          chainId: "0",
          ttl: 28800,
          envData: {}
        }
      const cmd = await Pact.wallet.sign(signCmd)
      console.log(cmd)
      const reqKey = await Pact.wallet.sendSigned(cmd, createAPIHost(hosts[0], "0"))
      console.log(reqKey.requestKeys[0])
    } catch(err){
      console.log(err);
      alert("you cancelled the TX or you did not have the wallet app open")
      window.location.reload();
    }
  }

  getCWBalance = async () => {
    const cmd = await Pact.fetch.local({
      pactCode: `(user.hybrid-exchange.get-balance ${JSON.stringify(this.state.accountName)})`,
      keyPairs: dumKeyPair,
      caps: [Pact.lang.mkCap("Gas capability", "description of gas cap", "coin.GAS", [])],
      meta: Pact.lang.mkMeta("not-real", "0", 0.0000001, 5000, (Math.round((new Date).getTime()/1000)-15), 28800)
    }, createAPIHost(hosts[0], "0"))
    const data = await cmd;
    if (data.result.status === "success") {
      console.log(data.result.data.toString())
      await this.setState({ cwBalance: data.result.data.toString().substring(0,15) })
    }

  }


  getKuroBalance = async () => {
    const cmd = await Pact.fetch.local({
      pactCode: `(hybrid-token.get-balance ${JSON.stringify(this.state.accountName)})`,
      keyPairs: dumKeyPair
    }, kuroUrls[0])
    const data = await cmd.data;
    console.log(data);
    if (data !== undefined) {
      await this.setState({ kuroBalance: data.toString().substring(0,15)  })
      console.log(this.state.kuroBalance)
    }

  }

  transferCWKuro = async (amount) => {
    amount = this.convertDecimal(amount)
    try {
      const signCmd = {
          pactCode: `(user.hybrid-exchange.trans-to-priv ${JSON.stringify(this.state.accountName)} ${amount})`,
          caps: [
            Pact.lang.mkCap("Gas capability", "description of gas cap", "coin.GAS", []),
            Pact.lang.mkCap("Registered account capability", "is registered in hybrid-exchange", "user.hybrid-exchange.REGISTERED_USER", [this.state.accountName]),
          ],
          sender: this.state.accountName,
          gasLimit: 100000,
          chainId: "0",
          ttl: 28800,
          envData: {}
        }
      const cmd = await Pact.wallet.sign(signCmd)
      const reqKey = await Pact.wallet.sendSigned(cmd, createAPIHost(hosts[0], "0"))
      console.log(reqKey.requestKeys[0])
    } catch(err){
      console.log(err);
      alert("you cancelled the TX or you did not have the wallet app open")
      window.location.reload();
    }
  }

  transferKuroCW = async (amount) => {
    amount = this.convertDecimal(amount)
    try {
      const signCmd = {
          pactCode: `(hybrid-token.transfer-to-cw ${JSON.stringify(this.state.accountName)} ${amount})`,
          caps: [
            Pact.lang.mkCap("Gas capability", "description of gas cap", "coin.GAS", []),
          ],
          sender: this.state.accountName,
          gasLimit: 100000,
          chainId: "0",
          ttl: 28800,
          envData: {}
        }
      const cmd = await Pact.wallet.sign(signCmd)
      const reqKey = await Pact.wallet.sendSigned(cmd, kuroUrls[0])
      console.log(reqKey.requestKeys[0])
    } catch(err){
      console.log(err);
      alert("you cancelled the TX or you did not have the wallet app open")
      window.location.reload();
    }
  }

  transferInKuro = async (account, amount) => {
    amount = this.convertDecimal(amount)
    try {
      const signCmd = {
          pactCode: `(hybrid-token.transfer ${JSON.stringify(this.state.accountName)} ${JSON.stringify(account)} ${amount})`,
          caps: [
            Pact.lang.mkCap("Gas capability", "description of gas cap", "coin.GAS", []),
          ],
          sender: this.state.accountName,
          gasLimit: 100000,
          chainId: "0",
          ttl: 28800,
          envData: {}
        }
      const cmd = await Pact.wallet.sign(signCmd)
      const reqKey = await Pact.wallet.sendSigned(cmd, kuroUrls[0])
      console.log(reqKey.requestKeys[0])
    } catch(err){
      console.log(err);
      alert("you cancelled the TX or you did not have the wallet app open")
      window.location.reload();
    }
  }


  render() {
  return (
    <Context.Provider
      value={{
        ...this.state,
        setAccountName: this.setAccountName,
        getCoinBalance: this.getCoinBalance,
        getCWBalance: this.getCWBalance,
        getKuroBalance: this.getKuroBalance,
        buyHT: this.buyHT,
        sellHT: this.sellHT,
        transferCWKuro: this.transferCWKuro,
        transferKuroCW: this.transferKuroCW,
        transferInKuro: this.transferInKuro
      }}
    >
      {this.props.children}
    </Context.Provider>
  );
}

}

export default Context;
