# Stablecoin Instant Pay (Kadena Hybrid Blockchain Demo)
![](hybrid-demo.png)
  Stablecoin Instant Pay is a hybrid blockchain demo which allows token transfers between Kadena Testnet Network (Public) and Kadena Kuro Network (Private).

## Token Descriptions  
  - **Kadena (KDA)**: the native cryptocurrency for the Kadena Public network.
  - **StablecoinX (SCX)**: a stablecoin which trades 1:1 with KDA on the public network.
  - **SCX InstantPay**: token used for instant transaction settlement on the private network.

## Requirements
 - [Chainweaver Wallet](https://www.kadena.io/chainweaver)
 - A Kadena Testnet Account with balance. (If you don't have one, get testnet coins [here](https://faucet.testnet.chainweb.com/)

## Getting Started
  1. Install [Chainweaver Wallet](https://www.kadena.io/chainweaver)
  2. Go to Settings > Network, and click on `Create New Network`.
  3. Name the network as `Kuro` and add the following nodes:
    - `34.204.71.247:9002`
    - `54.166.153.21:9000`
    - `54.146.43.204:9001`
    - `54.164.36.85:9003`
  4. Visit the [website](http://hybrid.chainweb.com/)
  5. Enter your Kadena Testnet Account name and refresh balances.

## Functionality
  - Buy StablecoinX(SCX) with KDA. (1:1 exchange)
    1. Set your network to **Testnet** on chainweaver.
    2. Input amount at Step 2.
    3. Sign transaction and wait 1~2 minutes to clear. Click on Refresh Balances to check your balance.
  - Transfer SCX to SCX InstantPay. SCX Instant Pay is a currency in Kadena Private network.(Kuro) (1:n exchange)
    1. Set your network to **Testnet** on chainweaver.
    2. Input amount at Step 3.
    3. Sign transaction and wait 1~2 minutes to clear. Click on Refresh Balances to check your balance.
  - Transfer your balances between SCX InstantPay accounts. (1:1 exchange)
    1. Set your network to **Kuro** on chainweaver.
    2. Input account name and amount at Step 4.
    3. Sign transaction and wait 1~2 minutes to clear. Click on Refresh Balances to check your balance.
  - Transfer SCX InstantPay to SCX. (n:1 exchange)
    1. Set your network to **Kuro** on chainweaver.
    2. Input amount at Step 5.
    3. Sign transaction and wait 1~2 minutes to clear. Click on Refresh Balances to check your balance.
  - Sell SCX for KDA. (1:1 exchange)
    1. Set your network to **Testnet** on chainweaver.
    2. Input amount at Step 6.
    3. Sign transaction and wait 1~2 minutes to clear. Click on Refresh Balances to check your balance.
