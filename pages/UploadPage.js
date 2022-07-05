import React, { useState, useRef } from "react";
import { BiCloud, BiPlus } from "react-icons/bi";
import { ToastContainer } from "react-toastify";

//import { success, error, defaultToast } from "./utilities/response";
import { Web3Storage, getFilesFromPath } from 'web3.storage'  
import { providers,Contract, utils } from "ethers"
import { Strategy, ZkIdentity } from "@zk-kit/identity"
import { generateMerkleProof,genExternalNullifier, Semaphore } from "@zk-kit/protocols"
import { ethers } from "ethers";
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

const defaultToast = (message) => {
  toast(message, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};
 const token = process.env.API_TOKEN
//const token = process.env.API_TOKEN
 const client = new Web3Storage({ token })

 async function getAllMembers(){
  let response = await fetch("/api/members")
  let result = await response.json()
  return result["members"]
  //return [id]
}

 async function storeFiles (file) {
   const files = [file]

   const cid = await client.put(files)

   return cid;

 }

export default function Upload() {
  /*
   * A state variable we use to store new feed input.
   */
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [coverImage, setCoverImage] = useState("");

  /*
   * Create an IPFS node
   */
  //const client = create("https://ipfs.infura.io:5001/api/v0");
  const coverImageRef = useRef();

  /*
   * A function to handle validation of uploading a new feed.
   */
  const handleSubmit = async () => {
    if (
      title === "" ||
      description === "" ||
      category === "" ||
      coverImage === ""
    ) {
      error("Please, all the fields are required!");
      return;
    }

    /*
     * Upload the cover image to IPFS
     */
    uploadCoverImage(coverImage);
  };

  /*
   * A function to upload a cover image to IPFS
   */
  const uploadCoverImage = async (coverImage) => {
    defaultToast("Uploading Cover Image...");

    try {
      
      //const image = await client.add(coverImage);
      
      /*
       * Save the new feed to the blockchain
       */
      const image = await storeFiles(coverImage); 
      await saveFeed(image);
    } catch (err) {
      error("Error Uploading Cover Image");
    }
  };

  /*
   * A function to save a new feed to the blockchain
   */
  const saveFeed = async (coverImage) => {
    defaultToast("Saving Feed..."); 

    //console.log(title, description, category, coverImage);  

    try{  
    const message = "Make me anonymous"
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const signature = await signer.signMessage(message)
    const address = await signer.getAddress()  
  
    const identity = new ZkIdentity(Strategy.MESSAGE, signature)
    const identityCommitment = identity.genIdentityCommitment()
    const abiCoder = new ethers.utils.AbiCoder();
	 const formattedIdentityCommitment = abiCoder.encode(
	  ['uint256'],
	  [identityCommitment]
	);
    var identityCommitments =[]
    identityCommitments = await getAllMembers();
  
    
        const merkleProof = generateMerkleProof(
            20, 
            0, 
            identityCommitments,
            identityCommitment
        )
  
        const signal = "My post"
        const nullifier = BigInt(Math.floor((Math.random() * 2**256) + 1));
        const externalNullifier = Semaphore.genNullifierHash(genExternalNullifier(nullifier), identity.getNullifier())
        const witness = Semaphore.genWitness(
            identity.getTrapdoor(),
            identity.getNullifier(),
            merkleProof,
            externalNullifier,
            signal
        )   
        //console.log("Semaphore proof generated before")
        const { proof, publicSignals } = await Semaphore.genProof(witness, "./semaphore.wasm", "./semaphore_final.zkey")
        const solidityProof = Semaphore.packToSolidityProof(proof)
        const UploadedDate = String(new Date());

        //console.log("Semaphore proof generated after")
    
      const bytes32Greeting = ethers.utils.formatBytes32String(signal)
      /*
       * Save the new feed to the blockchain
       */
      // await contract.createFeed(
      //   title,
      //   description,
      //   category,
      //   coverImage,
      //   UploadedDate,
      //   bytes32Greeting,
      //   merkleProof.root.toString(),
      //   publicSignals.nullifierHash.toString(), 
      //   publicSignals.externalNullifier.toString(),
      //   solidityProof
      // );
        
        let response = await fetch("/api/createFeed",{
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: title,
                description: description,
                category: category,
                coverImage: coverImage,
                UploadedDate: UploadedDate,
                signedMessage: signature,
                signal: signal,
                root: merkleProof.root.toString(),
                nullifierHash: publicSignals.nullifierHash.toString(),
                externalNullifier: publicSignals.externalNullifier.toString(),
                proof: solidityProof
            })
        })
        let result = await response.json() 

        if(result["success"]){
          console.log("Result is success")
          success("Feed Saved Successfully");
          window.location.href = "/";

           // reset form
          setTitle("");
          setDescription("");
          setCategory("");
          setCoverImage("");

        } else {
          console.log("Result is failed")
            error("Error Occured")
        }
      
    } catch (err) {
      console.log(err);
      error("Error Saving Feed");
    }
  };

  // Handles redirect to Home Page or previous page
  const goBack = () => {
    window.history.back();
  };

  return (
    <div className="w-full h-screen flex flex-row">
      <div className="flex-1 flex flex-col">
        <div className="mt-5 mr-10 flex  justify-end">
          <div className="flex items-center">
            <button
              className="bg-transparent  dark:text-[#9CA3AF] py-2 px-6 border rounded-lg  border-gray-600  mr-6"
              onClick={() => {
                goBack();
              }}
            >
              Discard
            </button>
            <button
              onClick={() => {
                handleSubmit();
              }}
              className="bg-blue-500 hover:bg-blue-700 text-white py-2 rounded-lg flex px-4 justify-between flex-row items-center"
            >
              <BiCloud />
              <p className="ml-2">Upload</p>
            </button>
          </div>
        </div>
        <div className="flex flex-col m-10 mt-5 lg:flex-row lg:justify-center">
          <div className="flex lg:w-3/4 flex-col ">
            <label className="text-gray-600 dark:text-[#9CA3AF] text-md font-bold mb-2">
              Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Web3 is taking over the world!"
              className="w-[60%] dark:text-white dark:placeholder:text-gray-600 rounded-xl mt-2 h-12 p-2 border border-borderWhiteGray bg-white dark:bg-backgroundBlack dark:border-[#444752] focus:outline-none"
            />
            <label className="text-gray-600 dark:text-[#9CA3AF] mt-10 text-md font-bold">
              Body
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Web3 is all about decentralization — it aims to give users more control over their data."
              className="w-[60%] dark:text-white dark:placeholder:text-gray-600 rounded-xl mt-2 h-32 p-2 border border-borderWhiteGray bg-white dark:bg-backgroundBlack dark:border-[#444752] focus:outline-none"
            />

            <div className="flex flex-row mt-10 w-[60%] justify-between">
              <div className="flex flex-col w-2/5">
                <label className="text-gray-600 dark:text-[#9CA3AF] text-md font-bold">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="dark:text-white mt-2 h-12 p-2 dark:border-gray-600 border rounded-xl border-borderWhiteGray bg-white dark:bg-backgroundBlack dark:text-[#9CA3AF] focus:outline-none"
                >
                  <option>Select a category</option>
                  <option>Finance</option>
                  <option>Sports</option>
                  <option>Gaming</option>
                  <option>News</option>
                  <option>Economics</option>
                  <option>Education</option>
                  <option>Technology</option>
                  <option>Politics</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
            <label className="text-gray-600 dark:text-[#9CA3AF] mt-10 text-md font-bold">
              Cover Image
            </label>

            <div
              onClick={() => {
                coverImageRef.current.click();
              }}
              className="border-2 w-64 dark:border-gray-600 border-dashed border-borderWhiteGray rounded-md mt-2 p-2 h-46 items-center justify-center flex flex-row"
            >
              {coverImage ? (
                <img
                  onClick={() => {
                    coverImageRef.current.click();
                  }}
                  src={URL.createObjectURL(coverImage)}
                  alt="coverImage"
                  className="h-full rounded-md w-full"
                />
              ) : (
                <BiPlus size={70} color="gray" />
              )}
            </div>

            <input
              type="file"
              className="hidden"
              ref={coverImageRef}
              onChange={(e) => {
                setCoverImage(e.target.files[0]);
              }}
            />
          </div>
        </div>
      </div>
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
    </div>
  );
}
