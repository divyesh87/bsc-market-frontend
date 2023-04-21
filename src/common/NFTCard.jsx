import { Box, Typography } from '@material-ui/core'
import React from 'react'
import styles from "../styles/NFTCard.module.css"

function DisplayNFT({ nft }) {

    return (
        <Box className={styles.cardContainer}>
            <div className={styles.nftImage}>
                <img style={{ height: "30vh" }} src={nft.token_uri} />
            </div>
            <Typography style={{color : "white"}}>
                {nft.symbol} #{nft.token_id}
            </Typography>
        </Box>
    )
}

export default DisplayNFT