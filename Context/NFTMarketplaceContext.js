import React, { useState, useEffect, useContext } from 'react'
import Web3Modal from 'web3modal'
import { ethers, JsonRpcProvider } from 'ethers'
import { useRouter } from 'next/router'
import axios from 'axios'
import { create as ipfsHttpClient } from 'ipfs-http-client'

import {
  NFTMarketplaceAddress,
  NFTMarketplaceABI
} from './constants'

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

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
    const signer = provider.getSigner()
    return fetchContract(signer)
  } catch (error) {
    console.log('Something went wrong while connecting with contract', error)
  }
}

export const NFTMarketplaceContext = React.createContext({})

export const NFTMarketplaceProvider = ({ children }) => {
  const titleData = 'Discover, collect, and sell NFTs'

  const [error, setError] = useState('')
  const [openError, setOpenError] = useState(false)
  const [currentAccount, setCurrentAccount] = useState('')
  const [accountBalance, setAccountBalance] = useState('')

  const checkIfWalletConnected = async () => {
    try {
      if (!window.ethereum) {
        setOpenError(true)
        setError('Install MetaMask')
        return
      }

      const accounts = await window.ethereum.request({
        method: 'eth_accounts'
      })

      if (accounts.length) {
        setCurrentAccount(accounts[0])
      } else {
        setError('No Account Found')
        setOpenError(true)
      }
    } catch (error) {
      setError('Something wrong while connecting to wallet')
      setOpenError(true)
    }
  }

  useEffect(() => {
    checkIfWalletConnected().then()
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
    } catch (error) {
      setError('Error while connecting to wallet')
      setOpenError(true)
    }
  }

  const uploadToIPFS = async (file) => {
    try {
      const added = await client.add({ content: file })
      return `https://ipfs.infura.io/ipfs/${added.path}`
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

      const url = `https://ipfs.infura.io/ipfs/${added.path}`

      await createSale(url, price)
    } catch (error) {
      setError('Error while creating NFT')
      setOpenError(true)
    }
  }

  const createSale = async (url, formInputPrice, isReselling, id) => {
    try {
      console.log(url, formInputPrice, isReselling, id)
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
      console.log(transaction)
    } catch (error) {
      setError('error while creating sale')
      setOpenError(true)
    }
  }

  const fetchNFTs = async () => {
    try {
      if (currentAccount) {
        const provider = new JsonRpcProvider()
        const contract = fetchContract(provider)

        const data = await contract.fetchMarketItems()

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
                tokenId: tokenId.toNumber(),
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
        console.log('=>(NFTMarketplaceContext.js:182) items', items)

        return items
      }
    } catch (error) {
      setError('Error while fetching NFTS')
      setOpenError(true)
      console.log(error)
    }
  }

  const fetchMyNFTsOrListedNFTs = async (type) => {
    try {
      if (currentAccount) {
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
                tokenId: tokenId.toNumber(),
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
        console.log('=>(NFTMarketplaceContext.js:227) items', items)
        return items
      }
    } catch (error) {
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
    } catch (error) {
      setError('Error While buying NFT')
      setOpenError(true)
    }
  }

  return (
    <NFTMarketplaceContext.Provider
      value={{
        checkIfWalletConnected,
        titleData,
        createNFT,
        connectWallet,
        uploadToIPFS,
        fetchNFTs,
        fetchMyNFTsOrListedNFTs,
        currentAccount,
        buyNFT
      }}
    >
      {children}
    </NFTMarketplaceContext.Provider>
  )
}
