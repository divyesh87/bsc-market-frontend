import { Box, Typography } from '@material-ui/core'
import React, { useState } from 'react'
import styles from "../styles/NFTCard.module.css"
import SellModal from './SellModal'

function DisplayNFT({ nft }) {

    const [Modal, setModal] = useState(false)

    function handleModal() {
        setModal(!Modal)
    }

    return (
        <div>
            <SellModal nft={nft} showModal={Modal} handleModal={handleModal} />
            <Box onClick={handleModal} className={styles.cardContainer}>
                <div className={styles.nftImage}>
                    <img style={{ height: "30vh" }} src={nft.token_uri} />
                </div>
                <Typography style={{ color: "white" }}>
                    {nft.symbol} #{nft.token_id}
                </Typography>
            </Box>
        </div>

    )
}

export default DisplayNFT