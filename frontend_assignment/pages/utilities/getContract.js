import ContractAbi from "./Blog.json";
import { ethers } from "ethers";

export default function getContract() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  console.log("Window")
  console.log(window.ethereum)
  const signer = provider.getSigner();
  console.log("Signer : ",signer)
  let contract = new ethers.Contract(
    //"0x5FbDB2315678afecb367f032d93F642f64180aa3",
    "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
    ContractAbi.abi,
    signer,
  );
  return contract;
}
