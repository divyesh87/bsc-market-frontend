import React from 'react'
import Navbar from '../common/Header'
import styles from "../styles/Home.module.css"
import bnbLogo from "../assets/images/bnbIcon.png"
import Card from "../common/Card"
import { Box, Typography } from '@material-ui/core'

function Home() {
  return (
    <>
      <div className={styles.introContainer}>
        <div className={styles.introInfo}>
          <Typography style={{ color: "white", marginBottom: "1rem" }} variant='h3' >
            Experience True Ownership
            <hr style={{ width: "100%" }} />
          </Typography>
          <Typography style={{ color: "white" }} variant="h5">
            Explore, discover and own unique digital assets on our NFT marketplace, where creativity meets blockchain technology. Buy, sell and showcase one-of-a-kind collectibles, art, music and more, securely and transparently. Join the revolution of ownership in the digital age.
          </Typography>
        </div>
        <div className={styles.logoContainer}>
          <img style={{width : "33vw"}} src={bnbLogo} />
          <Typography style={{ color: "white" }} variant='h6'>
            Powered by Binance Smart Chain
          </Typography>
        </div>
      </div>
      <Box className={styles.offerings}>
        <div>
          <Typography align='center' style={{ color: "white" }} variant="h4">
            Explore Current Offerings:
            <hr />
          </Typography>
        </div>
        <div className={styles.offeringsDisplay}>
          <Card src={bnbLogo} seller="divyesh86" price="45" />
          <Card src={bnbLogo} seller="divyesh86" price="45" />
          <Card src={bnbLogo} seller="divyesh86" price="45" />
          <Card src={bnbLogo} seller="divyesh86" price="45" />
          <Card src={bnbLogo} seller="divyesh86" price="45" />
        </div>
      </Box>
    </>

  )
}

export default Home