import { Box, Typography } from '@material-ui/core'
import React from 'react'
import styles from "../styles/DisplayNFT.module.css"

function DisplayNFT({ file, type }) {
    if (!file) return
    if (!type) return
    

    return (
        <Box className={styles.cardContainer}>
            <div className={styles.nftImage}>
                {
                    type == "img"
                        ?
                        <img style={{ height: "30vh" }} src={file} />
                        :
                        <video style={{height : "30vh"}} loop autoPlay>
                            <source src={URL.createObjectURL(file)} type={file.type} />
                        </video>
                }

            </div>
        </Box>
    )
}

export default DisplayNFT