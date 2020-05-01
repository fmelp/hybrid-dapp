import React, { useState, useEffect, useContext } from 'react';
import { Input, Button, Divider, Icon } from 'semantic-ui-react';
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
    <div className="app" >
      <div style={{overflow: "auto"}}>
        <p className="header1">
          Stablecoin Instant Pay <span className="header2"> Hybrid Blockchain Demo</span>
        </p>
        <div className="sub-header">
          <p>
            Interoperate between public and private blockchain networks through stablecoin smart contracts.
          </p><br/>
          <p>
            See the <a href="https://medium.com/kadena-io/experience-hybrid-blockchain-e19699b1c468">Demo Walkthrough</a> and <a href="https://github.com/fmelp/hybrid-dapp">Project README</a> for instructions.
          </p>
        </div>
        <Divider className="line"/>
        <div>
          <div className="acct-block">
            <label style={{height: 36, marginTop: 9}}><p className="step">Step 1</p>Enter Your Account Name</label>
              <Input
                name="acct-name"
                className="acct-input"
                placeholder='Account Name'
                value={pactContext.accountName}
                onChange={(e) => pactContext.setAccountName(e.target.value)}
              />
                <Button
                    primary
                    onClick={() => pactFecth()}
                    disabled={!pactContext.accountName}
                  >
                  Refresh Balances
                </Button>
        </div>
        <div className="flex-container">
          <div style={{backgroundColor: "#c9f3fc", marginLeft: 0}}>
            <div className="info-block" style={{backgroundColor: "#a6effe"}}>
              <div>
                <p>Currency:</p>
                <b>Kadena (KDA)</b>
              </div>
              <div>
                <p>Network:</p>
                <b>Kadena Public</b>
              </div>
            </div>
            <div className="info-block">
              <div className="account-label">Account Balance</div>
               <div>
                <Input className="amount-input" value={pactContext.coinBalance}/>
               </div>
            </div>
            <Divider className="step-line"/>
            <div className="transfer-block">
              <div className="triangle-right" style={{ borderLeft: "13px solid #c9f3fc" }}/>
              <p className="step">Step 2</p>
              <p>Buy StablecoinX (KDA to SCX)</p>
            </div>
            <div>
            <Input
              className="buy-input"
              placeholder='Amount to Buy'
              value={amountBuy}
              onChange={(e) => setAmountBuy(e.target.value)}
            />
            <Button
              primary
              className="buy-button"
              disabled={isNaN(amountBuy) || amountBuy === ""}
              onClick={() =>  pactContext.buyHT(amountBuy)}
            >
             Buy SCX
             <Icon name='right arrow' />
            </Button>
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
              <div className="account-label">Account Balance</div>
               <div>
                <Input className="amount-input" value={pactContext.cwBalance}/>
               </div>
            </div>
            <Divider className="step-line"/>
            <div className="middle">
              <div className="transfer-block">
                <div className="triangle-right" style={{ borderLeft: "13px solid #d3e4ff" }}/>
                <p className="step">Step 3</p>
                <p>Transfer StablecoinX to SCX InstantPay</p>
              </div>
            <div>
              <Input
                className="buy-input"
                placeholder='Amount to Transfer'
                value={amountToKuro}
                onChange={(e) => setAmountToKuro(e.target.value)}
                />
                <Button
                  primary
                  className="buy-button"
                  disabled={isNaN(amountToKuro) || amountToKuro === ""}
                  onClick={() =>  pactContext.transferCWKuro(amountToKuro)}
                >Transfer
                <Icon name='right arrow' />
                </Button>
            </div>
            </div>
            <Divider className="step-line"/>
            <div className="transfer-block">
              <div className="triangle-left" style={{ borderRight: "13px solid #d3e4ff" }}/>
              <p className="step">Step 6</p>
              <p>Sell StablecoinX (SCX to KDA)</p>
            </div>
            <div>
              <Input
                className="buy-input"
                value={amountSell}
                placeholder="Amount to Sell"
                onChange={(e) => setAmountSell(e.target.value)}
              />
              <Button
                primary
                className="buy-button"
                disabled={isNaN(amountSell) || amountSell === ""}
                onClick={() =>  pactContext.sellHT(amountSell)}
              >
              <Icon name='left arrow' />
               Sell SCX
             </Button>
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
                <div className="account-label">Account Balance</div>
                <div>
                  <Input className="amount-input" value = {pactContext.kuroBalance}/>
                </div>
              </div>
              <Divider className="step-line"/>
              <div className="middle">
                <div className="transfer-block">
                  <div className="triangle-right" style={{ borderLeft: "13px solid #e5dbff" }}/>
                  <p className="step">Step 4</p>
                  <p>Transfer between SCX InstantPay accounts</p>
                </div>
              <div>
              <Input
                className="buy-input"
                placeholder='Account Name'
                value={transferTo}
                onChange={(e) => setTransferTo(e.target.value)}
              />
                <Button
                  primary
                  className="buy-button"
                  disabled={isNaN(transferAmount) || transferAmount === "" || transferTo === ""}
                  onClick={() =>  pactContext.transferInKuro(transferTo, transferAmount)}
                > Transfer
                <Icon name='right arrow' />
                </Button>
                <Input
                  className="buy-input"
                  placeholder='Amount'
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                />
              </div>
            </div>
              <Divider className="step-line"/>
              <div className="transfer-block">
                <div className="triangle-left" style={{ borderRight: "13px solid #e5dbff" }}/>
                <p className="step">Step 5</p>
                <p>Transfer SCX InstantPay to StablecoinX</p>
              </div>
              <div>
                <Input
                  className="buy-input"
                  placeholder='Amount to Transfer'
                  value={amountToCW}
                  onChange={(e) => setAmountToCW(e.target.value)}
                  />
                <Button
                  primary
                  className="buy-button"
                  disabled={isNaN(amountToCW) || amountToCW === ""}
                  onClick={() =>  pactContext.transferKuroCW(amountToCW)}
                >
                <Icon name='left arrow' />
                Transfer</Button>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
      <img src={require("../powered_by_kadena.png")} style={{height:40, marginLeft: 735}}/>
    </div>
  );
}

export default Home;
