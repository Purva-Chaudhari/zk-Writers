import React from "react";
import Link from "next/link";
import detectEthereumProvider from "@metamask/detect-provider"
import { Strategy, ZkIdentity } from "@zk-kit/identity"
import { generateMerkleProof, Semaphore } from "@zk-kit/protocols"
import { providers,Contract, utils } from "ethers"
import Head from "next/head"
import { useState, useEffect } from "react"


export const Header = ({ currentAccount, connectWallet, ToastContainer }) => {
  async function register(){
    const message = "Make me anonymous"
    if (typeof window.ethereum !== 'undefined') {
      console.log('MetaMask is installed!');
    }
    
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const signature = await signer.signMessage(message)
    const address = await signer.getAddress()
    console.log({ signer, signature, address })
    const identity = new ZkIdentity(Strategy.MESSAGE, signature)
    const identityCommitment = identity.genIdentityCommitment()
    console.log(identityCommitment)    

    fetch(`http://localhost:8000/register`, {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          identityCommitment: identityCommitment.toString()
        })
    })
    .then(response => response.json())
    .then(json => console.log(json));
}

  return (
    <header className="w-full flex justify-between h-20 items-center border-b p-4 border-borderWhiteGray dark:border-borderGray">
      <div className=" w-1/3">
        <Link href="/" className="flex items-center">
          <h1 className="text-2xl font-bold text-black-700">Home</h1>
        </Link>
      </div>
      <div className=" w-1/3 flex justify-center items-center">
        <h1 className="text-2xl font-bold text-black-500 dark:text-black-400">
          Blog Feed!
        </h1>
      </div>

      {currentAccount ? (
        <div className="w-1/3 flex justify-end items-center gap-x-3">
          <div><Link href="/UploadPage">
            <button className="items-center bg-black rounded-full font-medium p-2 shadow-lg  color-blue-500 hover:bg-green-500 focus:outline-none focus:shadow-outline text-white">
              <span className="">Create a New Feed</span>
            </button>
          </Link></div>
          <div>
          <Link href="/Register">
            <button className="items-center bg-black rounded-full font-medium p-2 shadow-lg color-blue-500 hover:bg-green-500 focus:outline-none focus:shadow-outline text-white" onClick={register}>
              <span className="">Register</span>
            </button>
          </Link>
        </div>
          
        </div>
      ) : (
        <div className=" w-1/3 flex justify-end">
          <button
            className="items-center bg-green-700 rounded-full font-medium p-3 shadow-lg color-blue-500 hover:bg-green-500 focus:outline-none focus:shadow-outline text-white"
            onClick={() => {
              connectWallet();
            }}
          >
            <span className="">Connect your wallet</span>
          </button>
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
  );
};
