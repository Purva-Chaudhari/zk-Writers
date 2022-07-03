import React from "react";
import { BiCheck } from "react-icons/bi";
import { useState } from "react";
import { Web3Storage, makeStorageClient } from 'web3.storage';
import config from "../config.json";  

import {
  AiFillTwitterCircle,
  AiFillLinkedin,
  AiFillRedditCircle,
} from "react-icons/ai";


export default function Feed({ feed, cid }) {
  
  return (
    <div>
      <img
        className=" rounded-lg w-full bg-contain h-80"
        src={`https://${feed.coverImageHash}.ipfs.dweb.link/${cid}`}
        alt="cover"
      />
      <div className="flex justify-between flex-row py-4 border-borderWhiteGray dark:border-borderGray border-b-2">
        <div>
          <h3 className="text-2xl dark:text-white">{feed.title}</h3>
          <p className="text-gray-500 mt-4">
            {feed.category} • {feed.date}
          </p>
        </div>
        <div className="flex flex-row items-center">
          <a
            className="bg-transparent dark:text-[#9CA3AF] py-2 px-6 border rounded-lg border-blue-600 mr-6 text-blue-600 hover:bg-blue-600 hover:text-white"
            href={`https://twitter.com/intent/tweet?text=${feed.title}&url=https://${feed.coverImageHash}.ipfs.dweb.link/${cid}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <AiFillTwitterCircle />
          </a>
          <a
            className="bg-transparent dark:text-[#9CA3AF] py-2 px-6 border rounded-lg border-blue-600 mr-6 text-blue-500 hover:bg-blue-600 hover:text-white"
            href={`https://www.linkedin.com/shareArticle?mini=true&url=https://ipfs.infura.io/ipfs/${feed.coverImageHash}&title=${feed.title}&summary=${feed.description}&source=https://${feed.coverImageHash}.ipfs.dweb.link/${cid}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <AiFillLinkedin />
          </a>
          <a
            className="bg-transparent dark:text-[#9CA3AF] py-2 px-6 border rounded-lg border-red-600 mr-6 text-red-600 hover:bg-red-600 hover:text-white"
            href={`https://www.reddit.com/submit?url=https://${feed.coverImageHash}.ipfs.dweb.link/${cid}&title=${feed.title}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <AiFillRedditCircle />
          </a>
        </div>
      </div>
      <p className="text-sm text-black mt-4">{feed.description}</p>
    </div>
  );
}
