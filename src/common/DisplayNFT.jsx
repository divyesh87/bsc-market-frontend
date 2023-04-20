import { Box, Typography } from '@material-ui/core'
import React from 'react'
import styles from "../styles/DisplayNFT.module.css"

function DisplayNFT({ file }) {
    if (!file) return

    return (
        <Box className={styles.cardContainer}>
            <div className={styles.nftImage}>
                <img style={{ height: "30vh" }} src={file} />
            </div>
        </Box>
    )
}

export default DisplayNFT