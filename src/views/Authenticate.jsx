import { Box, Button, Typography } from '@material-ui/core'
import React, { useState } from 'react'
import styles from "../styles/Auth.module.css"
import { signInWithGoogle } from '../helpers/Firebase'
import { toastError, toastSuccess } from '../helpers/Toast'

function Authenticate() {
    const [userInfo, setUserInfo] = useState({
        displayName: null,
        photoUrl: null,
        email: null,
    })

    async function handleSignIn() {
        const user = await signInWithGoogle()
        console.log(user);
        if (!user) return toastError("Sign in Failed!")
        const { displayName, email, photoURL } = user;
        setUserInfo({ displayName, photoURL, email });
        toastSuccess("Sign in success!")
    }
    return (
        <Box className={styles.container}>

            <Typography variant='h4' style={{ color: "white" }}>
                Connect your google account using the below sign in options
            </Typography>
            {userInfo.displayName != null && <Typography variant='h6' style={{ color: "white", marginTop : "2rem" }}>
                Signed in as : {userInfo.displayName}
            </Typography>}
            <Button onClick={handleSignIn} variant='outlined' style={{ color: "white", border: "0.1rem solid white", margin: "2rem" }}>
                Sign in with google
            </Button>
        </Box>
    )
}

export default Authenticate