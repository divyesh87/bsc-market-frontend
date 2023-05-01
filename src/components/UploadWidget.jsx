import React, { useEffect, useRef, useState } from 'react'

function UploadWidget({ nftDetails, setNftDetails }) {

    const cloudinaryRef = useRef()
    const widgetRef = useRef()
    const [isReady, setisReady] = useState(false)

    useEffect(() => {
        cloudinaryRef.current = window.cloudinary;
        widgetRef.current = cloudinaryRef.current.createUploadWidget({
            cloudName: "dkgmmltqt",
            uploadPreset: "tyrb0jjy",
            resource_type: "video"
        }, (err, res) => {
            if (err) console.log("Widget error" + err);
            else handleEvent(res)
        })

        setisReady(true);

    }, [])

    function handleEvent(res) {
        console.log(res);
        if (res.event === "queues-end" && res.data.info.files[0].failed) {
            console.log("failed");
        }
        else if (res.event && res.event === "success" && res.info.public_id) {
            widgetRef.current.close()
            setNftDetails({ ...nftDetails, url: res.info.secure_url, uploaded: true })
        }
    }

    return (
        <div>
            {isReady &&
                <button onClick={widgetRef.current.open}>
                    Upload
                </button>
            }
        </div>
    )
}

export default UploadWidget