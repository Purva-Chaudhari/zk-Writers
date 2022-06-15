const main = async () => {
    // This will actually compile our contract and generate the necessary files we need to work with our contract under the artifacts directory.
    const blogContractFactory = await hre.ethers.getContractFactory(
      "Blog"
    );
    const blogContract = await blogContractFactory.deploy();
  
    await blogContract.deployed(); // We'll wait until our contract is officially deployed to our local blockchain! Our constructor runs when we deploy.
  
    console.log("NewsFeed Contract deployed to: ", blogContract.address);
  };
  
  const runMain = async () => {
    try {
      await main();
      process.exit(0);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  };
  
  runMain();
  