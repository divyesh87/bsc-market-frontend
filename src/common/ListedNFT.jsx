import { Box, Button, Typography } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import bnbIcon from "../assets/images/bnbIcon.png"
import styles from "../styles/Card.module.css"
import config from "../bsc/config.json"
import Web3 from 'web3'

let tokenContract;
let web3;
function ListedNFT({ nft }) {
    const [nftMetadata, setnftMetadata] = useState({
        price: "---",
        seller: "----",
        src: null
    })

    useEffect(() => {
        web3 = new Web3(window.ethereum)
        async function loadAndFetch() {

            async function intializeContracts() {
                tokenContract = new web3.eth.Contract(config.tokenContract.abi, nft.tokenContract);
            }

            async function fetchNFTImg() {
                const src = await tokenContract.methods.tokenURI(nft.tokenId).call()
                setnftMetadata({ ...nftMetadata, src: src })
            }
            await intializeContracts()
            await fetchNFTImg()
        }
        loadAndFetch()
        setnftMetadata({ ...nftMetadata, seller: nft.seller, price: nft.price / 1e18 })

    }, [])



    console.log(nft);

    return (
        <Box className={styles.cardContainer}>
            <div className={styles.nftImage}>
                <img style={{ height: "30vh" }} src={nftMetadata.src} />
            </div>
            <div>
                <Typography style={{ color: "white", display: "flex", alignItems: "center" }} variant='subtitle1'>
                    ASK : {nftMetadata.price}
                    <img style={{ height: "1.75rem", borderRadius: "50%", marginLeft: "0.5rem" }} src={bnbIcon} />
                </Typography>
            </div>
            <div>
                <Typography style={{ color: "white", marginTop: "0.2rem" }} variant="subtitle1">
                    SELLER : {nftMetadata.seller}
                </Typography>
            </div>
            <Button variant='outlined' style={{ color: "white", border: "0.1rem solid white", width: "100%", marginTop: "0.4rem" }}>
                Buy
            </Button>
        </Box>
    )
}

export default ListedNFT