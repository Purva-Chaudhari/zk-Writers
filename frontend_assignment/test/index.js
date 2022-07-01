const { expect } = require("chai");
const { Strategy, ZkIdentity } = require("@zk-kit/identity")
const { generateMerkleProof, Semaphore, Group} = require("@zk-kit/protocols")
//import { expect } from "chai"
const { Contract, Signer } = require("ethers")
const { ethers, run } = require("hardhat")

describe("Blog", function () {
  const wasmFilePath = "./public/semaphore.wasm"
  const finalZkeyPath = "./public/semaphore_final.zkey"

  let BlogFeed;
  let BlogFeedContract;
  let contractOwner;

  before(async () => {
    BlogFeedContract = await run("deploy", { logs: false })
   const signers = await ethers.getSigners()
   contractOwner = signers[0]
  });

  it("should Register", async () => {
    const message = await contractOwner.signMessage("Register: zkWriter")

    const identity = new ZkIdentity(Strategy.MESSAGE, message)
    const identityCommitment = identity.genIdentityCommitment()

    const tx = await BlogFeedContract.addMember(identityCommitment)
    const rc = await tx.wait()

    BlogFeedContract.on("MemberAdded", (groupId, commitmentId) => {
        console.log(groupId, commitmentId);
    });

    expect(BlogFeedContract.address).to.not.be.null;
    const value = await BlogFeedContract.getTotalFeeds();
    expect(value.toString()).to.equal("0");

      const signal = "Login into test"
      const bytes32Greeting = ethers.utils.formatBytes32String(signal)

      const merkleProof = generateMerkleProof(20, BigInt(0), [identityCommitment], identityCommitment)
      const witness = Semaphore.genWitness(
          identity.getTrapdoor(),
          identity.getNullifier(),
          merkleProof,
          merkleProof.root,
          signal
      )

      const fullProof = await Semaphore.genProof(witness, wasmFilePath, finalZkeyPath)
      const solidityProof = Semaphore.packToSolidityProof(fullProof.proof)

      const nullifierHash = Semaphore.genNullifierHash(merkleProof.root, identity.getNullifier())

      const transaction = await BlogFeedContract.createFeed(
        "Hello World",
        "New York world",
        "Sports",
        "0x123",
        "2022-05-05",  
        bytes32Greeting,
          merkleProof.root,
          nullifierHash, 
          merkleProof.root,
          solidityProof
      )
      console.log(await transaction.wait())
      expect(tx.hash).to.not.be.null;


//   it("should deploy", async () => {
//     expect(BlogFeedContract.address).to.not.be.null;
//   });

//   it("should have a default value of 0", async () => {
//     const value = await BlogFeedContract.getTotalFeeds();
//     expect(value.toString()).to.equal("0");
//   });

//   it("should create feed", async () => {
//     const message = await contractOwner.signMessage("Register: zkWriter")

//     const identity = new ZkIdentity(Strategy.MESSAGE, message)
//     const identityCommitment = identity.genIdentityCommitment()

//     const tx = await BlogFeedContract.addMember(identityCommitment)
//     const rc = await tx.wait()

//     BlogFeedContract.on("MemberAdded", (groupId, commitmentId) => {
//         console.log(groupId, commitmentId);
//     });

//     const signal = "Login into test"
//     const bytes32Greeting = ethers.utils.formatBytes32String(signal)

//     const merkleProof = generateMerkleProof(20, BigInt(0), [identityCommitment], identityCommitment)
//     const witness = Semaphore.genWitness(
//         identity.getTrapdoor(),
//         identity.getNullifier(),
//         merkleProof,
//         merkleProof.root,
//         signal
//     )

//     const fullProof = await Semaphore.genProof(witness, wasmFilePath, finalZkeyPath)
//     const solidityProof = Semaphore.packToSolidityProof(fullProof.proof)

//     const nullifierHash = Semaphore.genNullifierHash(merkleProof.root, identity.getNullifier())

//     const transaction = await BlogFeedContract.createFeed(
//       "Hello World",
//       "New York world",
//       "Sports",
//       "0x123",
//       "2022-05-05",  
//       bytes32Greeting,
//         merkleProof.root,
//         nullifierHash, 
//         merkleProof.root,
//         solidityProof
//     )
//     console.log(await transaction.wait())
//     expect(tx.hash).to.not.be.null;
//     //await expect(transaction).to.emit(contract, "NewGreeting").withArgs(bytes32Greeting)*/
// })

  // it("should be able to create feed", async () => {
  //   const tx = await BlogFeedContract.createFeed(
  //     "Hello World",
  //     "New York world",
  //     "Sports",
  //     "0x123",
  //     "2022-05-05"
  //   );
  //   expect(tx.hash).to.not.be.null;
  // });

  // it("should be able to get feeds", async () => {
  //   const tx = await BlogFeedContract.createFeed(
  //     "Hello World",
  //     "New York world",
  //     "Sports",
  //     "0x123",
  //     "2022-05-05"
  //   );

  //   // get feeds
  //   const feeds = await BlogFeedContract.getAllFeeds();
  //   expect(feeds.length).to.equal(2);
  // });

  // it("should be able to get feed count", async () => {
  //   const tx = await BlogFeedContract.createFeed(
  //     "Hello World",
  //     "New York world",
  //     "Sports",
  //     "0x123",
  //     "2022-05-05"
  //   );
  //   const newsCount = await BlogFeedContract.getTotalFeeds();
  //   expect(newsCount.toString()).to.equal("3");
  // });

  // it("should be able to get feed by id", async () => {
  //   const tx = await BlogFeedContract.createFeed(
  //     "Hello World",
  //     "New York world",
  //     "Sports",
  //     "0x123",
  //     "2022-05-05"
  //   );
  //   const news = await BlogFeedContract.getFeed(2);
  //   expect(news.title).to.equal("Hello World");
  // });
});
})