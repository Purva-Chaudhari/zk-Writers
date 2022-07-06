<p align="center">
    <h1 align="center">  
      ZK-Writers
    </h1>
    <p align="center">The project Zk-Writers is a building block towards making a decentralized anonymous blogging website. It is a zero-knowledge based website which uses <a href="https://github.com/appliedzkp/semaphore">Semaphores</a>.</p>
</p>

<p align="center">
  <img width=50% height="300" src="https://github.com/Purva-Chaudhari/zk-Writers/blob/main/images/ZKWriter.png">
</p>

## Technology Stack 
1. Front-End
    * Next Js
    * Tailwind CSS
2. Backend
    * Solidity contract - Blog.sol 
    * IPFS
    * Semaphore - appliedzkp library
3. Relayer Api
4. Deployment - 
    * Vercel 
    * On goerli network and Polygon mainnet

## System Design
<p align="center">
  <img width=50% height="300" src="https://github.com/Purva-Chaudhari/zk-Writers/blob/main/images/SystemDiagram.png">
</p>

## Run locally

### 🛠 Install

Clone this repository and install the dependencies:

```bash
git clone https://github.com/cedoor/semaphore-boilerplate.git
cd zk-Writers
yarn
```

#### 1. Compile & test the contract

```bash
yarn compile
yarn test
```

#### 2. Run Next.js server & Hardhat network

```bash
yarn dev
```
#### 3. Deploy the contract

```bash
yarn deploy --network localhost
```

#### 4. Open the app

You can open the web app on http://localhost:3000.

#### 5. Install Metamask and connect the Hardhat wallet

You can find the mnemonic phrase [here](https://hardhat.org/hardhat-network/reference/#accounts).

#### 6. Create your proof

You must use one of the first 3 Hardhat accounts.


