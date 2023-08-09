import { useEffect, useState, useContext } from 'react'

import Style from '../styles/searchPage.module.css'
import { Slider, Brand } from '../components/componentsindex'
import { SearchBar } from '../SearchPage/searchBarIndex'
import { Filter } from '../components/componentsindex'
import { NFTCardTwo, Banner } from '../collectionPage/collectionIndex'
import images from '../img'
import { NFTMarketplaceContext } from '../Context/NFTMarketplaceContext'

const searchPage = () => {
  const { fetchNFTs, setError, currentAccount } = useContext(NFTMarketplaceContext)
  const [nfts, setNfts] = useState([])
  const [nftsCopy, setNftsCopy] = useState([])

  useEffect(() => {
    try {
      if (currentAccount) {
        fetchNFTs().then((items) => {
          console.log('=>(searchPage.js:22) items', items)
          if (items) {
            setNfts(items.reverse())
            setNftsCopy(items)
          }
        })
      }
    } catch (error) {
      setError('Please reload the browser', error)
    }
  }, [currentAccount])

  const onHandleSearch = (value) => {
    const filteredNFTS = nfts.filter(({ name }) =>
      name.toLowerCase().includes(value.toLowerCase())
    )

    if (filteredNFTS.length === 0) {
      setNfts(nftsCopy)
    } else {
      setNfts(filteredNFTS)
    }
  }

  const onClearSearch = () => {
    if (nfts.length && nftsCopy.length) {
      setNfts(nftsCopy)
    }
  }

  return (
    <div className={Style.searchPage}>
      <Banner bannerImage={images.creatorbackground2} />
      <SearchBar
        onHandleSearch={onHandleSearch}
        onClearSearch={onClearSearch}
      />
      <Filter />
      <NFTCardTwo NFTData={nfts} />
      {/*{nfts.length === 0 ? <Loader /> : <NFTCardTwo NFTData={nfts} />}*/}
      <Slider />
      <Brand />
    </div>
  )
}

export default searchPage
