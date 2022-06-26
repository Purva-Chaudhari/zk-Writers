import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { ToastContainer } from "react-toastify";
import FeedList from "./components/FeedList";
import { Link } from "react-router-dom";
import getContract from "./utilities/getContract";

import { success, error, warn } from "./utilities/response";

import "react-toastify/dist/ReactToastify.css";

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

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);
    } catch (err) {
      error(`${err.message}`);
    }
  };

  /*
   * This runs our function when the page loads.
   */
  useEffect(() => {
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
      location,
      category,
      coverImageHash,
      date,
      author
    ) => {
      setFeeds((prevState) => [
        ...prevState,
        {
          id,
          title,
          description,
          location,
          category,
          coverImageHash,
          date,
          author,
        },
      ]);
    };

    let contract;

    if (window.ethereum) {
      contract = getContract();
      contract.on("FeedCreated", onFeedCreated);
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
        <Header
          currentAccount={currentAccount}
          connectWallet={connectWallet}
          ToastContainer={ToastContainer}
        />
        <div className="flex-1 flex flex-row flex-wrap">
          //..
        </div>
      </div>
    </div>
  );
}

const Loader = () => {
 //...
};