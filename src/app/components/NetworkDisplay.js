"use client";
import { useState, useEffect } from 'react';

export default function NetworkDisplay() {
    const [network, setNetwork] = useState('');
    const [chainId, setChainId] = useState('');

    useEffect(() => {
        const getNetwork = async () => {
            if (window.ethereum) {
                try {
                    // Get the current chainId
                    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
                    updateNetwork(chainId);

                    // Listen for network changes
                    window.ethereum.on('chainChanged', updateNetwork);
                } catch (error) {
                    console.error('Error getting network:', error);
                }
            }
        };

        getNetwork();

        return () => {
            if (window.ethereum) {
                window.ethereum.removeListener('chainChanged', updateNetwork);
            }
        };
    }, []);

    const updateNetwork = (chainId) => {
        setChainId(chainId);
        switch (chainId) {
            case '0x1':
                setNetwork('Ethereum Mainnet');
                break;
            case '0x5':
                setNetwork('Goerli Testnet');
                break;
            case '0xaa36a7':
                setNetwork('Sepolia Testnet');
                break;
            case '0x89':
                setNetwork('Polygon');
                break;
            case '0x38':
                setNetwork('BSC');
                break;
            case '0xa4b1':
                setNetwork('Arbitrum');
                break;
            case '0xa':
                setNetwork('Optimism');
                break;
            default:
                setNetwork(`Unknown Network (${chainId})`);
        }
    };

    return (
        <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-sm">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="font-medium text-gray-700">{network}</span>
        </div>
    );
} 