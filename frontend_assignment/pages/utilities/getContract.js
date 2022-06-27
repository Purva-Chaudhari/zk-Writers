import ContractAbi from "./Blog.json";
import { ethers } from "ethers";

export default function getContract() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  console.log("Window")
  console.log(window.ethereum)
  const signer = provider.getSigner();
  console.log("Signer : ",signer)
  let contract = new ethers.Contract(
    "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    //"0x385c3494C8FBE18F952032230d6618D2911E85cc",
    ContractAbi.abi,
    signer,
  );
  return contract;
}
