import React from "react";
import { BiCheck } from "react-icons/bi";
import { Web3Storage, makeStorageClient } from 'web3.storage';
import config from "../config.json";  
import {useState} from "react";
async function retrieveFiles (cid) {
  const token = config.API_TOKEN
  const client = new Web3Storage({ token })
  const res = await client.get(cid)
  // unpack File objects from the response
  const files = await res.files()
  return files[0].name
}
export default function FeedList({ horizontal, feed }) {
  const [data, setData] = useState({});
  const cid = feed.coverImageHash;
  const token = config.API_TOKEN
  const client = new Web3Storage({ token })
  const res =   client.get(cid)
  // unpack File objects from the response
  //const files =  res.files()
  
   retrieveFiles(cid)
   .then((fn) => setData(fn))
  console.log("File name ")
  console.log(data)
  return (
    // <div
    //   className={`${
    //     horizontal
    //       ? "flex flex-row mx-5 mb-5 item-center justify-center"
    //       : "flex flex-col m-5"
    //   } `}
    // >
    //   <img
    //     className={
    //       horizontal
    //         ? "object-cover rounded-lg w-60 h-40"
    //         : "object-cover rounded-lg w-full h-40"
    //     }
        
    //     src={`https://${feed.coverImageHash}.ipfs.dweb.link/${data}`}
    //     alt="cover"
    //   />
    //   <div className={horizontal && "ml-3  w-80"}>
    //     <h4 className="text-md font-bold dark:text-white mt-3 text-black">
    //       {feed.title}
    //     </h4>
    //     {horizontal && (
    //       <p className="text-sm flex items-center text-textSubTitle mt-1 text-black p-2">
    //         {feed.category}
    //       </p>
    //     )}
    //     {horizontal && (
    //       <p className="text-sm flex items-center text-textSubTitle mt-1 ">
    //         {feed.description.slice(0, 30)}
    //         <BiCheck size="20px" color="green" className="ml-1" />
    //       </p>
    //     )}
    //     <p className="text-sm flex items-center text-textSubTitle mt-1 text-black p-2">
    //       {horizontal ? null : feed.category}
    //     </p>
    //   </div>
    // </div>
    <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
    <div className="grid gap-5 lg:grid-cols-3 sm:max-w-sm sm:mx-auto lg:max-w-full">
      <div className="overflow-hidden transition-shadow duration-300 bg-white rounded">
        <a href="/" aria-label="Article">
          <img
            src={`https://${feed.coverImageHash}.ipfs.dweb.link/${data}?auto=compress&amp;cs=tinysrgb&amp;dpr=3&amp;h=750&amp;w=1260`}
            className="object-cover w-full h-64 rounded"
            alt=""
          />
        </a>
        <div className="py-5">
          <p className="mb-2 text-xs font-semibold text-gray-600 uppercase">
          {feed.category}
          </p>
          <a
            href="/"
            aria-label="Article"
            className="inline-block mb-3 text-black transition-colors duration-200 hover:text-deep-purple-accent-700"
          >
            <p className="text-2xl font-bold leading-5">{feed.title}</p>
          </a>
          <p className="mb-4 text-gray-700">
            {feed.description.slice(0, 30)}
          </p>
          <div className="flex space-x-4">
            <a
              href="/"
              aria-label="Likes"
              className="flex items-start text-gray-800 transition-colors duration-200 hover:text-deep-purple-accent-700 group"
            >
              <div className="mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="w-5 h-5 text-gray-600 transition-colors duration-200 group-hover:text-deep-purple-accent-700"
                >
                  <polyline
                    points="6 23 1 23 1 12 6 12"
                    fill="none"
                    strokeMiterlimit="10"
                  />
                  <path
                    d="M6,12,9,1H9a3,3,0,0,1,3,3v6h7.5a3,3,0,0,1,2.965,3.456l-1.077,7A3,3,0,0,1,18.426,23H6Z"
                    fill="none"
                    stroke="currentColor"
                    strokeMiterlimit="10"
                  />
                </svg>
              </div>
              <p className="font-semibold">7.4K</p>
            </a>
            <a
              href="/"
              aria-label="Comments"
              className="flex items-start text-gray-800 transition-colors duration-200 hover:text-deep-purple-accent-700 group"
            >
              <div className="mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="w-5 h-5 text-gray-600 transition-colors duration-200 group-hover:text-deep-purple-accent-700"
                >
                  <polyline
                    points="23 5 23 18 19 18 19 22 13 18 12 18"
                    fill="none"
                    strokeMiterlimit="10"
                  />
                  <polygon
                    points="19 2 1 2 1 14 5 14 5 19 12 14 19 14 19 2"
                    fill="none"
                    stroke="currentColor"
                    strokeMiterlimit="10"
                  />
                </svg>
              </div>
              <p className="font-semibold">81</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}
