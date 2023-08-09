import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import { Category, Brand } from '../components/componentsindex'
import NFTDetailsPage from '../NFTDetailsPage/NFTDetailsPage'

const NFTDetails = () => {
  const router = useRouter()

  const [nft, setNft] = useState({
    image: '',
    tokenId: '',
    name: '',
    owner: '',
    price: '',
    seller: ''
  })

  useEffect(() => {
    if (!router.isReady) return
    setNft(router.query)
  }, [router.isReady])

  return (
    <div>
      <NFTDetailsPage nft={nft} />
      <Category />
      <Brand />
    </div>
  )
}

export default NFTDetails
