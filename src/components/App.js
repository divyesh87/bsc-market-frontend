import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "../views/Home"
import Mint from "../views/Mint"
import MyTokens from "../views/MyTokens"
import Header from "./Header"
import { WalletContext } from "./Wallet"
import { useState } from "react"
import { checkIfConnected, switchToBSC } from "../helpers/WalletEssentials"



function App() {

  const [activeAcc, setactiveAcc] = useState(null)
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

  window.ethereum.on('accountsChanged', handleAccountsChanged);
  function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
      console.log('Please connect to MetaMask.');
    } else if (accounts[0] !== activeAcc) {
      setactiveAcc(accounts[0]);
    }
  }

  return (
    <>
      <BrowserRouter>
        <WalletContext.Provider value={{ connect, activeAcc, checkIfConnected }}>
          <Header />
          <Routes>
            <Route path="/" Component={Home} />
            <Route path="/mint" Component={Mint} />
            <Route path="/mytokens" Component={MyTokens} />
          </Routes>
        </WalletContext.Provider>
      </BrowserRouter>
    </>

  );
}

export default App;
