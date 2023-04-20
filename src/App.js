import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./views/Home"
import Mint from "./views/Mint"
import MyTokens from "./views/MyTokens"
import Header from "./common/Header"
import { WalletContext } from "./common/Wallet"
import { useState, useEffect } from "react"
import Web3 from "web3"

const BSC_CHAIN_ID = 97;
const web3 = new Web3()

function App() {

  const [activeAcc, setactiveAcc] = useState(null)

  function checkIfConnected() {
    if (!window.ethereum) return false;
    else return window.ethereum.isConnected();
  }

  async function switchToBSC() {
    if (window.ethereum.networkVersion !== BSC_CHAIN_ID) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: web3.utils.toHex(BSC_CHAIN_ID) }]
        });
      } catch (err) {
        if (err.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainName: 'BSC TESTNET',
                chainId: web3.utils.toHex(BSC_CHAIN_ID),
                nativeCurrency: { name: 'BNB', decimals: 18, symbol: 'BNB' },
                rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545']
              }
            ]
          });
        }
      }
    }
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
