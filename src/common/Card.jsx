import { Box, Button, Typography } from '@material-ui/core'
import React from 'react'
import stxLogo from "../assets/images/stacksLogo.png"
import styles from "../styles/Card.module.css"

function Card({ src, price, seller}) {
    return (
        <Box className={styles.cardContainer}>
            <div className={styles.nftImage}>
                <img style={{ height: "30vh" }} src={src} />
            </div>
            <div>
                <Typography style={{ color: "white", display: "flex", alignItems : "center" }} variant='subtitle1'>
                    ASK : {price}
                    <img style={{ height: "1.75rem", borderRadius: "50%" , marginLeft : "0.5rem"}} src={stxLogo} />
                </Typography>
            </div>
            <div>
                <Typography style={{ color: "white", marginTop : "0.2rem" }} variant="subtitle1">
                    SELLER : {seller}
                </Typography>
            </div>
            <Button variant='outlined' style={{color : "white", border : "0.1rem solid white", width : "100%", marginTop : "0.4rem"}}>
                Buy
            </Button>
        </Box>
    )
}

export default Card