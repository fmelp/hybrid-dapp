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
        <p>
          Kadena Coin Balance: {pactContext.coinBalance}
        </p>
        <p>
          Hybrid Token Balance (Chainweb): {pactContext.cwBalance}
        </p>
        <text>amount</text>
        <input value={amountBuy} onChange={(e) => setAmountBuy(e.target.value)}/>
        <button>
          buy hybrid token
        </button>
        <br></br>
        <text>amount</text>
        <input value={amountSell} onChange={(e) => setAmountSell(e.target.value)}/>
        <button>
          sell hybrid token
        </button>
        <p>
          Hybrid Token Balance (Kuro): {pactContext.kuroBalance}
        </p>
        <text>amount</text>
        <input value={amountToKuro} onChange={(e) => setAmountToKuro(e.target.value)}/>
        <button>
          transfer chainweb -> kuro
        </button>
        <br></br>
        <text>amount</text>
        <input value={amountToCW} onChange={(e) => setAmountToCW(e.target.value)}/>
        <button>
          transfer kuro -> chainweb
        </button>
        <br></br>
        <text>amount</text>
        <input value={transferAmount} onChange={(e) => setTransferAmount(e.target.value)}/>
        <text>account</text>
        <input value={transferTo} onChange={(e) => setTransferTo(e.target.value)}/>
        <button>
          transfer within kuro
        </button>
      </header>
    </div>
  );
}

export default Home;
