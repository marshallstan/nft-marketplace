import { useContext, useEffect, useState } from 'react'
import Style from '../styles/index.module.css'
import {
  HeroSection,
  Service,
  BigNFTSlider,
  Subscribe,
  Title,
  Category,
  Filter,
  NFTCard,
  Collection,
  FollowerTab,
  AudioLive,
  Slider,
  Brand,
  Video,
  Loader
} from '../components/componentsindex'
import { NFTMarketplaceContext } from '../Context/NFTMarketplaceContext'

const Home = () => {
  const { checkIfWalletConnected, currentAccount, fetchNFTs } = useContext(NFTMarketplaceContext)

  const [nfts, setNfts] = useState([])
  const [nftsCopy, setNftsCopy] = useState([])

  useEffect(() => {
    checkIfWalletConnected()
  }, [])

  useEffect(() => {
    if (currentAccount) {
      fetchNFTs().then((items) => {
        if (items) {
          setNfts(items.reverse())
          setNftsCopy(items)
        }
      })
    }
  }, [currentAccount])

  return (
    <div className={Style.homePage}>
      <HeroSection />
      <Service />
      <BigNFTSlider />

      <Title
        heading="Audio Collection"
        paragraph="Discover the most outstanding NFTs in all topics of life."
      />
      <AudioLive />

      <FollowerTab />
      <Slider />
      <Collection />

      <Title
        heading="Featured NFTs"
        paragraph="Discover the most outstanding NFTs in all topics of life."
      />
      <Filter />

      {nfts.length === 0 ? <Loader /> : <NFTCard NFTData={nfts} />}

      <Title
        heading="Browse by category"
        paragraph="Explore the NFTs in the most featured categories."
      />
      <Category />
      <Subscribe />
      <Brand />
      <Video />
    </div>
  )
}

export default Home
