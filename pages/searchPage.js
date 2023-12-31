import { useEffect, useState, useContext } from 'react'

import Style from '../styles/searchPage.module.css'
import { Slider, Brand, Loader } from '../components/componentsindex'
import { SearchBar } from '../SearchPage/searchBarIndex'
import { Filter } from '../components/componentsindex'
import { NFTCardTwo, Banner } from '../collectionPage/collectionIndex'
import images from '../img'
import { NFTMarketplaceContext } from '../Context/NFTMarketplaceContext'

const searchPage = () => {
  const {
    fetchNFTs,
    setError
  } = useContext(NFTMarketplaceContext)
  const [nfts, setNfts] = useState([])
  const [nftsCopy, setNftsCopy] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      fetchNFTs().then((items) => {
        if (items) {
          setLoading(false)
          setNfts(items.reverse())
          setNftsCopy(items)
        }
      })
    } catch (error) {
      setError('Please reload the browser')
    }
  }, [])

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
      {loading ? <Loader /> : <NFTCardTwo NFTData={nfts} />}
      {/*<Slider />*/}
      {/*<Brand />*/}
    </div>
  )
}

export default searchPage
