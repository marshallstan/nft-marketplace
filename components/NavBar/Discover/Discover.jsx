import Link from 'next/link'

import Style from './Discover.module.css'

const Discover = () => {
  const discover = [
    {
      name: 'Collection',
      link: 'collection'
    },
    {
      name: 'Search',
      link: 'searchPage'
    },
    {
      name: 'Author Profile',
      link: 'author'
    },
    {
      name: 'NFT Details',
      link: 'NFT-details'
    },
    {
      name: 'Account Setting',
      link: 'account'
    },
    {
      name: 'Upload NFT',
      link: 'uploadNFT'
    },
    {
      name: 'Connect Wallet',
      link: 'connectWallet'
    },
    {
      name: 'Blog',
      link: 'blog'
    }
  ]

  return (
    <div>
      {discover.map(el => (
        <div key={el.link} className={Style.discover}>
          <Link href={{ pathname: `${el.link}` }}>{el.name}</Link>
        </div>
      ))}
    </div>
  )
}

export default Discover
