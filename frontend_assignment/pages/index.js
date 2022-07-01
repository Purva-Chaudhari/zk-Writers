import detectEthereumProvider from "@metamask/detect-provider"
import { Strategy, ZkIdentity } from "@zk-kit/identity"
import { generateMerkleProof, Semaphore } from "@zk-kit/protocols"
import { providers,Contract, utils } from "ethers"
import Head from "next/head"
import React from "react"
import { useState, useEffect } from "react"
import { Header } from "./components/Header";
import { ToastContainer } from "react-toastify";
import FeedList from "./components/FeedList";
import Link from "next/link"
import getContract from "./utilities/getContract";
import ether from "ethers";

import { success, error, warn } from "./utilities/response";

import "react-toastify/dist/ReactToastify.css";
//const { ethers } = require("hardhat");
const { port } = require('./config');
console.log(`Your port is ${port}`); // 8626



export default function Main() {
  const [loading, setLoading] = useState(false);
  const [loadingArray] = useState(15);

  // Create a state variable to store the feeds in the blockchain
  const [feeds, setFeeds] = useState([]);

  /*
   * A state variable we use to store our user's public wallet.
   */
  const [currentAccount, setCurrentAccount] = useState("");

  /*
   * A function to check if a user wallet is connected.
   */
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      /*
       * Check if we're authorized to access the user's wallet
       */
      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        setCurrentAccount(account);
        console.log("rishabh  ")
        console.log(account)
        success("🦄 Wallet is Connected!");
      } else {
        success("Welcome 🎉  ");
        warn("To create a feed, Ensure your wallet Connected!");
      }
    } catch (err) {
      error(`${err.message}`);
    }
  };

  /**
   * Implement your connectWallet method here
   */   

  console.log("Redirected at home")
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        warn("Make sure you have MetaMask Connected");
        return;
      }
      console.log("Connect wallet transaction ")
      const accounts = await ethereum.request({method: "eth_requestAccounts"});
      setCurrentAccount(accounts[0]);
      const provider = new providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()
  const signature = await signer.signMessage(message)
  const address = await signer.getAddress()


  const identity = new ZkIdentity(Strategy.MESSAGE, signature)
  const identityCommitment = identity.genIdentityCommitment()
  const identityCommitments = await getAllMembers(identityCommitment)
  const indexIdentityCommitment = identityCommitments.indexOf(identityCommitment)

  const merkleProof = generateMerkleProof(
      20, 
      0, 
      identityCommitments, 
      identityCommitment
  )

  const signal = "Adding feed"
  const witness = Semaphore.genWitness(
      identity.getTrapdoor(),
      identity.getNullifier(),
      merkleProof,
      merkleProof.root,
      signal
  )

  const { proof, publicSignals } = await Semaphore.genProof(witness, "./semaphore.wasm", "./semaphore.zkey")
  const solidityProof = Semaphore.packToSolidityProof(proof)
  let root = merkleProof.root.toString()
  let nullifierHash = publicSignals.nullifierHash

  const BlogFeedContract = await ethers.getContractFactory('Blog')

  const transaction = await BlogFeedContract.createFeed(
    "Hello World",
    "New York world",
    "Sports",
    "0x123",
    "2022-05-05",  
    bytes32Greeting,
      merkleProof.root,
      nullifierHash, 
      merkleProof.root,
      solidityProof
  )
  console.log(await transaction.wait())
  console.log("Connect wallet transaction end")
  
  
  // let response = await fetch("http://localhost:8000/login",{
  //     method: "POST",
  //     headers: {
  //         'Accept': 'application/json',
  //         'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify({
  //         signal: signal,
  //         root: merkleProof.root.toString(),
  //         nullifierHash: publicSignals.nullifierHash.toString(),
  //         externalNullifier: publicSignals.externalNullifier.toString(),
  //         proof: solidityProof
  //     })
  // })


    } catch (err) {
      error(`${err.message}`);
    }
  };

  /*
   * Get Feeds
   */
  console.log("Stage 1");
  const getFeeds = async () => {
    try {
      setLoading(true);
      const contract = await getContract();
      console.log("Stage 2");
      console.log(contract)
      const AllFeeds = await contract.getAllFeeds();
      console.log("Stage 3 ");
      console.log(AllFeeds.length)
      
      
      /*
       * We only need title, category, coverImageHash, and author
       * pick those out
       */
      const formattedFeed = AllFeeds.map((feed) => {
        console.log(feed.coverImageHash)
        return {
          id: feed.id,
          title: feed.title,
          category: feed.category,
          coverImageHash: feed.coverImageHash,
          author: feed.author,
          date: new Date(feed.date * 1000),
        };
      });
      setFeeds(formattedFeed);
      setLoading(false);
    } catch (err) {
      error(`${err.message}`);
    }
  };

  /*
   * This runs our function when the page loads.
   */
  useEffect(() => {
    getFeeds();
    checkIfWalletIsConnected();

    /*
     * This is a hack to make sure we only run the function once.
     * We need to do this because we're using the useEffect hook.
     * We can't use the useEffect hook more than once.
     * https://reactjs.org/docs/hooks-effect.html
     * https://reactjs.org/docs/hooks-faq.html#how-do-i-implement-the-effects-api
     * https://reactjs.org/docs/hooks-faq.html#how-do-i-optimize-the-effects-of-a-component
     */
    const onFeedCreated = async (
      id,
      title,
      description,
      category,
      coverImageHash,
      date,
      signal,
      root,
      _nullifierHash,
      externalNullifier,
      _proof
    ) => {
      setFeeds((prevState) => [
        ...prevState,
        {
          id,
          title,
          description,
          category,
          coverImageHash,
          date,
          signal,
          root,
          _nullifierHash,
          externalNullifier,
          _proof
        },
      ]);
    };

    // let contract;

    // if (window.ethereum) {
    //   contract = getContract();
    //   contract.on("FeedCreated", onFeedCreated);
    // }

    // return () => {
    //   if (contract) {
    //     contract.off("FeedCreated", onFeedCreated);
    //   }
    // };
  }, []);

  return (
    <div className="w-full  flex flex-row">
      <div className="flex-1 flex flex-col">
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
    <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
    <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
    <div className="m-8 relative space-y-4">
        <Header
          currentAccount={currentAccount}
          connectWallet={connectWallet}
          ToastContainer={ToastContainer}
        />
        <div className="flex-1 flex flex-row flex-wrap">
          {feeds.map((feed, index) => {
            return (
              <Link href={`/FeedPage?id=${feed.id}`} key={index}>
                <div className="w-80 h-80 m-2">
                  <FeedList feed={feed} />
                </div>
              </Link>
            );
          })}
          {loading && (
            <div className="flex-1 flex flex-row flex-wrap">
              {Array(loadingArray)
                .fill(0)
                .map((_, index) => (
                  <div key={index} className="w-80">
                    <Loader />
                  </div>
                ))}
            </div>
          )}
        </div>
        </div>
    </div>
    </div>
  );
}

const Loader = () => {
  return (
    <div className="flex flex-col m-5 animate-pulse">
      <div className="w-full bg-gray-300 dark:bg-borderGray h-40 rounded-lg "></div>
      <div className="w-50 mt-3 bg-gray-300 dark:bg-borderGray h-6 rounded-md "></div>
      <div className="w-24 bg-gray-300 h-3 dark:bg-borderGray mt-3 rounded-md "></div>
    </div>
  );
};
