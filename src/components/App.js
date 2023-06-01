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
import Footer from "./Footer"
import Authenticate from "../views/Authenticate"



function App() {

  const [activeAcc, setactiveAcc] = useState(null)
  useEffect(() => {

    async function main() {
      if (!window.ethereum?.isMetaMask) {
        setTimeout(() => {
          toastError("Metamask not detected! The app may not work as expected")
        }, 3000)
        return
      } else {
        window.ethereum.on('accountsChanged', handleAccountsChanged);
      }
      if (!await isConnectedToBSC()) {
        setTimeout(() => {
          toastInfo("You are not connected to BSC, pleae switch to BSC to run full features of the app!")
        }, 2000)
      }

      if (window.ethereum.selectedAddress) {
        connect()
      }

      connectOnLoad()
    }

    main()
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
      await switchToBSC()
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
            <Route path="/authenticate" Component={Authenticate} />
          </Routes>
          <Footer />
        </WalletContext.Provider>
        <ToastContainer />
      </BrowserRouter>
    </>

  );
}

export default App;
