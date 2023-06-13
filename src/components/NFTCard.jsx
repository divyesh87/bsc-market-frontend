import { Box, Typography } from '@material-ui/core'
import React, { useState, useEffect } from 'react'
import styles from "../styles/NFTCard.module.css"
import ImageLoader from './ImageLoader'
import SellModal from './SellModal'

function DisplayNFT({ nft }) {

    const [Modal, setModal] = useState(false)
    const [metadataType, setmetadataType] = useState(null)


    useEffect(() => {
        if (!nft.token_uri) nft.token_uri = "https://sapphire-chemical-flamingo-314.mypinata.cloud/ipfs/QmXYmiRDNbScnUyiJe9rM8MxQxAh89krkMs8LNySJn8CMt"
        if (nft.token_uri.startsWith("https://res.cloudinary.com")) {
            setmetadataType("video")
        }
        else {
            setmetadataType("img")
        }
    }, [])
    function handleModal() {
        setModal(!Modal)
    }

    return (
        <div>
            <SellModal nft={nft} showModal={Modal} handleModal={handleModal} />
            <Box onClick={handleModal} className={styles.cardContainer}>
                <div className={styles.nftImage}>
                    {
                        metadataType == "img"
                            ?
                            <ImageLoader src={nft.token_uri} />
                            :
                            <video style={{ height: "30vh", width: "25vw" }} controls loop>
                                <source src={nft.token_uri} />
                            </video>
                    }

                </div>
                <Typography style={{ color: "white" }}>
                    {nft.symbol} #{nft.token_id}
                </Typography>
            </Box>
        </div>

    )
}

export default DisplayNFT