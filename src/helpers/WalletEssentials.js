import Web3 from "web3";

const BSC_CHAIN_ID = 97;
const web3 = new Web3()

function checkIfConnected() {
    if (!window.ethereum) return false;
    else return window.ethereum.isConnected();
}

function isConnectedToBSC() {
    console.log(window.ethereum.networkVersion);
    console.log(parseInt(window.ethereum.networkVersion) == BSC_CHAIN_ID);
}

async function switchToBSC() {
    if (!isConnectedToBSC()) {
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
            else console.log(err);
        }
    }
}

export { checkIfConnected, switchToBSC, isConnectedToBSC }