import React, { Component, useEffect, useState } from "react";
import getContract from "./utilities/getContract";
import Link from "next/link";
import Feed from "../components/Feed";
import ContractAbi from "./utilities/Blog.json";
import { ethers } from "ethers";  

export default function FeedPage (){

  const [relatedFeeds, setRelatedFeeds] = useState([]);

  // state variable to store the current feed
  const [feed, setFeed] = useState([]);

  // Function to get the feed id from the url
  const getUrlValue = () => {
    let vars = {};
    window.location.href.replace(
      /[?&]+([^=&]+)=([^&]*)/gi,
      function (m, key, value) {
        vars[key] = value;
      }
    );
    console.log("Check ID Feedpage")
    console.log(vars)
    return vars;
  };

  /*
   * Get Feed
   */
  const getFeed = async () => {
    try {
      // const provider = await new ethers.providers.Web3Provider(window.ethereum);
      // const signer = provider.getSigner();
      // console.log("Get feed FeedPage")
      // console.log(process.env.ZK_CONTRACT_ADDRESS)
      // const contract = await new ethers.Contract(
      //   "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
      //   ContractAbi.abi,
      //   signer,
      // );
      const contract = await getContract()
      let feedId = getUrlValue()["id"];
      const singleFeed = await contract.getFeed(feedId-1);

      // Format feed
      const formattedFeed = {
        id: singleFeed[0],
        title: singleFeed[1],
        description: singleFeed[2],
        category: singleFeed[3],
        coverImageHash: singleFeed[4],
      };

      setFeed(formattedFeed);
    } catch (error) {
      console.log(error);
    }
  };

  const [likes, setLikes] = useState(0);
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    if (isClicked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setIsClicked(!isClicked);
  };

  /*
   * Get Related Feeds
   */
  const getRelatedFeeds = async () => {
    try {
      // const provider = await new ethers.providers.Web3Provider(window.ethereum);
      // const signer = provider.getSigner();
      // console.log("Get related feed")
      // console.log(process.env.ZK_CONTRACT_ADDRESS)
      // const contract = await new ethers.Contract(
      //   "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
      //   ContractAbi.abi,
      //   signer,
      // );
      const contract = await getContract()
      console.log("Hellllllp")
      let feedId = getUrlValue()["id"];
      console.log(feedId)
      // Get all feeds and return feeds and filter only the one in the same category as the feed
      const allFeeds = await contract.getAllFeeds();
      console.log(allFeeds);
      const singleFeed = await contract.getFeed(feedId-1);
      // Format feed
      const formattedSingleFeed = {
        id: singleFeed[0],
        title: singleFeed[1],
        description: singleFeed[2],
        category: singleFeed[3],
        coverImageHash: singleFeed[4],
        date: singleFeed[5],
      };
      const relatedFeeds = allFeeds.filter(
        (feed) => feed.category === formattedSingleFeed.category
      );

      const formattedFeeds = relatedFeeds.map((feed) => {
        return {
          id: feed.id,
          title: feed.title,
          description: feed.description,
          category: feed.category,
          coverImageHash: feed.coverImageHash,
          date: feed.date,
        };
      });

      setRelatedFeeds(formattedFeeds);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getFeed();
    getRelatedFeeds();
  }, []);

  return (
    <div className="w-full  flex flex-row">
      <div className="flex-1 flex flex-col">
        <div className="flex flex-col m-10 justify-between lg:flex-row">
          <div className="lg:w-4/6 w-6/6">{feed && <Feed feed={feed, process.env.API_TOKEN}/>}</div>
          <div className="w-2/6">
            <h4 className="text-xl font-bold dark:text-white ml-5 mb-3 text-black">
              {/* Related Feeds */}
              <button className={ `like-button ${isClicked && 'liked'}` } onClick={ handleClick }>
                <span className="likes-counter">{ `❤️ Like | ${likes}` }</span>
              </button>
              <Link href="/">
                <button className="bg-red-600 hover:bg-red-800 text-white font-bold px-2 rounded ml-10">
                  Go Back
                </button>
              </Link>
            </h4>
            {/* {relatedFeeds.map((f) => {
              return (
                <col key = {f.id} sm="4">
                <Link
                  onClick={() => {
                    setFeed(f);
                  }}
                  to={`/FeedPage?id=${f.id}`}
                >
                  <FeedList feed={f} horizontal={true} />
                </Link>
                </col>
              
              );
            })} */}
          </div>
        </div>
      </div>
    </div>
  );
}
