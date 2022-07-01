import React from "react";
import { BiCheck } from "react-icons/bi";
import {
  AiFillTwitterCircle,
  AiFillLinkedin,
  AiFillRedditCircle,
} from "react-icons/ai";
async function retrieveFiles (cid) {
  const token = config.API_TOKEN
  const client = new Web3Storage({ token })
  const res = await client.get(cid)
  // unpack File objects from the response
  const files = await res.files()
  return files[0].name
}
export default function Feed({ feed }) {
  const [data, setData] = useState({});
  const cid = feed.coverImageHash;
  const token = config.API_TOKEN
  const client = new Web3Storage({ token })
  const res =   client.get(cid)
  
   retrieveFiles(cid)
   .then((fn) => setData(fn))
  return (
    <div>
      <img
        className=" rounded-lg w-full bg-contain h-80"
        src={`https://${feed.coverImageHash}.ipfs.dweb.link/${data}`}
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
            href={`https://twitter.com/intent/tweet?text=${feed.title}&url=https://${feed.coverImageHash}.ipfs.dweb.link/${data}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <AiFillTwitterCircle />
          </a>
          <a
            className="bg-transparent dark:text-[#9CA3AF] py-2 px-6 border rounded-lg border-blue-600 mr-6 text-blue-500 hover:bg-blue-600 hover:text-white"
            href={`https://www.linkedin.com/shareArticle?mini=true&url=https://ipfs.infura.io/ipfs/${feed.coverImageHash}&title=${feed.title}&summary=${feed.description}&source=https://${feed.coverImageHash}.ipfs.dweb.link/${data}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <AiFillLinkedin />
          </a>
          <a
            className="bg-transparent dark:text-[#9CA3AF] py-2 px-6 border rounded-lg border-red-600 mr-6 text-red-600 hover:bg-red-600 hover:text-white"
            href={`https://www.reddit.com/submit?url=https://${feed.coverImageHash}.ipfs.dweb.link/${data}&title=${feed.title}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <AiFillRedditCircle />
          </a>
        </div>
      </div>

      <div className="flex mt-5 flex-row items-center ">
        <div className="flex items-center text-textSubTitle mt-1">
          Author: {feed?.author?.slice(0, 12)}...
          <BiCheck size="20px" color="green" className="ml-1" />
        </div>
      </div>
      <p className="text-sm text-black mt-4">{feed.description}</p>
    </div>
  );
}
