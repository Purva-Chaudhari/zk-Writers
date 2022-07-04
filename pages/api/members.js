const ethers = require("ethers");
//const {getContract} = require("./_utils")
const ZK_CONTRACT_ADDRESS = process.env.ZK_CONTRACT_ADDRESS
const PRIVATE_KEY = process.env.PRIVATE_KEY
const PROVIDER_URL = process.env.PROVIDER_URL
const zkWritersABI = require("../utilities/Blog.json")
function getContract() {
  const provider = new ethers.providers.JsonRpcProvider(PROVIDER_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  const contract = new ethers.Contract(
    ZK_CONTRACT_ADDRESS,
    zkWritersABI['abi'],
    wallet
  );
  return contract;
}
export default async function handler(req, res) {
  const contract = getContract();
  const Bmembers = await contract.getMembers(); 
  console.log("In members API")
  console.log(Bmembers)
  //const members = JSON.stringify(Bmembers)
  const members = Bmembers.map(Bid => Bid.toHexString())
  
  console.log(members)
  
  res.json({members: members})
}