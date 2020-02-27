# Welcome to Megabank coin (made with Kadena hybrid)

## How to use Megabank account:
vist our portal [here](http://hybrid.chainweb.com/)
pre-requirements:
  - downloading Chainweaver [desktop wallet (macOS)](builds.s3.amazonaws.com/Kadena+Chainweaver.1.1.2-2020-02-27.dmg)
  - funding a Kadena public account with our testnet [coin faucet](faucet.testnet.chainweb.com)
  - add testnet and kuro to wallet network settings
    - testnet: `us1.testnet.chainweb.com, us2.testnet.chainweb.com, eu1.testnet.chainweb.com, ap1.testnet.chainweb.com`
    - kuro: ``

## Code specs:
  - pact code and corresponding .repl tests outlined in /pact directory
  - front-end implemented with react in /src
  - calls to testnet chain with [pact-lang-api](https://github.com/kadena-io/pact-lang-api)
  - all pact calls in src/contexts/PactContext.js

## Run Your Own Locally:
  - make sure you are on latest versions of node.js, npm, and react
  - clone project and run
  `npm install`
  - once complete run `npm start`
  - will be visible on `localhost:8083`
  
  
  What is a Hybrid Blockchain?
 
The Kadena hybrid blockchain platform is first-to-market with our approach to interoperability by combining our public blockchain with our permissioned network called Kuro. The hybrid platform enables different blockchain protocols to share data between smart contracts deployed on their respective networks through an API, also referred to as an oracle in blockchain.

In practice, imagine a user posting new data to a smart contract on the public chain, then the oracle listening to the details of this transaction, and ultimately instructing the smart contract on the private side to execute a predefined task.
 
 

Why is a Hybrid Blockchain useful?
 
Hybrid blockchain opens the door for novel business practices. It allows for unprecedented levels of business cooperation through safe and verified data sharing. Kadena’s hybrid blockchain leverages the private chain for sensitive data and the public chain to transact subsets of the data created on the permissioned side. For an in-depth explanation with real-world examples, please read Kadena’s previous articles about Hybrid Blockchain 101 and the Smart Contract Sharing Economy. 
 
Why is Kadena’s Hybrid Blockchain unique?
 
There are protocols out there, such as Cosmos and Polkadot, that share Kadena’s commitment to blockchain interoperability. They are approaching it differently by providing a Layer 2 solution to speed up safe-but-slow existing Layer 1 networks such as Ethereum and Bitcoin. While these approaches are consistent with the oracle architecture described above, they are very different from Kadena’s hybrid approach, as we have solved Layer 1 scalability, while maintaining or improving decentralization and security. Kadena’s hybrid approach is designed to separate, at a business-logic level, data that should be transacted publicly from data that needs to remain confidential.

Use Case: Megabank Coin Demo
 
Problem: Megabank wants to implement its own easily-verifiable and secure payments system while still providing the speed and privacy that its clients are accustomed to from its existing products (online bank accounts and credit cards).

Solution: Megabank exposes to users the traditional bank account model that leverages Kadena’s hybrid blockchain to make the product simple and familiar

Savings Account
Functionality: 
Deposit and withdraw Megabank Coin to Megabank account with KDA
Transfer funds to checking account to spend it regularly
Benefit monetarily from keeping funds in this interest-bearing account
Tech Implementation:
Smart contract that lives on Kadena public chain
Github link to the exchange-style deployed code
User can sign with his Kadena public account(s)
Cash in / out
Transfer funds to checking account
Megabank admins
burn  / mint coins

Checking Account
Functionality:
Send or receive Megabank coins with any user or merchant in the Megabank ecosystem
Transfer funds to savings account to earn interest or cash out
Tech Implementation:
Smart contract that lives on Kadena Kuro permissioned chain
Github link to the coin-ledger-style deployed code
User can sign with same keys as Kadena public
Transfer to other users
Transfer to checking
User account automatically created in permissioned chain if it does not exist


Power of Pact

Although it may seem like a far-fetched dream for a non-technical user to own and operate a blockchain-based bank account with similar characteristics to today’s traditional counterparts, Kadena’s hybrid blockchain and smart contract language, Pact, make it technically feasible today.

Protection from Fatal Bugs

Out of the box, Pact allows developers to formally verify their contract code -- a process also used to secure nuclear power plants. Having mathematically provable code in the context of creating a novel payments system is extremely important to ensure the security of user funds. 

Pact is also designed to be easy to write and read by non-technical compliance teams, which is essential in a complicated corporate structure like Megabank’s. This allows for concise, yet powerful business logic to be deployed on-chain. The public chain Megabank smart contract is only 250 lines of code and it shares all fundamental functions with its permissioned chain counterpart, making it easy to maintain such mission-critical logic.

Seamless User Experience

With Pact, users can universally use their Kadena accounts and keypairs seamlessly on both the public and permissioned chains, never giving the impression that their transactions are happening on completely distinct blockchains. This concept of seamlessly signing across chains is further simplified by our signing api, which allows users to sign for their transactions in an identical manner using our wallet, Chainweaver. 

This ease of use across chains permeates to developers who can easily code the logic for sending transactions to different chains by using the same light-weight api. Our Pact API simply formats your transaction into the correct JSON shape and sends it to the desired blockchain node. No need to worry about complicated libraries that inject code and rely on third-party browser extensions, such as web3.js, to simply send a signed transaction to be processed by the target chain. If you are interested in the technicalities of our transaction format, check out our tx tool to create, modify, and send your own pact code.


How to create your own Megabank account (need to polish and take screenshots when wallet is updated). Live now on testnet!

Download Chainweaver, safely store the pneumonic phrase, then generate a public key
Create and fund the account with our testnet faucet

Visit http://hybrid.chainweb.com/ and enter your account name


Buy Megabank coin (1:1 exchange with KDA) in your savings account
Sign transaction with chainweaver (pic of signing screens)
Allow 1-2 minutes for this transaction to clear

Transfer coins to checking account
Sign with chainweaver
Allow 1-2 minutes for this transaction to clear


Instantly send coins to any existing Megabank account
Sign with chainweaver
(show its same for different chain with pic)


Reverse steps 4 and 5 to cash out back to KDA




