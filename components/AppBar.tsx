"use client"
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import { useWallet } from "@solana/wallet-adapter-react"
import { useEffect, useState } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '@/utils';
import { useBalance } from '@/utils/balanceContext';
import { toast } from 'react-toastify';
import LoaderModal from './Loader/Loader';

export const AppBar = () => {
    const { publicKey, signMessage } = useWallet();
    const { balance, setBalance } = useBalance()
    const [loading, setLoading] = useState(false)

    async function fetchBalance() {
        if (publicKey && localStorage.getItem("token"))
            try {
                const response = await axios.get(`${BACKEND_URL}/v1/worker/balance`, {
                    headers: {
                        Authorization: localStorage.getItem("token")
                    }
                })
                setBalance(response.data.pendingAmount)
            } catch (error) {
            }
        else setBalance(0)
    }
    async function sendPayment() {
        if (!localStorage.getItem("token")) {
            toast("Please signin")
        }
        else try {
            setLoading(true)
            let response = await axios.post(`${BACKEND_URL}/v1/worker/payout`, {}, {
                headers: {
                    "Authorization": localStorage.getItem("token")
                }
            })

            let message = await response.data.message
            const delay = async (ms: number) => {
                const timeoutId = setTimeout(() => {
                    toast(message)
                    setLoading(false)
                    setBalance(0)
                }, ms);

                return () => {
                    clearTimeout(timeoutId);
                    console.log("Delay cleared.");
                };
            };
            await delay(20000)
        } catch (error) {
            setLoading(false)
            toast("Try Later")
        }
    }
    async function signAndSend() {
        if (publicKey) {
            const message = new TextEncoder().encode("Sign into mechanical turks")
            const signature = await signMessage?.(message);

            console.log({ signature, publicKey })
            const response = await axios.post(`${BACKEND_URL}/v1/worker/signin`, {
                signature,
                publicKey: publicKey?.toString()
            })
            setBalance(response.data.amount)
            console.log({ amount: response.data.amount })
            localStorage.setItem("token", response.data.token)
        }
    }

    useEffect(() => {
        signAndSend()
        fetchBalance()
    }, [publicKey]);

    return (
        <div className=' bg-white flex justify-between pb-2 pt-2 shadow-md'>
            {
                loading &&
                <div className="flex justify-center pt-4 max-w-screen-lg loader_bg">
                    <div className="px-4 mx-auto absolute top-1/2 left-1/2 
                            transform -translte-x-1/2 -translate-y-1/2">
                        <LoaderModal isVisible={loading} />
                    </div>
                </div>
            }
            <div className="text-2xl pl-4 ml-4 mt-2 flex justify-center font-bold ">Labelfy- <span className='italic'> Worker </span></div>
            <div className="text-xl pr-4 flex">
                <button onClick={sendPayment} className='mt-1 text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4
                focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800
                dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700'> Pay me out {balance} SOL</button>
                {publicKey ? <WalletDisconnectButton /> : <WalletMultiButton className='rounded-full text-sm' />}
            </div>
        </div>
    )
}