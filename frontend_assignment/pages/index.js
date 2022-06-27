import detectEthereumProvider from "@metamask/detect-provider"
import { Strategy, ZkIdentity } from "@zk-kit/identity"
import { generateMerkleProof, Semaphore } from "@zk-kit/protocols"
import { providers,Contract, utils } from "ethers"
import Head from "next/head"
import React from "react"
import { useState, useEffect } from "react"
import GreetForm from "./components/GreetingForm";

//import Greeter from "artifacts/contracts/Greeters.sol/Greeters.json"

import { Header } from "./components/Header";
import { ToastContainer } from "react-toastify";
import FeedList from "./components/FeedList";
import Link from "next/link"
import getContract from "./utilities/getContract";

import { success, error, warn } from "./utilities/response";

import "react-toastify/dist/ReactToastify.css";
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

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
        params: [{
          chainId: "31337",
          rpcUrls: ["http://localhost:8545/"],
          chainName: "localhost",
          nativeCurrency: {
              name: "ETH",
              symbol: "ETH",
              decimals: 18
          },
          blockExplorerUrls: []
      }]
      });
      setCurrentAccount(accounts[0]);
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
      const total = await contract.getTotalFeeds();
      console.log("Stage 3 ", total);
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


// export default function Home() {
//   const [message, setMessage] = useState('')
//   const [greetings, setGreetings] = useState([])

//   useEffect(() => {
//     const listener = async () => {
//       const contract = new Contract(
//         '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
//         Greeter.abi,
//       )

//       const provider = new providers.JsonRpcProvider('http://localhost:8545')

//       const contractOwner = contract.connect(provider.getSigner())

//       contractOwner.on('NewGreeting', (greeting) => {
//         const message = utils.parseBytes32String(greeting)
//         setGreetings((greetings) => [...greetings, message])
//       })
//     }
//     listener()
//   }, []);
//     const [logs, setLogs] = React.useState("Connect your wallet and greet!")

//     async function greet() {
//         setLogs("Creating your Semaphore identity...")

//         const provider = (await detectEthereumProvider())

//         await provider.request({ method: "eth_requestAccounts" })

//         const ethersProvider = new providers.Web3Provider(provider)
//         const signer = ethersProvider.getSigner()
//         const message = await signer.signMessage("Sign this message to create your identity!")

//         const identity = new ZkIdentity(Strategy.MESSAGE, message)
//         const identityCommitment = identity.genIdentityCommitment()
//         const identityCommitments = await (await fetch("./identityCommitments.json")).json()

//         const merkleProof = generateMerkleProof(20, BigInt(0), identityCommitments, identityCommitment)

//         setLogs("Creating your Semaphore proof...")

//         const greeting = "Hello world"

//         const witness = Semaphore.genWitness(
//             identity.getTrapdoor(),
//             identity.getNullifier(),
//             merkleProof,
//             merkleProof.root,
//             greeting
//         )

//         const { proof, publicSignals } = await Semaphore.genProof(witness, "./semaphore.wasm", "./semaphore_final.zkey")
//         const solidityProof = Semaphore.packToSolidityProof(proof)

//         const response = await fetch("/api/greet", {
//             method: "POST",
//             body: JSON.stringify({
//                 greeting,
//                 nullifierHash: publicSignals.nullifierHash,
//                 solidityProof: solidityProof
//             })
//         })

//         if (response.status === 500) {
//             const errorMessage = await response.text()

//             setLogs(errorMessage)
//         } else {
//             setLogs("Your anonymous greeting is onchain :)")
//         }
//     }

//     return (
//         <div className={styles.container}>
//             <Head>
//                 <title>Greetings</title>
//                 <meta name="description" content="A simple Next.js/Hardhat privacy application with Semaphore." />
//                 <link rel="icon" href="/favicon.ico" />
//             </Head>

//             <main className={styles.main}>
//                 <h1 className={styles.title}>Greetings</h1>

//                 <p className={styles.description}>A simple Next.js/Hardhat privacy application with Semaphore.</p>

//                 <div className={styles.logs}>{logs}</div>

//                 <div onClick={() => greet()} className={styles.button}>
//                     Greet
//                 </div>
//                 <GreetForm/>
//                 <textarea     
//                   placeholder="Default message"
//                   value={greetings}
//                   onChange={(e) => {
//                   setMessage(e.target.value)}}
//                 />
                
//             </main>
//         </div>
//     )
// }