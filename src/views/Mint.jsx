import React, { useContext, useEffect, useState } from 'react'
import { Box, Button, Typography } from '@material-ui/core'
import styles from "../styles/Mint.module.css"
import DisplayNFT from "../common/DisplayNFT"
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import config from "../bsc/config.json"
import Web3 from 'web3'
import { WalletContext } from '../common/Wallet'


const JWT = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI0YmEwODgyNS1lMDU0LTRmZjgtODdkYi03YjUyNTNiODg4ZjciLCJlbWFpbCI6ImRpdnllc2hsYWx3YW5pMEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiODA5MzI5MjQ3MmFjYTE2NzAzOTAiLCJzY29wZWRLZXlTZWNyZXQiOiI0NGFhOWZkOTQ4YTQ5NmM5NTk0MzIwZWU1NjJlMzRkNjFlYzQ0OTMxM2M2YmIxNTc4NGI2ZDY3NjkyY2U3YWE0IiwiaWF0IjoxNjgxOTkxMjg1fQ.KmG3N0NreJXzm51Gbp13qMXeAya9GpAHqREwCTeCtFA"

let web3;
let tokenContract;
let playableTokenContract;
const OFFCHAIN_METADATA_URL = "https://bnb-mkt-backend-u.onrender.com/upload"

function Mint() {

  const [file, setfile] = useState(null)
  const [selectedFile, setselectedFile] = useState(null)
  const { connect, activeAcc } = useContext(WalletContext)
  const [metadataType, setmetadataType] = useState(null);

  useEffect(() => {

    web3 = new Web3(window.ethereum)
    async function loadContract() {
      tokenContract = new web3.eth.Contract(config.tokenContract.abi, config.tokenContract.address);
      playableTokenContract = new web3.eth.Contract(config.playableNFTContract.abi, config.playableNFTContract.address);
    }
    loadContract()

  }, [])


  function handleFile(e) {
    try {
      const file = e.target.files[0];
      if (file.type.startsWith("image/")) {
        setselectedFile(file)
        setmetadataType("img");
        const reader = new FileReader();

        reader.addEventListener("load", () => {
          setfile(reader.result)
        })

        reader.readAsDataURL(file)
      }
      else if (file.type.startsWith("video/")) {
        setmetadataType("video")
        setselectedFile(file)
        setfile(file)
      }
      else return alert("Invalid type");

    } catch (e) {
      alert("somthing went wrong")
    }

  }

  async function mintTOIPFS() {
    const formData = new FormData();
    formData.append("file", selectedFile);
    const metadata = JSON.stringify({
      name: "test",
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
      console.log(res.data);
      ipfsHash = res.data.IpfsHash;
      if (ipfsHash.length != 0) {
        toast.info('NFT Uploaded to IPFS Successfully', {
          position: "top-left",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
      mint(ipfsHash);
      console.log(ipfsHash);
    } catch (error) {
      toast.error("IPFS upload failed!", {
        position: "top-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      console.log(error);
    }
  }

  async function mint(hash) {
    console.log(hash);
    try {
      const contract = metadataType == "img" ? tokenContract : playableTokenContract

      const res = await contract.methods.safeMint(activeAcc, hash.toString()).send({
        from: activeAcc
      })
      if (res.blockHash != null) {
        toast.success("NFT Minted Successfully", {
          position: "top-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }

    } catch (e) {
      toast.error("Failed to mint NFT", {
        position: "top-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      console.log(e);
    }
  }
  async function mintNFT(e) {
    e.preventDefault();
    if (metadataType == "img") {
      mintTOIPFS()
    }
    else if (metadataType == "video") {
      mintOffChain()
    }
    else {
      return alert("invalid type")
    }
  }

  async function mintOffChain() {
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const { data } = await axios.post(OFFCHAIN_METADATA_URL, formData);
      if (!data.success) throw Error("failed")
      console.log(data.id);
      mint(data.id);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <>
      <Box className={styles.mintPageContainer}>
        <div>
          <Typography variant='h4' style={{ color: "white" }}>
            Create Your Own Digital Legacy with our NFT Minting Service
          </Typography>
          <Typography variant='subtitle1' style={{ color: "white" }}>
            All of your NFT files, including metadata and assets, are stored on the decentralized Pinata IPFS network. This means that your NFTs are safe from censorship and single points of failure.
          </Typography>
          <hr />
        </div>
        <div className={styles.mintContainer}>
          <div>
            <DisplayNFT owner="test" type={metadataType} file={file ? file : null} />
          </div>
          <div className={styles.mintControls}>
            <input onChange={(e) => handleFile(e)} style={{ color: "white", backgroundColor: "black", border: "2px solid white", }} type="file" />
            <Button onClick={mintNFT} className={styles.mintBtn} variant='outlined' style={{ color: "white", background: "black", border: "1px solid white" }} >
              Mint
            </Button>
          </div>
        </div>
        <ToastContainer />
      </Box>
    </>
  )
}

export default Mint