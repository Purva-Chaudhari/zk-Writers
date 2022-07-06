
require("@nomiclabs/hardhat-waffle");
require("dotenv").config();
require("@nomiclabs/hardhat-ethers"); 
require('hardhat-dependency-compiler')
require('hardhat-gas-reporter')   
require('./tasks/deploy')

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more
const ALCHEMY_API_KEY = "FxcSZ3aZX2Jt_V8ITvmvG5k1i6rnpfpT";
const GOERLI_PRIVATE_KEY = "00e1bcc5d8a80a56f3e32d522687b2ffa4b9fd6073c00ebfb41c74493cd8e31e";

const config = {
    solidity: "0.8.4",
    dependencyCompiler: {
        paths: [
        "@appliedzkp/semaphore-contracts/base/Verifier.sol"
        ]
    },
    networks: {
      matic: {
    		url: "https://rpc-mumbai.maticvigil.com",
    		accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],	
    	},
        ropsten: {
            url: process.env.ROPSTEN_URL || "",
            accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
			gas: 2100000,
			gasPrice: 8000000000
        },
        localhost:{
            url: process.env.PROVIDER_URL || "" ,
            accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
        },
        goerli: {
          url: `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
          accounts: [`${GOERLI_PRIVATE_KEY}`]
        }
    },
    gasReporter: {
        enabled: process.env.REPORT_GAS !== undefined,
        currency: "USD"
    }
}

module.exports= config