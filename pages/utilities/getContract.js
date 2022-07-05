import ContractAbi from "./Blog.json";
import { ethers } from "ethers";
// require('dotenv').config({ path: '../../env' })
const ZK_CONTRACT_ADDRESS = process.env.ZK_CONTRACT_ADDRESS;

export default function getContract() {
  console.log("Go to hell")
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  console.log(ZK_CONTRACT_ADDRESS)
  let contract = new ethers.Contract(
    "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
    ContractAbi.abi,
    signer,
  );
  return contract;
}
