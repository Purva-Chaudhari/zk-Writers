import detectEthereumProvider from "@metamask/detect-provider"
import { Strategy, ZkIdentity } from "@zk-kit/identity"
import { generateMerkleProof, Semaphore } from "@zk-kit/protocols"
import { providers,Contract, utils } from "ethers"
import Head from "next/head"
import React from "react"
import { useState, useEffect } from "react"
import { ToastContainer } from "react-toastify";
import FeedList from "../components/FeedList";
import Link from "next/link"
import getContract from "../components/getContract";
import ether from "ethers";
import { setCookie, hasCookie, getCookie} from 'cookies-next';

import ContractAbi from "./utilities/Blog.json";
import { ethers } from "ethers";

import "react-toastify/dist/ReactToastify.css";
import { BiChevronsUp } from "react-icons/bi"
import { toast } from "react-toastify";

const success = (message) => {
  toast.success(message, {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

const error = (message) => {
  toast.error(message, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

const warn = (message) => {
  toast.warn(message, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

export default function Main() {
  async function register(){
    const message = "Make me anonymous"
    if (typeof window.ethereum !== 'undefined') {
      console.log('MetaMask is installed!');
    }
  
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new providers.JsonRpcProvider(process.env.PROVIDER_URL)
    const signer = provider.getSigner()
    const signature = await signer.signMessage(message)
    const address = await signer.getAddress()
    const identity = new ZkIdentity(Strategy.MESSAGE, signature)
    const identityCommitment = identity.genIdentityCommitment()   

    const response = await fetch(`/api/register`, {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        signature: signature
      })
  })
  const result = await response.json()
  
  if(result["success"]){
    success("User successfully Registered")	
  } else {
    error("User Registration failed")
  }
    setCookie('id', identityCommitment, { path: '/' }); 
    //const c = getCookie('id')
    //console.log("Cookie : ", c)   
}

const cookieB = hasCookie("id");
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
      const contract = getContract()  
      const AllFeeds = await contract.getAllFeeds();     
      
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
      const contract = getContract()
     // contract.on("FeedCreated", onFeedCreated);
    }

    return () => {
      if (contract) {
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
    
    <header className="w-full flex justify-between h-20 items-center border-b p-4 border-borderWhiteGray dark:border-borderGray">
      <div className=" w-1/3">
        <Link href="/" className="flex items-center">
          <h1 className="text-4xl font-bold text-black-700 italic">Zk-Writers 🖊️</h1>
        </Link>
      </div>
      <div className=" w-1/3 flex justify-center items-center">
        <h1 className="text-2xl font-bold text-black-500 dark:text-black-400">
          Blog Feed!
        </h1>
      </div>

      {cookieB && connectWallet? (
        <div className="w-1/3 flex justify-end items-center">
          <Link href="/UploadPage">
            <button className="items-center bg-violet-700 rounded-full font-medium p-2 shadow-lg color-blue-500 hover:bg-green-500 focus:outline-none focus:shadow-outline text-white">
              <span className="">Create a New Feed</span>
            </button>
          </Link>
        </div>
      ) : (
        <div className=" w-1/3 flex justify-end gap-3">
          <button
            className="items-center bg-violet-700 rounded-full font-medium p-3 shadow-lg color-blue-500 hover:bg-green-500 focus:outline-none focus:shadow-outline text-white"
            onClick={() => {
              connectWallet();
            }}
          >
            <span className="">Connect your wallet</span>
          </button>
          <Link href="/Register">
            <button className="items-center bg-violet-700 rounded-full font-medium p-2 shadow-lg color-blue-500 hover:bg-green-500 focus:outline-none focus:shadow-outline text-white" onClick={register}>
              <span className="">Register</span>
            </button>
          </Link>
        </div>
      )}
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </header>
        <div className="flex-1 flex flex-row flex-wrap">
          {feeds.map((feed, index) => {
            return (
              <Link href={`/FeedPage?id=${feed.id}`} key={index}>
                <div className="w-80 h-80 m-2">
                  <FeedList feed={feed} API_TOKEN={process.env.API_TOKEN}/>
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
