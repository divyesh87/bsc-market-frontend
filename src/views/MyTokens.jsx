import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../common/Header'
import styles from "../styles/MyTokens.module.css"
import { Box, Button, TextField, Typography } from '@material-ui/core'
import stxLogo from "../assets/images/stacksLogo.png"
import NFTCard from "../common/NFTCard"
import { EvmChain } from '@moralisweb3/common-evm-utils'
import { WalletContext } from '../common/Wallet'
import Moralis from "moralis";

const CHAIN = EvmChain.BSC_TESTNET;
function MyTokens() {

  const [nftMetadatas, setnftMetadatas] = useState([])
  const { connect, activeAcc } = useContext(WalletContext)

  useEffect(() => {
    async function startMoralis() {
      try {
        await Moralis.start({
          apiKey: "N1qS26kXpedENLybZLGl4ZcZXFlXCzk587tx9zHyuZTHSS29JbbOyzF6wSkNUitL"
        })
      } catch (e) {
        console.error("moralis sdk error");
      }
    }

    startMoralis()

  }, [])

  useEffect(() => {
    async function loadFromTokenContract() {
      try {
        const {jsonResponse} = await Moralis.EvmApi.nft.getWalletNFTs({
          address: activeAcc,
          chain: CHAIN
        })
        setnftMetadatas(jsonResponse.result)
      }
      catch (e) {
        console.error("Failed to fetch nfts");
      }
    }
    loadFromTokenContract()
  }, [activeAcc])


  return (
    <>
      <Box className={styles.pageContainer}>
        <div className={styles.tokensContainer}>
          <Typography align="center" variant='h4' style={{ color: "white" }}>
            Found {nftMetadatas.length} Tokens
            <hr />
          </Typography>
          <div className={styles.tokenDisplay}>
            {nftMetadatas.map(nft => {
              console.log(nft);
              return <NFTCard nft={nft} />
            })}
          </div>
        </div>
      </Box>
    </>
  )
}

export default MyTokens