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


  return (
    <div className="app" textAlign="center" >
      <div style={{overflow: "auto"}}>
        <p className="header1">
          Stablecoin Instant Pay <span className="header2"> Hybrid Blockchain Demo</span>
        </p>
        <div className="sub-header">
          <p>
            Interoperate between public and private blockchain networks through stablecoin smart contracts.
          </p><br/>
          <p>
            See the <a>Demo Walkthrough</a> and <a>Project README</a> for instruction.
          </p>
        </div>
        <div className="line"/>
        <div>
          <div>
            <label for="acct-name" style={{height: 36, marginTop: 5}}><p className="step">Step 1</p>Enter Your Account Name</label>
              <input
                name="acct-name"
                className="acct-input"
                placeholder='Account Name'
                value={pactContext.accountName}
                onChange={(e) => pactContext.setAccountName(e.target.value)}
                action={
                   <button
                   className="account"
                   onClick={() => pactFecth()}
                   >
                   account
                   </button>
                 }
              />
              <button
                  className="refresh-button"
                  onClick={() => pactFecth()}
                  disabled={!pactContext.accountName}
                >
                <p style={{color: "white", fontStyle: "bold"}}>Refresh Balances</p>
              </button>
          </div>
        <div className="flex-container">
          <div style={{backgroundColor: "#c9f3fc", marginLeft: 0}}>
            <div className="info-block" style={{backgroundColor: "#a6effe"}}>
              <div>
                <p>Currency:</p>
                <b>Kadena(KDA)</b>
              </div>
              <div>
                <p>Network:</p>
                <b>Kadena Public</b>
              </div>
            </div>
            <div className="info-block">
              <div>Account Balance</div>
               <div>
                <input className="amount-input" value={pactContext.coinBalance}/>
               </div>
            </div>
            <hr/>
            <div className="transfer-block">
              <p className="step">Step 2</p>
              <p>Buy StablecoinX (KDA to SCX)</p>
            </div>
            <div>
            <input
              className="buy-input"
              icon='dollar sign'
              iconPosition='left'
              placeholder='Amount to Buy'
              value={amountBuy}
              onChange={(e) => setAmountBuy(e.target.value)}
            />
            <button
              className="buy-button"
              disabled={isNaN(amountBuy) || amountBuy === ""}
              onClick={() =>  pactContext.buyHT(amountBuy)}
            >
             buy SXC
            </button>
            </div>
          </div>
          <div style={{backgroundColor: "#d3e4ff"}}>
            <div className="info-block" style={{backgroundColor: "#aacbff"}}>
              <div>
                <p>Currency:</p>
                <b>StablecoinX (SCX)</b>
              </div>
              <div>
                <p>Network:</p>
                <b>Kadena Public</b>
              </div>
            </div>
            <div className="info-block">
              <div>Account Balance</div>
               <div>
                <input className="amount-input" value={pactContext.cwBalance}/>
               </div>
            </div>
            <hr/>
            <div className="transfer-block">
              <p className="step">Step 3</p>
              <p>Transfer StablecoinX to SCX InstantPay</p>
            </div>
            <div>
            <input
              className="buy-input"
              placeholder='Amount to Transfer'
              value={amountToKuro}
              onChange={(e) => setAmountToKuro(e.target.value)}
              />
              <button
                className="buy-button"
                disabled={isNaN(amountToKuro) || amountToKuro === ""}
                onClick={() =>  pactContext.transferCWKuro(amountToKuro)}
              >Transfer</button>
            </div>
            <hr/>
            <div className="transfer-block">
              <p className="step">Step 6</p>
              <p>Sell StablecoinX (SCX to KDA)</p>
            </div>
            <div>
              <input
                className="buy-input"
                value={amountSell}
                placeholder="Amount to Sell"
                onChange={(e) => setAmountSell(e.target.value)}
              />
              <button
                className="buy-button"
                disabled={isNaN(amountSell) || amountSell === ""}
                onClick={() =>  pactContext.sellHT(amountSell)}
              >Sell SCX
              </button>
            </div>
          </div>
          <div style={{backgroundColor: "#e5dbff"}}>
            <div className="info-block" style={{backgroundColor: "#bea5ff"}}>
            <div>
              <p>Currency:</p>
              <b>SCX InstantPay</b>
            </div>
            <div>
              <p>Network:</p>
              <b>Kadena Private </b>
            </div>
            </div>
            <div>
              <div className="info-block">
                <div>Account Balance</div>
                <div>
                  <input className="amount-input" value = {pactContext.kuroBalance}/>
                </div>
              </div>
              <hr/>
              <div className="transfer-block">
                <p className="step">Step 4</p>
                <p>Transfer between SCX InstantPay accounts</p>
              </div>
              <div>

              <input
                className="buy-input"
                placeholder='Account Name'
                value={transferTo}
                onChange={(e) => setTransferTo(e.target.value)}
              />
                <button
                  className="buy-button"
                  disabled={isNaN(transferAmount) || transferAmount === "" || transferTo === ""}
                  onClick={() =>  pactContext.transferInKuro(transferTo, transferAmount)}
                > Transfer</button>
                <input
                  className="buy-input"
                  placeholder='Amount'
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                />
              </div>
              <hr/>
              <div className="transfer-block">
                <p className="step">Step 5</p>
                <p>Transfer SCX InstantPay to StablecoinX</p>
              </div>
              <div>
                <input
                  className="buy-input"
                  placeholder='Amount to Transfer'
                  value={amountToCW}
                  onChange={(e) => setAmountToCW(e.target.value)}
                  />
                <button
                  className="buy-button"
                  disabled={isNaN(amountToCW) || amountToCW === ""}
                  onClick={() =>  pactContext.transferKuroCW(amountToCW)}
                >Sell SCX</button>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
