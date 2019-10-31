import React from 'react';
import Pact from 'pact-lang-api';

const Context = React.createContext();

const hosts = ["us1","us2","eu1","eu2","ap1","ap2"]
const kuroUrls = ["http://54.166.153.21:9000", "http://54.146.43.204:9001", "http://34.204.71.247:9002", "http://54.164.36.85:9003"]
const chainIds = ["0","1",'2',"3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19"]
const createAPIHost = (network, chainId) => `https://${network}.testnet.chainweb.com/chainweb/0.0/testnet02/chain/${chainId}/pact`
const dumKeyPair = Pact.crypto.genKeyPair();

export class PactStore extends React.Component {

  state = {
    accountName: "u1",
    coinBalance: "n/a",
    cwBalance: "n/a",
    kuroBalance: "n/a"
  }

  setAccountName = async (str) => {
    this.setState({ accountName: str })
  }

  getCoinBalance = async () => {
    const cmd = await Pact.fetch.local({
      pactCode: `(coin.account-balance ${JSON.stringify(this.state.accountName)})`,
      keyPairs: dumKeyPair
    }, createAPIHost(hosts[0],"0"))
    const data = await cmd.data;
    if (data) {
      await this.setState({ coinBalance: data.toString().substring(0,15) })
    }

  }

  getCWBalance = async () => {
    const cmd = await Pact.fetch.local({
      pactCode: `(hybrid-exchange.get-balance ${JSON.stringify(this.state.accountName)})`,
      keyPairs: dumKeyPair
    }, createAPIHost(hosts[0],"0"))
    const data = await cmd.data;
    console.log(data);
    if (data) {
      await this.setState({ cwBalance: data.toString().substring(0,15) })
    }

  }

  getKuroBalance = async () => {
    const cmd = await Pact.fetch.local({
      pactCode: `(hybrid-token.get-balance ${JSON.stringify(this.state.accountName)})`,
      keyPairs: dumKeyPair
    }, kuroUrls[0])
    const data = await cmd.data;
    if (data) {
      await this.setState({ kuroBalance: data.toString().substring(0,15)  })
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
        getKuroBalance: this.getKuroBalance
      }}
    >
      {this.props.children}
    </Context.Provider>
  );
}

}

export default Context;
