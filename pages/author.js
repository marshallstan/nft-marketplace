import { useState, useEffect, useContext } from 'react'

import Style from '../styles/author.module.css'
import { Banner } from '../collectionPage/collectionIndex'
import { Brand, Title } from '../components/componentsindex'
import FollowerTabCard from '../components/FollowerTab/FollowerTabCard/FollowerTabCard'
import images from '../img'
import {
  AuthorProfileCard,
  AuthorTaps,
  AuthorNFTCardBox
} from '../authorPage/componentIndex'
import { NFTMarketplaceContext } from '../Context/NFTMarketplaceContext'

const author = () => {
  const { fetchMyNFTsOrListedNFTs, currentAccount } = useContext(NFTMarketplaceContext)

  const [collectiables, setCollectables] = useState(true)
  const [created, setCreated] = useState(false)
  const [like, setLike] = useState(false)
  const [follower, setFollower] = useState(false)
  const [following, setFollowing] = useState(false)
  const [nfts, setNfts] = useState([])
  const [myNFTs, setMyNFTs] = useState([])

  const followerArray = [
    {
      background: images.creatorbackground1,
      user: images.user1,
      seller: '7d64gf748849j47fy488444'
    },
    {
      background: images.creatorbackground2,
      user: images.user2,
      seller: '7d64gf748849j47fy488444'
    },
    {
      background: images.creatorbackground3,
      user: images.user3,
      seller: '7d64gf748849j47fy488444'
    },
    {
      background: images.creatorbackground4,
      user: images.user4,
      seller: '7d64gf748849j47fy488444'
    },
    {
      background: images.creatorbackground5,
      user: images.user5,
      seller: '7d64gf748849j47fy488444'
    },
    {
      background: images.creatorbackground6,
      user: images.user6,
      seller: '7d64gf748849j47fy488444'
    }
  ]

  useEffect(() => {
    if (currentAccount) {
      fetchMyNFTsOrListedNFTs('fetchItemsListed').then((items) => {
        setNfts(items)
      })
    }
  }, [currentAccount])

  useEffect(() => {
    if (currentAccount) {
      fetchMyNFTsOrListedNFTs('fetchMyNFTs').then((items) => {
        setMyNFTs(items)
      })
    }
  }, [currentAccount])

  return (
    <div className={Style.author}>
      <Banner bannerImage={images.creatorbackground2} />
      <AuthorProfileCard currentAccount={currentAccount} />
      <AuthorTaps
        setCollectables={setCollectables}
        setCreated={setCreated}
        setLike={setLike}
        setFollower={setFollower}
        setFollowing={setFollowing}
      />

      <AuthorNFTCardBox
        collectiables={collectiables}
        created={created}
        like={like}
        follower={follower}
        following={following}
        nfts={nfts}
        myNFTS={myNFTs}
      />
      <Title
        heading="Popular Creators"
        paragraph="Click on music icon and enjoy NTF music or audio
"
      />
      <div className={Style.author_box}>
        {followerArray.map((el, i) => (
          <FollowerTabCard i={i} el={el} key={i + 1} />
        ))}
      </div>

      <Brand />
    </div>
  )
}

export default author
