import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "../views/Home"
import Mint from "../views/Mint"
import MyTokens from "../views/MyTokens"
import Header from "./Header"
import { WalletContext } from "./Wallet"
import { useEffect, useState } from "react"
import { checkIfConnected, switchToBSC, isConnectedToBSC } from "../helpers/WalletEssentials"
import { toastError, toastInfo } from "../helpers/Toast"
import { ToastContainer } from "react-toastify"



function App() {

  const [activeAcc, setactiveAcc] = useState(null)
  useEffect(() => {


    if (!window.ethereum?.isMetaMask) {
      setTimeout(() => {
        toastError("Metamask not detected! The app may not work as expected")
      }, 3000)
      return
    } else {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }
    if (!isConnectedToBSC()) {
      setTimeout(() => {
        toastInfo("You are not connected to BSC, pleae switch to BSC to run full features of the app!")
      }, 2000)
      setTimeout(() => {
        switchToBSC()
      }, 3000)
    }

    if (window.ethereum.selectedAddress) {
      console.log(window.ethereum.selectedAddress);
      connect()
    }

    connectOnLoad()

  }, [])

  async function connectOnLoad() {
    if (await checkIfConnected()) connect()
  }

  async function disconnect() {
    handleAccountsChanged([])
  }

  async function connect() {
    try {
      const accs = await window.ethereum.request({ method: "eth_requestAccounts" })
      switchToBSC()
      handleAccountsChanged(accs)
    } catch (e) {
      alert("Something went wrong while connecting metamask");
      console.log(e);
    }
  }

  function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
      toastInfo("Wallet disconnected!")
      setactiveAcc(null)
    } else if (accounts[0] !== activeAcc) {
      setactiveAcc(accounts[0]);
    }
  }

  return (
    <>
      <BrowserRouter>
        <WalletContext.Provider value={{ connect, activeAcc, checkIfConnected, disconnect }}>
          <Header />
          <Routes>
            <Route path="/" Component={Home} />
            <Route path="/mint" Component={Mint} />
            <Route path="/mytokens" Component={MyTokens} />
          </Routes>
        </WalletContext.Provider>
        <ToastContainer />
      </BrowserRouter>
    </>

  );
}

export default App;
