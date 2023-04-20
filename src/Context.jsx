import React, { useContext } from 'react'

const walletContext = React.createContext();



export function walletProvider({ children }) {
    const wallet = "xyz";

    return (
        <walletContext.Provider value={wallet}>
            {children}
        </walletContext.Provider>
    )
}