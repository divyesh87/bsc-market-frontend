import { Box, Button, Input, Typography } from '@material-ui/core'
import React, { useRef, useState } from 'react'
import styles from "../styles/Auth.module.css"
import { signInWithGoogle, auth, signInWithPhoneNumber } from '../helpers/Firebase'
import { toastError, toastSuccess } from '../helpers/Toast'
import { getAuth, RecaptchaVerifier } from 'firebase/auth'
import { async } from '@firebase/util'

function Authenticate() {
    const [userInfo, setUserInfo] = useState({
        displayName: null,
        photoUrl: null,
        email: null,
    })

    const [phoneNo, setphoneNo] = useState("+91")
    const [signInMethod, setsignInMethod] = useState(null)
    const [otp, setotp] = useState("")
    const captchaRef = useRef(null)

    async function handleSignIn() {
        const user = await signInWithGoogle()
        console.log(user);
        if (!user) return toastError("Sign in Failed!")
        const { displayName, email, photoURL } = user;
        setUserInfo({ displayName, photoURL, email });
        toastSuccess("Sign in success!")
    }

    async function handlePhoneSignin() {
        setsignInMethod("phone")
    }

    async function generateCaptcha() {
        if(window.recaptchaVerifier) return;
        window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
            'size': 'invisible',
            'callback': (response) => {
            }
        }, auth);
    }

    async function signInwithOtp() {
        if (phoneNo == null || phoneNo.length < 10) {
            return toastError("Invalid number")
        }
 
        generateCaptcha()
        let appVerifier = window.recaptchaVerifier;
        signInWithPhoneNumber(auth, phoneNo, appVerifier).then(res => {
            window.confirmationResult = res;
        }).catch(err => {
            console.log(err);
        })
    }

    async function submitOTP(){
        if(otp.length < 6 ) return toastError("Invalid otp!")
        let confirmationResult = window.confirmationResult;
        confirmationResult.confirm(otp).then(res => {
            const user = res.user;
            toastSuccess("Login success! You are in our Access control List")
            console.log(user);
        }).catch(err => {
            console.log(err);
            toastError("Invalid OTP!")
        })
    }

    return (
        <Box className={styles.container}>

            <Typography variant='h4' style={{ color: "white" }}>
                Click on one of the below methods to Sign in
            </Typography>
            {userInfo.displayName != null && <Typography variant='h6' style={{ color: "white", marginTop: "2rem" }}>
                Signed in as : {userInfo.displayName}
            </Typography>}
            {signInMethod !== "phone" && <Button onClick={handleSignIn} variant='outlined' style={{ color: "white", border: "0.1rem solid white", margin: "2rem" }}>
                Sign in with google
            </Button>}
            {signInMethod != "phone" && signInMethod === null && <Button onClick={handlePhoneSignin} variant='outlined' style={{ color: "white", border: "0.1rem solid white", margin: "2rem" }}>
                Sign in with Phone Number
            </Button>}

            {signInMethod === "phone" &&
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <input
                        onChange={(e) => setphoneNo(e.target.value)}
                        value={phoneNo}
                        style={{ padding: "0.5rem", width: "100%", marginTop: "2rem" }}
                        placeholder="Enter your number!"
                    />
                    <input
                        onChange={(e) => setotp(e.target.value)}
                        value={otp}
                        style={{ width: "60%", marginTop: "2rem", padding: "0.4rem" }}
                        placeholder="Enter OTP Recieved"
                    />
                    <Button onClick={!otp ? signInwithOtp : submitOTP} variant='outlined' style={{ color: "white", border: "0.1rem solid white", marginTop: "2rem" }}>
                        {!otp ? "Send OTP" : "Submit"}
                    </Button>
                </div>}
            { }
            <div ref={captchaRef} id="recaptcha-container"></div>
        </Box>
    )
}

export default Authenticate