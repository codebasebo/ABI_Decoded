"use client";
import { useState, useEffect } from 'react';
import { Contract, isAddress } from "ethers";

// Explorer API configurations
const EXPLORERS = {
    '0x1': {
        apiUrl: 'https://api.etherscan.io/api',
        apiKey: 'YOUR_ETHERSCAN_API_KEY'
    },
    '0x5': {
        apiUrl: 'https://api-goerli.etherscan.io/api',
        apiKey: 'YOUR_ETHERSCAN_API_KEY'
    },
    '0xaa36a7': {
        apiUrl: 'https://api-sepolia.etherscan.io/api',
        apiKey: 'YOUR_ETHERSCAN_API_KEY'
    },
    '0x89': {
        apiUrl: 'https://api.polygonscan.com/api',
        apiKey: 'YOUR_POLYGONSCAN_API_KEY'
    },
    '0x38': {
        apiUrl: 'https://api.bscscan.com/api',
        apiKey: 'YOUR_BSCSCAN_API_KEY'
    }
};

function UploadContract({ signer, setAbi, setContract }) {
    const [abiString, setAbiString] = useState('');
    const [address, setAddress] = useState('');
    const [contractUploaded, setContractUploaded] = useState(false);
    const [error, setError] = useState(undefined);
    const [loading, setLoading] = useState(false);
    const [currentNetwork, setCurrentNetwork] = useState('');

    // Get current network
    useEffect(() => {
        const getNetwork = async () => {
            if (window.ethereum) {
                try {
                    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
                    setCurrentNetwork(chainId);

                    window.ethereum.on('chainChanged', (newChainId) => {
                        setCurrentNetwork(newChainId);
                        if (contractUploaded) {
                            resetContract();
                        }
                    });
                } catch (error) {
                    console.error('Error getting network:', error);
                }
            }
        };

        getNetwork();
    }, []);

    const fetchAbi = async (contractAddress) => {
        setLoading(true);
        setError(undefined);

        try {
            const explorer = EXPLORERS[currentNetwork];
            if (!explorer) {
                throw new Error('Explorer API not configured for this network');
            }

            const response = await fetch(
                `${explorer.apiUrl}?module=contract&action=getabi&address=${contractAddress}&apikey=${explorer.apiKey}`
            );
            const data = await response.json();

            if (data.status === "1" && data.result) {
                setAbiString(data.result);
                return true;
            } else {
                throw new Error(data.result || 'Contract ABI not found or contract not verified');
            }
        } catch (e) {
            setError(`Failed to fetch ABI: ${e.message}`);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const updateAddress = async (e) => {
        const newAddress = e.target.value.trim();
        setAddress(newAddress);

        // Auto-fetch ABI when a valid address is entered
        if (isAddress(newAddress)) {
            await fetchAbi(newAddress);
        }
    };

    const validateContractOnNetwork = async (address) => {
        try {
            // Check if address is valid
            if (!isAddress(address)) {
                throw new Error('Invalid contract address format');
            }

            // Check if contract exists on current network
            const code = await signer.provider.getCode(address);
            if (code === '0x') {
                throw new Error(`No contract found at this address on the current network (${getNetworkName(currentNetwork)})`);
            }
            return true;
        } catch (err) {
            throw new Error(err.message);
        }
    };

    const getNetworkName = (chainId) => {
        switch (chainId) {
            case '0x1': return 'Ethereum Mainnet';
            case '0x5': return 'Goerli Testnet';
            case '0xaa36a7': return 'Sepolia Testnet';
            case '0x89': return 'Polygon';
            case '0x38': return 'BSC';
            case '0xa4b1': return 'Arbitrum';
            case '0xa': return 'Optimism';
            default: return `Unknown Network (${chainId})`;
        }
    };

    const updateAbiString = data => {
        setError(undefined);
        setAbiString(data.target.value.trim());
    }

    const buildUI = async (e) => {
        e.preventDefault();
        setError(undefined);
        setLoading(true);

        try {
            // Validate contract exists on current network
            await validateContractOnNetwork(address);

            // Parse ABI and create contract instance
            let abi = JSON.parse(abiString);
            const contract = new Contract(address, abi, signer);
            abi = abi.filter(element => element.type === 'function');

            setAbi(abi);
            setContract(contract);
            setContractUploaded(true);
        } catch (err) {
            setError(err.message || 'Failed to initialize contract');
            console.error('Contract initialization error:', err);
        } finally {
            setLoading(false);
        }
    };

    const resetContract = () => {
        setContractUploaded(false);
        setContract(null);
        setAbi(null);
        setAbiString('');
        setAddress('');
        setError(null);
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-8 bg-gradient-to-b from-white to-gray-50 rounded-xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">
                        Contract Details
                    </h3>
                </div>
                {contractUploaded && (
                    <button
                        onClick={resetContract}
                        className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200"
                    >
                        Reset Contract
                    </button>
                )}
            </div>

            <form onSubmit={buildUI} className="space-y-6">
                <div className="mb-8">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Contract Address
                    </label>
                    <div className="relative">
                        <input
                            name="address"
                            type="text"
                            value={address}
                            placeholder="0x...."
                            onChange={updateAddress}
                            disabled={contractUploaded}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 text-black disabled:text-gray-500 transition-all duration-200"
                        />
                        {address && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            </div>
                        )}
                    </div>
                    {isAddress(address) && !contractUploaded && (
                        <button
                            type="button"
                            onClick={() => fetchAbi(address)}
                            disabled={loading}
                            className="mt-2 text-sm text-blue-600 hover:text-blue-700 focus:outline-none disabled:opacity-50"
                        >
                            {loading ? 'Fetching ABI...' : 'Fetch ABI'}
                        </button>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Contract ABI
                    </label>
                    <textarea
                        name="abi"
                        rows="10"
                        placeholder="Paste your contract ABI here..."
                        value={abiString}
                        onChange={updateAbiString}
                        disabled={contractUploaded}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 text-black disabled:text-gray-500 font-mono text-sm transition-all duration-200"
                    />
                </div>

                <button
                    type="submit"
                    disabled={!abiString || !address || loading || contractUploaded}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-blue-500/30"
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Loading ABI...</span>
                        </>
                    ) : (
                        <span>Load Contract</span>
                    )}
                </button>

                {error && (
                    <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}
            </form>
        </div>
    );
}

export default UploadContract;