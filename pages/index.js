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
import config from "./config.json";
import { success, error, warn } from "./utilities/response";

import "react-toastify/dist/ReactToastify.css";
import { BiChevronsUp } from "react-icons/bi"
const { port } = require('./config');
console.log(`Your port is ${port}`); // 8626

export default function Main() {
  //console.log("in main")
  const [loading, setLoading] = useState(false);
  const [loadingArray] = useState(15);

  // Create a state variable to store the feeds in the blockchain
  const [feeds, setFeeds] = useState([]);

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
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        warn("Make sure you have MetaMask Connected");
        return;
      }
      console.log("Transaction check")
      const accounts = await ethereum.request({method: "eth_requestAccounts"});
    } catch (err) {
      error(`${err.message}`);
    }
  };

  /*
   * Get Feeds
   */
  const getFeeds = async () => {
    try {
      setLoading(true);
      const contract = await getContract();
      const AllFeeds = await contract.getAllFeeds();
      //console.log("Stage 3 ");
      //console.log(AllFeeds.length)
      
      
      /*
       * We only need title, category, coverImageHash, and author
       * pick those out
       */
      let cidarr = []
      const formattedFeed = AllFeeds.map((feed) => {
        return {
          id: feed.id,
          title: feed.title,
          category: feed.category,
          description: feed.description,
          coverImageHash: feed.coverImageHash,
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
    //console.log("In useeffect")

    const onFeedCreated = async (
      id,
      title,
      description,
      category,
      coverImageHash,
      date,
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
        },
      ]);
    };
    let contract;

    if (window.ethereum) {
      contract = getContract();
      //console.log("How many times")
     // contract.on("FeedCreated", onFeedCreated);
    }

    return () => {
      if (contract) {
        console.log("Return")
        contract.off("FeedCreated", onFeedCreated);
      }
    };
  }, []);

  return (
    <div className="w-full  flex flex-row">
      <div className="flex-1 flex flex-col">
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
    <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
    <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
    <div className="m-8 relative space-y-4">
        <Header
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
          })
        }
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
