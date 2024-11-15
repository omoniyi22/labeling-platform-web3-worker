import { AppBar } from '@/components/AppBar';
import Hero from '@/components/Hero';
import { NextTask } from '@/components/NextTask';
import { Upload } from '@/components/Upload';

import Image from "next/image";

export default function Home() {
    return (
        <div className='bg-gray-100 min-h-screen'>
            <AppBar />
            <NextTask />
            <div className='mt-100'>
                <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 mb-4">
                    <button className="bg-white text-white py-2 px-4 rounded shadow-lg ">
                        <span className="text-red-600"><span className='font-semibold'>NOTE: Connect to Your Solana Devnet Wallet Address for withdrawal.</span></span>
                    </button>
                </div>
            </div>
        </div>
    )
}
