import nftMarketplace from './NFTMarketplace.json'
import transferFunds from './TransferFunds.json'

export const NFTMarketplaceAddress = process.env.NFT_ADDRESS
export const NFTMarketplaceABI = nftMarketplace.abi

export const transferFundsAddress = process.env.FUNDS_ADDRESS
export const transferFundsABI = transferFunds.abi
