"use client";
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import NetworkSelector from './NetworkSelector';

function Connect({ setSigner }) {
    const [provider, setProvider] = useState(null);
    const [error, setError] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    const handleNetworkChange = async (chainId) => {
        if (provider) {
            try {
                const newProvider = new ethers.BrowserProvider(window.ethereum);
                const newSigner = await newProvider.getSigner();
                setSigner(newSigner);
            } catch (err) {
                console.error('Error updating signer after network change:', err);
            }
        }
    };

    useEffect(() => {
        if (typeof window !== 'undefined' && window.ethereum) {
            setProvider(window.ethereum);
        }
    }, []);

    const connect = async () => {
        setError(null);

        try {
            if (!window.ethereum) {
                throw new Error('MetaMask is not installed');
            }

            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const provider = new ethers.BrowserProvider(window.ethereum);
            const newSigner = await provider.getSigner();
            setSigner(newSigner);
            setIsConnected(true);

            window.ethereum.on('accountsChanged', (accounts) => {
                if (accounts.length === 0) {
                    setSigner(null);
                    setIsConnected(false);
                } else {
                    window.location.reload();
                }
            });

            window.ethereum.on('chainChanged', () => {
                window.location.reload();
            });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to connect wallet';
            setError(errorMessage);
            console.error('Wallet connection error:', err);
        }
    };

    return (
        <div className="min-h-[300px] flex flex-col items-center justify-center p-8 bg-gradient-to-b from-gray-50 to-white rounded-xl shadow-lg border border-gray-100">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {isConnected ? 'Switch Network' : 'Connect Your Wallet'}
                </h2>
                <p className="text-gray-600 mb-6">
                    {provider
                        ? isConnected
                            ? "Select a network to interact with"
                            : "Select network and connect your MetaMask wallet"
                        : "Please install MetaMask to continue"
                    }
                </p>
                <NetworkSelector onNetworkChange={handleNetworkChange} />
            </div>

            {provider && !isConnected && (
                <button
                    onClick={connect}
                    className="
                        flex items-center justify-center gap-2
                        w-full max-w-md
                        py-3 px-6 
                        rounded-lg
                        font-semibold
                        bg-blue-600 hover:bg-blue-700 
                        text-white
                        shadow-lg shadow-blue-500/30
                        hover:shadow-blue-500/40
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                        transition-all duration-200
                        active:scale-95
                    "
                >
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                    <span>Connect Wallet</span>
                </button>
            )}

            {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg w-full max-w-md">
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span className="font-medium">Connection Error</span>
                    </div>
                    <p className="mt-1 text-sm ml-7">{error}</p>
                </div>
            )}
        </div>
    );
}

export default Connect; 