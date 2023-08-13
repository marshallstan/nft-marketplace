import { useState, useContext, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { DiJqueryLogo } from 'react-icons/di'
import { MdNotifications } from 'react-icons/md'
import { BsSearch } from 'react-icons/bs'
import { CgMenuRight } from 'react-icons/cg'

import Style from './NavBar.module.css'
import { Discover, HelpCenter, Notification, Profile, SideBar } from './index'
import { Button, Error } from '../componentsindex'
import images from '../../img'
import { NFTMarketplaceContext } from '../../Context/NFTMarketplaceContext'

const NavBar = () => {
  const {
    currentAccount,
    connectWallet,
    openError,
    chainID,
    targetId
  } = useContext(NFTMarketplaceContext)
  const router = useRouter()

  const [discover, setDiscover] = useState(false)
  const [help, setHelp] = useState(false)
  const [notification, setNotification] = useState(false)
  const [profile, setProfile] = useState(false)
  const [openSideMenu, setOpenSideMenu] = useState(false)

  useEffect(() => {
    document.body.onclick = () => {
      if (discover) setDiscover(false)
      if (help) setHelp(false)
      if (notification) setNotification(false)
      if (profile) setProfile(false)
    }

    return () => {
      document.body.onclick = null
    }
  }, [discover, help, notification, profile])

  const openMenu = e => {
    e.stopPropagation()
    const btnText = e.target.innerText
    if (btnText === 'Discover') {
      setDiscover(!discover)
      setHelp(false)
      setNotification(false)
      setProfile(false)
    } else if (btnText === 'Help Center') {
      setDiscover(false)
      setHelp(!help)
      setNotification(false)
      setProfile(false)
    } else {
      setDiscover(false)
      setHelp(false)
      setNotification(false)
      setProfile(false)
    }
  }

  const openNotification = e => {
    e.stopPropagation()
    if (!notification) {
      setNotification(true)
      setDiscover(false)
      setHelp(false)
      setProfile(false)
    } else {
      setNotification(false)
    }
  }

  const openProfile = e => {
    e.stopPropagation()
    if (!profile) {
      setProfile(true)
      setHelp(false)
      setDiscover(false)
      setNotification(false)
    } else {
      setProfile(false)
    }
  }

  const openSideBar = e => {
    e.stopPropagation()
    if (discover) setDiscover(false)
    if (help) setHelp(false)
    if (notification) setNotification(false)
    if (profile) setProfile(false)

    if (!openSideMenu) {
      setOpenSideMenu(true)
    } else {
      setOpenSideMenu(false)
    }
  }

  return (
    <div className={Style.navbar}>
      <div className={Style.navbar_container}>
        <div className={Style.navbar_container_left}>
          <div>
            <DiJqueryLogo onClick={() => router.push('/')} className={Style.logo} />
          </div>
          <div className={Style.navbar_container_left_box_input}>
            <div className={Style.navbar_container_left_box_input_box}>
              <input type="text" placeholder="Search NFT" />
              <BsSearch onClick={() => {}} className={Style.search_icon} />
            </div>
          </div>
        </div>

        <div className={Style.navbar_container_right}>
          <div className={Style.navbar_container_right_discover}>
            <p onClick={e => openMenu(e)}>Discover</p>
            {discover && (
              <div className={Style.navbar_container_right_discover_box}>
                <Discover />
              </div>
            )}
          </div>

          <div className={Style.navbar_container_right_help}>
            <p onClick={e => openMenu(e)}>Help Center</p>
            {help && (
              <div className={Style.navbar_container_right_help_box}>
                <HelpCenter />
              </div>
            )}
          </div>

          <div className={Style.navbar_container_right_notify}>
            <MdNotifications
              className={Style.notify}
              onClick={e => openNotification(e)}
            />
            {notification && <Notification />}
          </div>

          <div className={Style.navbar_container_right_button}>
            {currentAccount === '' || chainID !== targetId ? (
              <Button btnName="Connect" handleClick={() => connectWallet()} />
            ) : (
              <Button
                btnName="Create"
                handleClick={() => router.push('/uploadNFT')}
              />
            )}
          </div>

          <div className={Style.navbar_container_right_profile_box}>
            <div className={Style.navbar_container_right_profile}>
              <Image
                src={images.user1}
                alt="Profile"
                width={40}
                height={40}
                onClick={e => openProfile(e)}
                className={Style.navbar_container_right_profile}
              />
              {profile && <Profile currentAccount={currentAccount} />}
            </div>
          </div>

          <div className={Style.navbar_container_right_menuBtn}>
            <CgMenuRight
              className={Style.menuIcon}
              onClick={e => openSideBar(e)}
            />
          </div>
        </div>
      </div>

      {openSideMenu && (
        <div className={Style.sideBar}>
          <SideBar
            setOpenSideMenu={setOpenSideMenu}
            currentAccount={currentAccount}
            connectWallet={connectWallet}
            chainID={chainID}
            targetId={targetId}
          />
        </div>
      )}

      {openError && <Error />}
    </div>
  )
}

export default NavBar
