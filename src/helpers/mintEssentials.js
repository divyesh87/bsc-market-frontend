import axios from "axios";
import { toastInfo, toastError } from "./Toast";


const JWT = process.env.REACT_APP_PINATA_JWT


async function pinFileToIPFS(file) {
    if (!file) {
        toastError("Upload an image to mint")
        return
    }

    const formData = new FormData();
    formData.append("file", file);
    const metadata = JSON.stringify({
        name: file.name,
    });

    formData.append("pinataMetadata", metadata);
    const options = JSON.stringify({
        cidVersion: 0,
    });
    formData.append("pinataOptions", options);

    let ipfsHash = "";

    try {
        const res = await axios.post(
            "https://api.pinata.cloud/pinning/pinFileToIPFS",
            formData,
            {
                maxBodyLength: "Infinity",
                headers: {
                    "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
                    Authorization: JWT,
                },
            }
        );
        ipfsHash = res.data.IpfsHash;
        if (ipfsHash.length !== 0) {
            toastInfo('NFT Uploaded to IPFS Successfully')
        }
        return ipfsHash
    } catch (error) {
        toastError("IPFS upload failed!")
        console.log(error);
        return null
    }
}

export { pinFileToIPFS }