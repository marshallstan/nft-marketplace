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
import { getTopCreators } from '../TopCreators/TopCreators'
import { NFTMarketplaceContext } from '../Context/NFTMarketplaceContext'

const Home = () => {
  const { fetchNFTs } = useContext(NFTMarketplaceContext)

  const [nfts, setNfts] = useState([])
  const creators = getTopCreators(nfts)

  useEffect(() => {
    fetchNFTs().then((items) => {
      if (items) {
        setNfts(items.reverse())
      }
    })
  }, [])

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

      {creators.length === 0 ? (
        <Loader />
      ) : (
        <FollowerTab TopCreator={creators} />
      )}

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
