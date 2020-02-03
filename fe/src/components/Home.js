import React, { useState, useEffect, useContext } from 'react';
import logo from '../logo.svg';
import '../App.css';
import PactContext from "../contexts/PactContext";


const Home = () => {

  const pactContext = useContext(PactContext);

  useEffect(() => {
    async function pactFetch() {
      await pactContext.getCoinBalance();
      await pactContext.getCWBalance();
      await pactContext.getKuroBalance();
    }
    pactFetch();
  }, [])

  const pactFecth = async () => {
    await pactContext.getCoinBalance();
    await pactContext.getCWBalance();
    await pactContext.getKuroBalance();
  }

  const [amountBuy, setAmountBuy] = useState("");
  const [amountSell, setAmountSell] = useState("");
  const [amountToCW, setAmountToCW] = useState("");
  const [amountToKuro, setAmountToKuro] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [transferTo, setTransferTo] = useState("");

  // const isDecimal = (str) => {
  //
  // }

  return (
    <div className="App">
      <header className="App-header">
      <p>
        KADENA HYBRID BLOCKCHAIN DEMO
      </p>
      <text>log-in below:</text>
      <input value={pactContext.accountName} onChange={(e) => pactContext.setAccountName(e.target.value)}/>
      <button onClick={() => pactFecth()}>
        login
      </button>
        <p style={{ color: "red" }}>
          Kadena Coin Balance: {pactContext.coinBalance}
        </p>
        <p style={{ color: "green" }}>
          Hybrid Token Balance (Chainweb): {pactContext.cwBalance}
        </p>
        <text>enter amount to buy (Kadena -> HT)</text>
        <input value={amountBuy} onChange={(e) => setAmountBuy(e.target.value)}/>
        <button
          disabled={amountBuy ? false : true}
          onClick={() => {
            pactContext.buyHT(amountBuy)}}>
          buy hybrid token
        </button>
        <br></br>
        <text>enter amount to sell (HT -> Kadena)</text>
        <input value={amountSell} onChange={(e) => setAmountSell(e.target.value)}/>
        <button
          disabled={amountSell ? false : true}
          onClick={() => {
          pactContext.sellHT(amountSell)}}>
          sell hybrid token
        </button>
        <p style={{ color: "green" }}>
          Hybrid Token Balance (Kuro): {pactContext.kuroBalance}
        </p>
        <text>enter amount to transfer (CW -> Kuro)</text>
        <input value={amountToKuro} onChange={(e) => setAmountToKuro(e.target.value)}/>
        <button
          disabled={amountToKuro ? false : true}
          onClick={() => {
          pactContext.transferCWKuro(amountToKuro)}}>
          transfer chainweb -> kuro
        </button>
        <br></br>
        <text>enter amount to transfer (Kuro -> CW)</text>
        <input value={amountToCW} onChange={(e) => setAmountToCW(e.target.value)}/>
        <button
          disabled={amountToCW ? false : true}
          onClick={() => {
          pactContext.transferKuroCW(amountToCW)}}>
          transfer kuro -> chainweb
        </button>
        <br></br>
        <text>enter amount to transfer within Kuro</text>
        <input value={transferAmount} onChange={(e) => setTransferAmount(e.target.value)}/>
        <text>account</text>
        <input value={transferTo} onChange={(e) => setTransferTo(e.target.value)}/>
        <button
          disabled={(transferAmount && transferTo) ? false : true}
          onClick={() => {
          pactContext.transferInKuro(transferTo, transferAmount)}}>
          transfer within kuro
        </button>
      </header>
    </div>
  );
}

export default Home;
