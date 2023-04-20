import React from 'react'
import Navbar from '../common/Header'
import styles from "../styles/MyTokens.module.css"
import { Box, Button, TextField, Typography } from '@material-ui/core'
import DisplayNFT from "../common/DisplayNFT"
import stxLogo from "../assets/images/stacksLogo.png"

function MyTokens() {
  return (
    <>
      <Box className={styles.pageContainer}>
        <div className={styles.inputHeader}>
          <Typography variant='h3' style={{ color: "white" }}>
            Explore all your Tokens
          </Typography>
          <Typography variant='subtitle1' style={{ color: "white" }}>
            You can manually search for tokens held by you by querying your token contract address.
            <hr />
          </Typography>
          <TextField style={{ borderRadius: "0.2rem", color: "white", backgroundColor: "white", }} label="Search for token contracts" />
          <Button className={styles.mintBtn} variant='outlined' style={{ color: "white", background: "black", width: "25%", border: "1px solid white", marginTop: "0.5rem" }} >
            Search
          </Button>
        </div>
        <div className={styles.tokensContainer}>
          <Typography align="center" variant='h4' style={{ color: "white" }}>
            Found x Tokens
            <hr />
          </Typography>
          <div className={styles.tokenDisplay}>
            <DisplayNFT src={stxLogo}/>
            <DisplayNFT src={stxLogo}/>
            <DisplayNFT src={stxLogo}/>
            <DisplayNFT src={stxLogo}/>
          </div>
        </div>
      </Box>
    </>
  )
}

export default MyTokens