import React, { useState, useEffect } from 'react'
import Web3Modal from 'web3modal'
import { ethers, JsonRpcProvider, formatEther, parseEther } from 'ethers'
import { useRouter } from 'next/router'
import axios from 'axios'
import { create as ipfsHttpClient } from 'ipfs-http-client'

import {
  NFTMarketplaceAddress,
  NFTMarketplaceABI,
  transferFundsAddress,
  transferFundsABI
} from './constants'

const provider_url = process.env.NODE_ENV === 'production' ?
  process.env.TEST_NETWORK_URL :
  'http://127.0.0.1:8545'
const targetId = process.env.TARGET_ID
const NETWORKS = {
  1: 'Ethereum Main Network',
  3: 'Ropsten Test Network',
  4: 'Rinkeby Test Network',
  5: 'Goerli Test Network',
  42: 'Kovan Test Network',
  56: 'Binance Smart Chain',
  1337: 'Ganache',
  31337: 'Hardhat_local',
  80001: 'Mumbai Test Network',
  11155111: 'Sepolia Test Network'
}

const projectId = process.env.PROJECT_ID
const projectSecretKey = process.env.PROJECT_SECRET_KEY
const auth = `Basic ${
  Buffer.from(`${projectId}:${projectSecretKey}`).toString('base64')
}`

const subdomain = process.env.SUBDOMAIN

const client = ipfsHttpClient({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth
  }
})

// --- NFT CONTRACT
const fetchContract = (signerOrProvider) =>
  new ethers.Contract(
    NFTMarketplaceAddress,
    NFTMarketplaceABI,
    signerOrProvider
  )

const connectingWithSmartContract = async () => {
  try {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.BrowserProvider(connection)
    const signer = await provider.getSigner()
    return fetchContract(signer)
  } catch (error) {
    console.log('Something went wrong while connecting with contract', error)
  }
}

// --- TRANSFER FUNDS CONTRACT
const fetchTransferFundsContract = (signerOrProvider) =>
  new ethers.Contract(
    transferFundsAddress,
    transferFundsABI,
    signerOrProvider
  )

const connectToTransferFunds = async () => {
  try {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.BrowserProvider(connection)
    const signer = await provider.getSigner()
    return fetchTransferFundsContract(signer)
  } catch (error) {
    console.log('Something went wrong while connecting TransferFunds with contract', error)
  }
}

export const NFTMarketplaceContext = React.createContext({})

