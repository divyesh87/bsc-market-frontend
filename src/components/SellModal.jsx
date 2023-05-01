import React, { useContext, useEffect, useRef, useState } from 'react'
import { Typography, Button } from '@material-ui/core'
import { Form, Modal } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import Web3 from "web3"
import config from "../bsc/config.json"
import { WalletContext } from './Wallet';

let marketContract;
let web3;

function SellModal({ nft, showModal, handleModal }) {
    const tokenContract = useRef(null)
    const [price, setprice] = useState(0)
    const { activeAcc } = useContext(WalletContext)

    useEffect(() => {

        web3 = new Web3(window.ethereum)
        async function intializeContracts() {
            tokenContract.current = new web3.eth.Contract(config.tokenContract.abi, nft.token_address);
            marketContract = new web3.eth.Contract(config.marketContract.abi, config.marketContract.address);
        }
        intializeContracts()

    }, [])


    async function sellNFT() {
        try {
            await approveMarketContract()
            await listonMarket();
        } catch (e) {
            console.log(e);
        }
    }

    async function listonMarket() {
        try {
            await marketContract.methods.listToken(nft.token_address, parseInt(nft.token_id), (price * 1e18).toString()).send({
                from: activeAcc
            })
        } catch (e) {
            console.log(e);
        }
    }

    async function approveMarketContract() {
        try {
            const res = await tokenContract.current.methods.approve(config.marketContract.address, parseInt(nft.token_id)).send({
                from: activeAcc
            })
            console.log(res);
        } catch (e) {
            console.log(e);
        }
    }
    return (
        <div>
            <Modal show={showModal} onHide={handleModal}>
                <Modal.Header style={{ background: "rgba(0, 0, 0, 0.85)" }} closeButton closeVariant='white'>
                    <Modal.Title>
                        <Typography style={{ color: "white" }}>
                            Sell your NFT
                        </Typography>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ backgroundColor: "rgba(0, 0, 0, 0.85)" }}>
                    <Form.Group>
                        <Form.Control type='number' required value={price} onChange={(e) => setprice(e.target.value)} placeholder="PRICE IN $BNB" />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer style={{ background: "rgba(0, 0, 0, 0.85)" }}>
                    <Button onClick={sellNFT} variant='outlined' style={{ color: "white", border: "1px solid white" }} >
                        Sell
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>


    )
}

export default SellModal