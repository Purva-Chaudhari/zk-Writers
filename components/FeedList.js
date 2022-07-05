import React from "react";
import { BiCheck } from "react-icons/bi";
import { Web3Storage, makeStorageClient } from 'web3.storage'; 
import {useState} from "react";

async function retrieveFiles (cid, API_TOKEN) {
  const token = API_TOKEN
  const client = new Web3Storage({ token })
  const res = await client.get(cid)
  // unpack File objects from the response
  const files = await res.files()
  return files[0].name
}

export default function FeedList({ horizontal, feed , API_TOKEN}) {
  const [data, setData] = useState({});
  const cid = feed.coverImageHash;
  if (cid){
    retrieveFiles(cid, API_TOKEN)
   .then((fn) => setData(fn))
  }
  return (
    <div
      className={`${
        horizontal
          ? "flex flex-row mx-5 mb-5 item-center justify-center"
          : "flex flex-col m-5"
      } `}
    >
      <div className="overflow-hidden transition-shadow duration-300 bg-white rounded shadow-sm">
      <img
        className={
          horizontal
            ? "object-cover rounded-lg w-60 h-40"
            : "object-cover rounded-lg w-full h-40"
        }
        
        src={`https://${feed.coverImageHash}.ipfs.dweb.link/${data}`}
        alt="cover"
      />
      <div className={horizontal && "ml-3  w-80"}>
        <h4 className="text-md font-bold dark:text-white mt-3 text-black">
          {feed.title}
        </h4>
        {horizontal && (
          <p className="text-sm flex items-center text-textSubTitle mt-1 text-black p-2">
            {feed.category}
          </p>
        )}
        {horizontal && (
          <p className="text-sm flex items-center text-textSubTitle text-black mt-1 ">
            {feed.description.slice(0, 30)}
            {/* <BiCheck size="20px" color="green" className="ml-1" /> */}
          </p>
        )}
        <p className="text-sm flex items-center text-textSubTitle mt-1 text-black p-2">
          {horizontal ? null : feed.category}
        </p>
      </div>
      </div>
    </div>
  );
}