import ContractAbi from "../pages/utilities/Blog.json";
import { ethers } from "ethers";
// require('dotenv').config({ path: '../../env' })
const ZK_CONTRACT_ADDRESS = process.env.ZK_CONTRACT_ADDRESS;
const PROVIDER_URL = process.env.PROVIDER_URL

export default function getContract() {
  const provider = new ethers.providers.JsonRpcProvider(PROVIDER_URL);
  const signer = provider.getSigner();
  let contract = new ethers.Contract(
    ZK_CONTRACT_ADDRESS,
    ContractAbi.abi,
    signer,
  );
  return contract;
}
