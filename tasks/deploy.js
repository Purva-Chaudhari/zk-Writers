const { Group } = require('@semaphore-protocol/group')
const { task, types } = require('hardhat/config')

task('deploy', 'Deploy the Blog contract')
    .addOptionalParam('logs', 'Print the logs', true, types.boolean)
    .setAction(async ({ logs }, { ethers }) => {
        // Deploy Verifier
        const VerifierContract = await ethers.getContractFactory('Verifier')
        const verifier = await VerifierContract.deploy()
        await verifier.deployed()
        console.log(`Verifier contract has been deployed to: ${verifier.address}`)

        // Deploy Hashes
        const Hash = await ethers.getContractFactory('PoseidonT3')
        const hash = await Hash.deploy()
        await hash.deployed
        console.log(`PoseidonT3 contract has been deployed to: ${hash.address}`)

        // Deploy IncrementalBinaryTree
        const IncrementalBinaryTree = await ethers.getContractFactory('IncrementalBinaryTree', {
            libraries: {
                PoseidonT3: hash.address,
            },
        })
        const incrementalBinaryTree = await IncrementalBinaryTree.deploy()
        await incrementalBinaryTree.deployed()
        console.log(`IncrementalBinaryTree contract has been deployed to: ${incrementalBinaryTree.address}`)

        // Deploy Blog
        const BlogContract = await ethers.getContractFactory('Blog', {
            libraries: {
                IncrementalBinaryTree: incrementalBinaryTree.address,
            },
        })
        const tree = new Group() // Create empty group for constructor usage
        const Blog = await BlogContract.deploy(verifier.address)
        await Blog.deployed()
        console.log(`Zk-Writer contract has been deployed to: ${Blog.address}`)

        // Return our Blog
        return Blog
    })