import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import styles from "../styles/navbar.module.css"
import { Toolbar, AppBar, Typography } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import { WalletContext } from "./Wallet"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Header() {

    const { connect, activeAcc, disconnect } = useContext(WalletContext)

    return (
        <>
            <AppBar className={styles.navbar} style={{ background: "black" }} position='static'>
                <Toolbar className={styles.menuContainer}>
                    <div className={styles.navLinks}>
                        <Link style={{ color: "white", textDecoration: "none", marginLeft: "5rem" }} to="/">
                            <Typography variant='h6'>
                                Ignitus Networks
                            </Typography>
                        </Link>
                        <Link style={{ color: "white", marginLeft: "5rem" }} to="/">
                            <Typography>Home</Typography>
                        </Link>
                        <Link style={{ color: "white", marginLeft: "5rem" }} to="/mint">
                            <Typography>Mint</Typography>
                        </Link>
                        <Link style={{ color: "white", marginLeft: "5rem" }} to="/mytokens">
                            <Typography>My Tokens</Typography>
                        </Link>
                    </div>
                    <div style={{display : "flex", justifyContent : "space-around", gap : "2rem", alignItems : "center"}}>
                        <Link style={{ color: "white", marginLeft: "5rem" }} to="/authenticate">
                            <Typography>Login / Signup</Typography>
                        </Link>
                       <Button onClick={activeAcc ? disconnect : connect} className={styles.walletBtn} variant='outlined' style={{ color: "white", border: "0.1rem solid white" }}>
                            {activeAcc ? activeAcc.slice(0, 3) + "..." + activeAcc.slice(activeAcc.length - 3, activeAcc.length) : "Connect"}
                        </Button>
                    </div>

                </Toolbar>

            </AppBar>
        </>
    )
}

export default Header