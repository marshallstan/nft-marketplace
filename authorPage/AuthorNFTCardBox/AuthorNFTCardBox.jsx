import Style from './AuthorNFTCardBox.module.css'
import images from '../../img'
import { NFTCardTwo } from '../../collectionPage/collectionIndex'
import FollowerTabCard from '../../components/FollowerTab/FollowerTabCard/FollowerTabCard'

const AuthorNFTCardBox = ({
  collectiables,
  created,
  like,
  follower,
  following,
  nfts,
  myNFTS
}) => {
  const followerArray = [
    {
      background: images.creatorbackground1,
      user: images.user1
    },
    {
      background: images.creatorbackground2,
      user: images.user2
    },
    {
      background: images.creatorbackground3,
      user: images.user3
    },
    {
      background: images.creatorbackground4,
      user: images.user4
    },
    {
      background: images.creatorbackground5,
      user: images.user5
    },
    {
      background: images.creatorbackground6,
      user: images.user6
    }
  ]

  const followingArray = [
    {
      background: images.creatorbackground3,
      user: images.user3
    },
    {
      background: images.creatorbackground4,
      user: images.user4
    },
    {
      background: images.creatorbackground5,
      user: images.user5
    },
    {
      background: images.creatorbackground6,
      user: images.user6
    },
    {
      background: images.creatorbackground1,
      user: images.user1
    }
  ]

  return (
    <div className={Style.AuthorNFTCardBox}>
      {collectiables && <NFTCardTwo NFTData={nfts} />}
      {created && <NFTCardTwo NFTData={myNFTS} />}
      {like && <NFTCardTwo NFTData={nfts} />}
      {follower && (
        <div className={Style.AuthorNFTCardBox_box}>
          {followerArray.map((el, i) => (
            <FollowerTabCard i={i} el={el} key={i + 1} />
          ))}
        </div>
      )}
      {following && (
        <div className={Style.AuthorNFTCardBox_box}>
          {followingArray.map((el, i) => (
            <FollowerTabCard i={i} el={el} key={i + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

export default AuthorNFTCardBox
