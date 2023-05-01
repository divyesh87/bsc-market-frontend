import React, { useContext, useEffect, useState } from 'react'
import styles from "../styles/MyTokens.module.css"
import { Box, Typography } from '@material-ui/core'
import NFTCard from "../components/NFTCard"
import { EvmChain } from '@moralisweb3/common-evm-utils'
import { WalletContext } from '../components/Wallet'
import Moralis from "moralis";


const CHAIN = EvmChain.BSC_TESTNET;
function MyTokens() {

  const [nftMetadatas, setnftMetadatas] = useState([])
  const { activeAcc } = useContext(WalletContext)

  useEffect(() => {
    async function startMoralis() {
      try {
        await Moralis.start({
          apiKey: process.env.REACT_APP_MORALIS_API_KEY
        })
      } catch (e) {
        console.error("Moralis SDK error");
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
            {nftMetadatas.map((nft , key)=> {
              return <NFTCard nft={nft} key={key}/>
            })}
          </div>
        </div>
      </Box>
    </>
  )
}

export default MyTokens