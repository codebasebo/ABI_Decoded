"use client";
import { useState } from 'react';
import Connect from './components/connect';
import UploadContract from './components/UploadContract';
import ContractUI from './components/contractUI';
import NetworkDisplay from './components/NetworkDisplay';
import NetworkSelector from './components/NetworkSelector';
import { ethers } from 'ethers';

export default function Home() {
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [abi, setAbi] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex flex-col items-center justify-center mb-6">
            <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
              ABI Decoded
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Seamlessly interact with smart contracts across multiple networks
            </p>
            {signer ? (
              <NetworkSelector onNetworkChange={async (chainId) => {
                const provider = new ethers.BrowserProvider(window.ethereum);
                const newSigner = await provider.getSigner();
                setSigner(newSigner);
                setContract(null);
                setAbi(null);
              }} />
            ) : (
              <NetworkDisplay />
            )}
          </div>
          <div className="w-full max-w-3xl mx-auto border-b border-gray-200" />
        </div>

        {/* Main Content */}
        <div className="relative max-w-4xl mx-auto">
          {/* Background Decoration */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-purple-50/50 transform -skew-y-3 rounded-3xl -z-10" />

          {/* Content */}
          <div className="relative z-10 space-y-8">
            {!signer ? (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 animate-fadeIn">
                <Connect setSigner={setSigner} />
              </div>
            ) : (
              <div className="space-y-8 animate-fadeIn">
                {/* Contract Upload Section */}
                <div className="bg-white rounded-2xl shadow-xl p-1">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                        <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-green-600">Wallet Connected</span>
                    </div>
                    <UploadContract signer={signer} setAbi={setAbi} setContract={setContract} />
                  </div>
                </div>

                {/* Contract Interaction Section */}
                {abi && Array.isArray(abi) ? (
                  <div className="animate-slideUp">
                    <ContractUI abi={abi} contract={contract} />
                  </div>
                ) : contract && (
                  <div className="bg-white rounded-xl p-6 shadow-md animate-slideUp text-center">
                    <div className="flex items-center justify-center gap-3 text-gray-600">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>No functions found in ABI</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-20 text-center">
          <div className="py-8 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Built with ❤️ for the Web3 community
            </p>
            <div className="mt-2 text-xs text-gray-500">
              © {new Date().getFullYear()} ABI Decoded. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
