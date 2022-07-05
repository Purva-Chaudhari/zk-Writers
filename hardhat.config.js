
require("@nomiclabs/hardhat-waffle");
require("dotenv").config();
require("@nomiclabs/hardhat-ethers"); 
require('hardhat-dependency-compiler')
require('hardhat-gas-reporter')   
require('./tasks/deploy')

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

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
        }
    },
    gasReporter: {
        enabled: process.env.REPORT_GAS !== undefined,
        currency: "USD"
    }
}

module.exports= config