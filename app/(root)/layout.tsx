"use client"
import "./../globals.css";
import React, { FC, useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';

// Default styles that can be overridden by your app
import '@solana/wallet-adapter-react-ui/styles.css';
import { BalanceProvider } from "@/utils/balanceContext";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const network = WalletAdapterNetwork.Devnet;

  // You can also provide a custom RPC endpoint.
  // const endpoint = useMemo(() => clusterApiUrl(network), [network]);


  // Custom endpoint RPC here.
  const endpoint = "https://solana-devnet.g.alchemy.com/v2/AST8vSberMaE6RY3opJKTHnaKib_YBHD"

  const wallets = useMemo(
    () => [],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [network]
  );


  return (
    <div className="min-h-screen bg-gray-100">
      <BalanceProvider>
        <ConnectionProvider endpoint={endpoint}>
          <WalletProvider wallets={wallets} autoConnect>
            <WalletModalProvider>
              {children}
            </WalletModalProvider>
          </WalletProvider>
      <ToastContainer />

        </ConnectionProvider>
      </BalanceProvider>
    </div>
  );
}