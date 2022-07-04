import React from "react";
import { BiCheck } from "react-icons/bi";
import { Web3Storage, makeStorageClient } from 'web3.storage';
import config from "../config.json";  
import {useState} from "react";

async function retrieveFiles (cid) {
  const token = config.API_TOKEN
  const client = new Web3Storage({ token })
  const res = await client.get(cid)
  //console.log(`Got a response! [${res.status}] ${res.statusText}`)
  // unpack File objects from the response
  const files = await res.files()
  return files[0].name
}

export default function FeedList({ horizontal, feed }) {
  const [data, setData] = useState({});
  const cid = feed.coverImageHash;
  if (cid){
    retrieveFiles(cid)
   .then((fn) => setData(fn))
  }
 // console.log(feed.description.slice(0, 30))
  return (
    // <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
    // <div className="grid gap-8 lg:grid-cols-3 sm:max-w-sm sm:mx-auto lg:max-w-full">
    //   <div className="overflow-hidden transition-shadow duration-300 bg-white rounded shadow-sm">
    //   <img
    //         src={`https://${feed.coverImageHash}.ipfs.dweb.link/${data}}?auto=compress&amp;cs=tinysrgb&amp;dpr=2&amp;w=500`}
    //         className="object-cover w-full h-64"
    //         alt="cover"
    //       />
    //   <div className="p-5 border border-t-0">
    //         <p className="mb-3 text-xs font-semibold tracking-wide uppercase">
    //           <a
    //             href="/"
    //             className="transition-colors duration-200 text-blue-gray-900 hover:text-deep-purple-accent-700"
    //             aria-label="Category"
    //             title={feed.category}
    //           >
    //             {feed.category}
    //           </a>
    //           <span className="text-gray-600">— 28 Dec 2020</span>
    //         </p>
    //         <a
    //           href="/"
    //           aria-label="Category"
    //           title="Visit the East"
    //           className="inline-block mb-3 text-2xl font-bold leading-5 transition-colors duration-200 hover:text-deep-purple-accent-700"
    //         >
    //           Visit the East
    //         </a>
    //         <p className="mb-2 text-gray-700">
    //           Sed ut perspiciatis unde omnis iste natus error sit sed quia
    //           consequuntur magni voluptatem doloremque.
    //         </p>
    //         <a
    //           href="/"
    //           aria-label=""
    //           className="inline-flex items-center font-semibold transition-colors duration-200 text-deep-purple-accent-400 hover:text-deep-purple-800"
    //         >
    //           Learn more
    //         </a>
    //       </div>
    //   </div>
    // </div>
    // </div>


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