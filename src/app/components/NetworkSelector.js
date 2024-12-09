"use client";
import { useState, useEffect } from 'react';

const NETWORKS = {
    '0x1': {
        name: 'Ethereum Mainnet',
        chainId: '0x1',
        rpcUrl: 'https://eth.public-rpc.com',
        currencySymbol: 'ETH',
        blockExplorer: 'https://etherscan.io'
    },
    '0x5': {
        name: 'Goerli Testnet',
        chainId: '0x5',
        rpcUrl: 'https://goerli.blockpi.network/v1/rpc/public',
        currencySymbol: 'ETH',
        blockExplorer: 'https://goerli.etherscan.io'
    },
    '0xaa36a7': {
        name: 'Sepolia Testnet',
        chainId: '0xaa36a7',
        rpcUrl: 'https://rpc.sepolia.org',
        currencySymbol: 'ETH',
        blockExplorer: 'https://sepolia.etherscan.io'
    },
    '0x89': {
        name: 'Polygon',
        chainId: '0x89',
        rpcUrl: 'https://polygon-rpc.com',
        currencySymbol: 'MATIC',
        blockExplorer: 'https://polygonscan.com'
    },
    '0x38': {
        name: 'BSC',
        chainId: '0x38',
        rpcUrl: 'https://bsc-dataseed1.binance.org',
        currencySymbol: 'BNB',
        blockExplorer: 'https://bscscan.com'
    }
};

export default function NetworkSelector({ onNetworkChange }) {
    const [selectedNetwork, setSelectedNetwork] = useState('0x1');
    const [currentChainId, setCurrentChainId] = useState(null);
    const [isChanging, setIsChanging] = useState(false);

    useEffect(() => {
        const checkNetwork = async () => {
            if (window.ethereum) {
                try {
                    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
                    setCurrentChainId(chainId);
                    setSelectedNetwork(chainId);
                } catch (error) {
                    console.error('Error getting network:', error);
                }
            }
        };

        checkNetwork();

        if (window.ethereum) {
            window.ethereum.on('chainChanged', (chainId) => {
                setCurrentChainId(chainId);
                setSelectedNetwork(chainId);
                onNetworkChange && onNetworkChange(chainId);
            });
        }
    }, [onNetworkChange]);

    const switchNetwork = async (chainId) => {
        setIsChanging(true);
        try {
            if (!window.ethereum) throw new Error("No crypto wallet found");

            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId }],
            }).catch(async (switchError) => {
                // This error code indicates that the chain has not been added to MetaMask.
                if (switchError.code === 4902) {
                    const network = NETWORKS[chainId];
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [
                            {
                                chainId: network.chainId,
                                chainName: network.name,
                                nativeCurrency: {
                                    name: network.currencySymbol,
                                    symbol: network.currencySymbol,
                                    decimals: 18
                                },
                                rpcUrls: [network.rpcUrl],
                                blockExplorerUrls: [network.blockExplorer]
                            }
                        ],
                    });
                }
            });

            setSelectedNetwork(chainId);
            onNetworkChange && onNetworkChange(chainId);
        } catch (err) {
            console.error('Error switching network:', err);
        } finally {
            setIsChanging(false);
        }
    };

    const handleNetworkChange = (e) => {
        const newNetwork = e.target.value;
        setSelectedNetwork(newNetwork);
        switchNetwork(newNetwork);
    };

    return (
        <div className="relative">
            <select
                value={selectedNetwork}
                onChange={handleNetworkChange}
                disabled={isChanging}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-black"
            >
                {Object.entries(NETWORKS).map(([chainId, network]) => (
                    <option key={chainId} value={chainId} className="text-black">
                        {network.name}
                    </option>
                ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </div>
            {isChanging && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                </div>
            )}
        </div>
    );
} 