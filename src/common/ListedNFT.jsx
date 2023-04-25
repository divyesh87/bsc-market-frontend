import { Box, Button, Typography } from '@material-ui/core'
import React, { useContext, useEffect, useState, useRef } from 'react'
import bnbIcon from "../assets/images/bnbIcon.png"
import styles from "../styles/Card.module.css"
import config from "../bsc/config.json"
import Web3 from 'web3'
import { WalletContext } from './Wallet'

let marketContract;
let web3;
function ListedNFT({ nft }) {
    const tokenContract = useRef(null)
    const [metadataType, setmetadataType] = useState(null)
    const [nftMetadata, setnftMetadata] = useState({
        price: nft.price / 1e18,
        seller: nft.seller,
        src: null
    })
    const { activeAcc } = useContext(WalletContext)

    useEffect(() => {
        setnftMetadata({ ...nftMetadata, seller: nft.seller, price: nft.price / 1e18 })
        web3 = new Web3(window.ethereum)
        async function loadAndFetch() {

            async function intializeContracts() {
                tokenContract.current = new web3.eth.Contract(config.tokenContract.abi, nft.tokenContract);
                marketContract = new web3.eth.Contract(config.marketContract.abi, config.marketContract.address);
            }

            async function fetchNFTImg() {
                try {
                    const src = await tokenContract.current.methods.tokenURI(nft.tokenId).call()
                    if (src.startsWith("https://bnb-mkt-backend-u.onrender.com/metadata")) {
                        setmetadataType("video")
                        console.log(src);
                    }
                    else {
                        setmetadataType("img")
                    }
                    setnftMetadata({ ...nftMetadata, src: src })
                } catch (e) {
                    console.log(e);
                }
            }
            await intializeContracts()
            await fetchNFTImg()
        }
        loadAndFetch()

    }, [])

    async function buyNFT() {
        await marketContract.methods.buyToken(nft.listingId).send({
            from: activeAcc,
            value: nft.price
        })
    }

    return (
        <Box className={styles.cardContainer}>
            <div className={styles.nftImage}>
                {metadataType == "video"
                    ?
                    <video style={{ height: "30vh", width: "25vw" }} controls loop>
                        <source src={nftMetadata.src} />
                    </video> :
                    <img style={{ height: "30vh" }} src={nftMetadata.src} />


                }
            </div>
            <div>
                <Typography style={{ color: "white", display: "flex", alignItems: "center" }} variant='subtitle1'>
                    ASK : {nftMetadata.price}
                    <img style={{ height: "1.75rem", borderRadius: "50%" }} src={bnbIcon} />
                </Typography>
            </div>
            <div>
                <Typography style={{ color: "white", marginTop: "0.2rem" }} variant="subtitle1">
                    SELLER : {nftMetadata.seller.slice(0, 4)}...{nftMetadata.seller.slice(nftMetadata.seller.length - 3, nftMetadata.seller.length)}
                </Typography>
            </div>
            <Button onClick={buyNFT} variant='outlined' style={{ color: "white", border: "0.1rem solid white", width: "100%", marginTop: "0.4rem" }}>
                Buy
            </Button>
        </Box>
    )
}

export default ListedNFT