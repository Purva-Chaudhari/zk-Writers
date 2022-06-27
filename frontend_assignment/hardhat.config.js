
require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks: {
    ropsten: {
      url: "http://localhost:8545",
      //url: process.env.ROPSTEN_URL || "",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 31337
    },
  },
};



// import "@nomiclabs/hardhat-ethers"
// import "@nomiclabs/hardhat-waffle"
// import * as dotenv from "dotenv"
// import "hardhat-gas-reporter"
// import "hardhat-dependency-compiler"
// import { HardhatUserConfig } from "hardhat/config"
// import "./tasks/deploy"

// dotenv.config()

// // You need to export an object to set up your config
// // Go to https://hardhat.org/config/ to learn more



// const config: HardhatUserConfig = {
//     solidity: "0.8.4",
//     dependencyCompiler: {
//         paths: ["@appliedzkp/semaphore-contracts/base/Verifier.sol"]
//     },
//     networks: {
//         ropsten: {
//             url: process.env.ROPSTEN_URL || "",
//             accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
//             gasPrice: 100000000000,
//             gas: 10000000000,
//         }
//     },
//     gasReporter: {
//         enabled: process.env.REPORT_GAS !== undefined,
//         currency: "USD"
//     }
// }

// export default config
