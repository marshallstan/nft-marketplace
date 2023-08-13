const hre = require('hardhat')

async function main() {
  const NFTMarketplace = await hre.ethers.deployContract('NFTMarketplace')
  await NFTMarketplace.waitForDeployment()

  const contractAddress = await NFTMarketplace.getAddress()
  console.log(`deployed NFTMarketplace contract Address ${contractAddress}`)

  const TransferFunds = await hre.ethers.deployContract('TransferFunds')
  await TransferFunds.waitForDeployment()

  const transferFundsAddress = await TransferFunds.getAddress()
  console.log(`deployed TransferFunds contract Address ${transferFundsAddress}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
