const hre = require('hardhat')

async function main() {
  const NFTMarketplace = await hre.ethers.deployContract('NFTMarketplace')
  await NFTMarketplace.waitForDeployment()

  const contractAddress = await NFTMarketplace.getAddress()
  console.log(`deployed contract Address ${contractAddress}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
