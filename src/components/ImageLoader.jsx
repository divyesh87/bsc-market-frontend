import React, { useState } from 'react'
import failedLogo from "../assets/images/download.gif"
import { Box, Typography } from '@material-ui/core'

function ImageLoader({ src }) {
    const [imgLoaded, setimgLoaded] = useState(false)
    const [isError, setisError] = useState(false)

    function handleLoad() {
        setimgLoaded(true)
    }

    function handleError() {
        setisError(true);
    }

    return (
        <div>
            <img src={isError ? failedLogo : src} onLoad={handleLoad} onError={handleError} style={{ display: imgLoaded ? null : "none", maxHeight: "30vh", maxWidth: "35vw" }} />
            {
                isError &&
                <div style={{display : "flex" , justifyContent : "center"}}>
                    <Typography style={{color : "white"}}>
                        Failed to load
                    </Typography>
                </div>
            }
        </div >
    )
}

export default ImageLoader