export const NFTMarketplaceProvider = ({ children }) => {
  const titleData = 'Discover, collect, and sell NFTs'

  const router = useRouter()
  const [error, setError] = useState('')
  const [openError, setOpenError] = useState(false)
  const [currentAccount, setCurrentAccount] = useState('')
  const [accountBalance, setAccountBalance] = useState('')
  const [chainID, setChainID] = useState(0)

  const checkIfWalletConnected = async () => {
    try {
      if (!window.ethereum) {
        setOpenError(true)
        setError('Install MetaMask')
        return
      }

      const provider = new ethers.BrowserProvider(window.ethereum)
      const chainId = await provider.getNetwork().then((res) => {
        return res.chainId ? parseInt(res.chainId) : 0
      })
      setChainID(chainId)
      if (chainId !== targetId) {
        setError(`Please connect to the network: ${NETWORKS[targetId]}`)
        setOpenError(true)
      }

      const accounts = await window.ethereum.request({
        method: 'eth_accounts'
      })

      if (accounts.length) {
        setCurrentAccount(accounts[0])

        const getBalance = await provider.getBalance(accounts[0])
        const bal = formatEther(getBalance)
        setAccountBalance(bal)
      } else {
        setError('No Account Found')
        setOpenError(true)
      }
    } catch (error) {
      console.log('checkIfWalletConnected', error)
      setError('Something wrong while connecting to wallet')
      setOpenError(true)
    }
  }

  useEffect(() => {
    checkIfWalletConnected()
    if (window.ethereum) {
      window.ethereum.on('chainChanged', () => {
        window.location.reload()
      })
      window.ethereum.on('accountsChanged', () => {
        window.location.reload()
      })
    }
  }, [])

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        setOpenError(true)
        setError('Install MetaMask')
        return
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      })
      setCurrentAccount(accounts[0])
      await connectingWithSmartContract()
    } catch (error) {
      setError('Error while connecting to wallet')
      setOpenError(true)
    }
  }

  const uploadToIPFS = async (file) => {
    try {
      const added = await client.add({ content: file })
      return `${subdomain}/ipfs/${added.path}`
    } catch (error) {
      setError('Error Uploading to IPFS')
      setOpenError(true)
    }
  }

  const createNFT = async (name, price, image, description, router) => {
    if (!name || !description || !price || !image) {
      setError('Data Is Missing')
      setOpenError(true)
      return
    }

    const data = JSON.stringify({ name, description, image })

    try {
      const added = await client.add(data)

      const url = `${subdomain}/ipfs/${added.path}`

      await createSale(url, price)
      router.push('/searchPage')
    } catch (error) {
      setError('Error while creating NFT')
      setOpenError(true)
    }
  }

  const createSale = async (url, formInputPrice, isReselling, id) => {
    try {
      const price = ethers.parseUnits(formInputPrice, 'ether')

      const contract = await connectingWithSmartContract()

      const listingPrice = await contract.getListingPrice()

      const transaction = !isReselling
        ? await contract.createToken(url, price, {
          value: listingPrice.toString()
        })
        : await contract.resellToken(id, price, {
          value: listingPrice.toString()
        })

      await transaction.wait()
    } catch (error) {
      setError('error while creating sale')
      setOpenError(true)
    }
  }

  const fetchNFTs = async () => {
    try {
      const provider = new JsonRpcProvider(provider_url)
      const contract = fetchContract(provider)

      const data = await contract.fetchMarketItems()

      return await Promise.all(
        data.map(
          async ({ tokenId, seller, owner, price: unformattedPrice }) => {
            const tokenURI = await contract.tokenURI(tokenId)

            const {
              data: { image, name, description }
            } = await axios.get(tokenURI)
            const price = ethers.formatUnits(
              unformattedPrice.toString(),
              'ether'
            )

            return {
              price,
              tokenId: parseInt(tokenId),
              seller,
              owner,
              image,
              name,
              description,
              tokenURI
            }
          }
        )
      )
    } catch (error) {
      console.log('fetchNFTs', error)
      setError('Error while fetching NFTS')
      setOpenError(true)
    }
  }

  const fetchMyNFTsOrListedNFTs = async (type) => {
    try {
      if (currentAccount && chainID === targetId) {
        const contract = await connectingWithSmartContract()

        const data =
          type === 'fetchItemsListed'
            ? await contract.fetchItemsListed()
            : await contract.fetchMyNFTs()

        const items = await Promise.all(
          data.map(
            async ({ tokenId, seller, owner, price: unformattedPrice }) => {
              const tokenURI = await contract.tokenURI(tokenId)
              const {
                data: { image, name, description }
              } = await axios.get(tokenURI)
              const price = ethers.formatUnits(
                unformattedPrice.toString(),
                'ether'
              )

              return {
                price,
                tokenId: parseInt(tokenId),
                seller,
                owner,
                image,
                name,
                description,
                tokenURI
              }
            }
          )
        )
        console.log('=>(fetchMyNFTsOrListedNFTs) items', items, type)
        return items || []
      }
    } catch (error) {
      console.log('fetchMyNFTsOrListedNFTs', error)
      setError('Error while fetching listed NFTs')
      setOpenError(true)
    }
  }

  const buyNFT = async (nft) => {
    try {
      const contract = await connectingWithSmartContract()
      const price = ethers.parseUnits(nft.price.toString(), 'ether')

      const transaction = await contract.createMarketSale(nft.tokenId, {
        value: price
      })

      await transaction.wait()
      router.push('/author')
    } catch (error) {
      setError('Error While buying NFT')
      setOpenError(true)
    }
  }

  // ---TRANSFER FUNDS
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(false)

  const transferEther = async (address, ether, message) => {
    try {
      if (currentAccount) {
        if (!address || !ether) {
          setError('Please fill the form')
          setOpenError(true)
          return
        }
        const contract = await connectToTransferFunds()

        const unFormattedPrice = parseEther(ether)

        await window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [
            {
              from: currentAccount,
              to: address,
              value: unFormattedPrice.toString(16)
            }
          ]
        })

        const transaction = await contract.addDataToBlockchain(
          address,
          unFormattedPrice,
          message
        )

        setLoading(true)
        await transaction.wait()
        setLoading(false)

        window.location.reload()
      } else {
        setError('No account connected')
        setOpenError(true)
      }
    } catch (error) {
      console.log(error)
      setError('Error While transfer Ethers')
      setOpenError(true)
    }
  }

  const getAllTransactions = async () => {
    try {
      if (window.ethereum) {
        const contract = await connectToTransferFunds()

        const availableTransaction = await contract.getAllTransactions()

        const readTransaction = availableTransaction.map((transaction) => ({
          addressTo: transaction.receiver,
          addressFrom: transaction.sender,
          timestamp: new Date(
            parseInt(transaction.timestamp) * 1000
          ).toLocaleString(),
          message: transaction.message,
          amount: parseInt(transaction.amount) / 10 ** 18
        }))

        setTransactions(readTransaction)
      } else {
        setError('No Ethereum')
        setOpenError(true)
      }
    } catch (error) {
      console.log(error)
      setError('Error While getAllTransactions')
      setOpenError(true)
    }
  }

  return (
    <NFTMarketplaceContext.Provider
      value={{
        checkIfWalletConnected,
        chainID,
        targetId,
        titleData,
        createNFT,
        connectWallet,
        uploadToIPFS,
        fetchNFTs,
        fetchMyNFTsOrListedNFTs,
        currentAccount,
        buyNFT,
        createSale,
        openError,
        setOpenError,
        error,
        setError,
        accountBalance,
        transferEther,
        getAllTransactions,
        transactions,
        loading
      }}
    >
      {children}
    </NFTMarketplaceContext.Provider>
  )
}
