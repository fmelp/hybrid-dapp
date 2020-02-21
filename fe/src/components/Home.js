import React, { useState, useEffect, useContext } from 'react';
import logo from '../logo.svg';
import '../App.css';
import { Button, Grid, Input, Icon, Form, List,
   Modal, Header, Message, Popup, Select, Radio,
   Tab, TextArea, Loader } from 'semantic-ui-react';
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
    <Grid columns={2} padded verticalAlign="top">
      <Grid.Column textAlign="center" style={{overflow: "auto"}}>
        <img src={require("../kadena.png")} style={{height:70, marginTop: 50}}/>
        <Header as="h6" style={{color:'black', fontWeight: 'bold', fontSize: 40, marginTop: 20}}>
          Megabank Coin Demo
        </Header>
        <Form>
          <Form.Field  style={{marginLeft: 100, marginRight: 100, marginTop: "20px", marginBottom: 30, textAlign: "left"}} >
            <label style={{color: "#f4aa3c" }}>Enter Your Account Name
              <Popup
                trigger={
                  <Icon name='help circle' style={{"marginLeft": "2px"}}/>
                }
                position='top center'
              >
              <Popup.Header>What is Account Name? </Popup.Header>
              <Popup.Content>Account Name is the unique sequence of characters that you use to identify yourself in chainweb. You'll be asked to sign with associated key/keys when you make transactions. Account names need to be unique and are assosciated to keypairs that can sign its transactions. The simplest way would be to use your public key as your account name</Popup.Content>
              </Popup>
            </label>
              <Form.Input
                icon='user'
                iconPosition='left'
                placeholder='Account Name'
                value={pactContext.accountName}
                onChange={(e) => pactContext.setAccountName(e.target.value)}
                action={
                   <Button
                   color='yellow'
                   onClick={() => pactFecth()}
                   >
                    <Icon name="redo"/>
                    update
                   </Button>
                 }
              />
          </Form.Field>
        </Form>
        <Message color="pink" style={{marginLeft: 100, marginRight: 100}}>
          <Message.Header>
            KDA Balance:
          </Message.Header>
          <div>
            {pactContext.coinBalance}
          </div>
        </Message>
        <Message color="orange" style={{marginLeft: 100, marginRight: 100}}>
          <Message.Header>
            Megabank Savings Account Balance:
          </Message.Header>
          <div>
            {pactContext.cwBalance}
          </div>
        </Message>
        <Message color="yellow" style={{marginLeft: 100, marginRight: 100}}>
          <Message.Header>
            Megabank Checking Account Balance:
          </Message.Header>
          <div>
            {pactContext.kuroBalance}
          </div>
        </Message>
        <Button
            style={{
              backgroundColor: "#f4aa3c",
              color: "white",
              marginBottom: 10,
              marginTop: 20,
              width: 340,
              }}
            onClick={() => pactFecth()}
            disabled={!pactContext.accountName}
          >
          Refresh Balances
        </Button>
      </Grid.Column>
      <Grid.Column style={{overflow: "auto", backgroundColor: "#f4aa3c"}}>
        <Form>
          <Header as="h6" style={{color:'white', fontWeight: 'bold', fontSize: 30, marginTop: 70, marginBottom: 20, textAlign: 'center'}}>
            Savings Account Actions
          </Header>
          <Form.Field  style={{width:"440px", margin: "0 auto", marginTop: "10px"}} >
            <label style={{color: "white"}}>Buy Megabank Coin (KDA -> MBC)
              <Popup
                trigger={
                  <Icon name='help circle' style={{"marginLeft": "2px"}}/>
                }
                position='top center'
              >
                <Popup.Header>What is  Megabank Coin? </Popup.Header>
                <Popup.Content>When you buy a Megabank Coin, you are trading your KDA 1:1 with this new digital currency that is spendable instantly (no need to wait for blockchain confirmation times). You will only be able to transfer these funds to pay others once you transfer them to your checking account. Note that you can always convert Megabank coins in your savings account back to KDA at the same 1:1 ratio.</Popup.Content>
              </Popup>
            </label>
              <Form.Input
                style={{width:"440px"}}
                icon='dollar sign'
                iconPosition='left'
                placeholder='Amount to Buy'
                value={amountBuy}
                onChange={(e) => setAmountBuy(e.target.value)}
                action={
                   <Button
                   color={(!isNaN(amountBuy) && amountBuy !== "") ? "orange" : "grey"}
                   disabled={isNaN(amountBuy) || amountBuy === ""}
                   onClick={() =>  pactContext.buyHT(amountBuy)}
                   >
                    buy MBC
                   </Button>
                 }
              />
          </Form.Field>
          <Form.Field  style={{width:"440px", margin: "0 auto", marginTop: "10px"}} >
            <label style={{color: "white"}}>Sell Megabank Coin (MBC -> KDA)
              <Popup
                trigger={
                  <Icon name='help circle' style={{"marginLeft": "2px"}}/>
                }
                position='top center'
              >
                <Popup.Header>What is Selling Megabank coin? </Popup.Header>
                <Popup.Content>When you sell Megabank coin, you are converting it back to KDA at a 1:1 ratio. Please note you need to have that amount of Megabank coin in your savings account before cashing out. If you still have the balance in your checking account, please transfer it to savings before attempting to cash out.</Popup.Content>
              </Popup>
            </label>
              <Form.Input
                style={{width:"440px"}}
                icon='dollar sign'
                iconPosition='left'
                placeholder='Amount to Sell'
                value={amountSell}
                onChange={(e) => setAmountSell(e.target.value)}
                action={
                   <Button
                   color={(!isNaN(amountSell) && amountSell !== "") ? "orange" : "grey"}
                   disabled={isNaN(amountSell) || amountSell === ""}
                   onClick={() =>  pactContext.sellHT(amountSell)}
                   >
                    sell MBC
                   </Button>
                 }
              />
          </Form.Field>
          <Form.Field  style={{width:"440px", margin: "0 auto", marginTop: "10px"}} >
            <label style={{color: "white"}}>Transfer to Checking Account
              <Popup
                trigger={
                  <Icon name='help circle' style={{"marginLeft": "2px"}}/>
                }
                position='top center'
              >
                <Popup.Header>What is Transfering To Checking Account? </Popup.Header>
                <Popup.Content>Transfering to your checking account allows you to spend your Megabank coins instananeously by sending it to any participating individual or business.</Popup.Content>
              </Popup>
            </label>
              <Form.Input
                style={{width:"440px"}}
                icon='exchange'
                iconPosition='left'
                placeholder='Amount to Transfer to Checking'
                value={amountToKuro}
                onChange={(e) => setAmountToKuro(e.target.value)}
                action={
                   <Button
                   style={{width: 96}}
                   color={(!isNaN(amountToKuro) && amountToKuro !== "") ? "orange" : "grey"}
                   disabled={isNaN(amountToKuro) || amountToKuro === ""}
                   onClick={() =>  pactContext.transferCWKuro(amountToKuro)}
                   >
                    transfer
                   </Button>
                 }
              />
          </Form.Field>
        </Form>
        <Form>
          <Header as="h6" style={{color:'white', fontWeight: 'bold', fontSize: 30, marginTop: 40, marginBottom: 20, textAlign: 'center'}}>
            Checking Account Actions
          </Header>
          <Form.Field  style={{width:"440px", margin: "0 auto", marginTop: "10px"}} >
            <label style={{color: "white"}}>Transfer to Savings account
              <Popup
                trigger={
                  <Icon name='help circle' style={{"marginLeft": "2px"}}/>
                }
                position='top center'
              >
                <Popup.Header>What is Transfering To Savings Account? </Popup.Header>
                <Popup.Content>Transfering to your savings account allows you to cash out your Megabank coins back to KDA at a 1:1 ratio once the transfer between checking and savings account is complete</Popup.Content>
              </Popup>
            </label>
              <Form.Input
                style={{width:"440px"}}
                icon='exchange'
                iconPosition='left'
                placeholder='Amount to Transfer to Savings'
                value={amountToCW}
                onChange={(e) => setAmountToCW(e.target.value)}
                action={
                   <Button
                   style={{width: 96}}
                   color={(!isNaN(amountToCW) && amountToCW !== "") ? "orange" : "grey"}
                   disabled={isNaN(amountToCW) || amountToCW === ""}
                   onClick={() =>  pactContext.transferKuroCW(amountToCW)}
                   >
                    transfer
                   </Button>
                 }
              />
          </Form.Field>
          <Form.Field  style={{width:"440px", margin: "0 auto", marginTop: "10px", marginBottom: 100}} >
            <label style={{color: "white"}}>Pay People or Businesses
              <Popup
                trigger={
                  <Icon name='help circle' style={{"marginLeft": "2px"}}/>
                }
                position='top center'
              >
                <Popup.Header>Who can I pay? </Popup.Header>
                <Popup.Content>You can pay any entity (indiviudal or business), with a registered Megabank coin account in a cryptographically safe, but instantaneous manner</Popup.Content>
              </Popup>
            </label>
            <div>
              <Input
                style={{width:"440px", marginBottom: 3}}
                icon='user'
                iconPosition='left'
                placeholder='Account Name'
                value={transferTo}
                onChange={(e) => setTransferTo(e.target.value)}
              />
              <Input
                style={{width:"440px"}}
                icon='dollar sign'
                iconPosition='left'
                placeholder='Amount'
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                action={
                   <Button
                   color={(!isNaN(transferAmount) && transferAmount !== "" && transferTo !== "") ? "orange" : "grey"}
                   disabled={isNaN(transferAmount) || transferAmount === "" || transferTo === ""}
                   onClick={() =>  pactContext.transferInKuro(transferTo, transferAmount)}
                   >
                    pay MBC
                   </Button>
                 }
              />
            </div>
          </Form.Field>
        </Form>
      </Grid.Column>
    </Grid>
  );
}

export default Home;
