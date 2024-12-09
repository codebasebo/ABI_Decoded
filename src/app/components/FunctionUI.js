"use client";

import { useState } from 'react';

export default function FunctionUI({ fn, contract }) {
    const initialInputVals = fn.inputs.reduce(
        (acc, input) => ({ ...acc, [input.name]: '' }),
        {}
    );

    const [inputVals, setInputVals] = useState(initialInputVals);
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState();
    const [txConfirmation, setTxConfirmation] = useState();
    const [error, setError] = useState();

    // Update state with input field values
    const updateInputVal = (name, event) => {
        setInputVals(prev => ({ ...prev, [name]: event.target.value }));
    };

    // Check if all required inputs are filled
    const isDisabled = () => {
        return fn.inputs.some(input => !inputVals[input.name]);
    };

    // Format arguments for the contract call based on input types
    const formatArgs = (inputs, values) => {
        return inputs.map(input => {
            const value = values[input.name];
            switch (input.type) {
                case 'uint256':
                    return value === '' ? '0' : value;
                case 'address':
                    if (!value || !value.startsWith('0x') || value.length !== 42) {
                        throw new Error(`Invalid address format for ${input.name}`);
                    }
                    return value;
                case 'bool':
                    return value.toLowerCase() === 'true';
                default:
                    return value;
            }
        });
    };

    // Handle function execution
    const executeFn = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(undefined);
        setResponse(undefined);
        setTxConfirmation(undefined);

        try {
            let result;
            if (fn.inputs.length === 0) {
                result = await contract[fn.name]();
            } else {
                const args = formatArgs(fn.inputs, inputVals);
                result = await contract[fn.name](...args);
            }

            if (fn.stateMutability === 'view') {
                if (result === null || result === undefined || result === '0x') {
                    setResponse('No result or empty data returned');
                } else if (typeof result === 'bigint') {
                    setResponse(result.toString());
                } else if (Array.isArray(result)) {
                    setResponse(result.map(item =>
                        typeof item === 'bigint' ? item.toString() : String(item)
                    ).join(', '));
                } else {
                    setResponse(String(result));
                }
            } else {
                const receipt = await result.wait();
                setTxConfirmation(`Transaction confirmed: ${receipt.hash}`);
            }
        } catch (err) {
            console.error('Function execution error:', err);
            setError(err instanceof Error ? err.message : 'Failed to execute function');
        } finally {
            setLoading(false);
        }
    };

    const formatErrorMessage = (error) => {
        if (error.includes('user denied')) {
            return 'Transaction rejected by user';
        }
        if (error.includes('insufficient funds')) {
            return 'Insufficient funds for transaction';
        }
        // Remove common prefixes from error messages
        return error
            .replace('ethers-user-denied: MetaMask Tx Signature: ', '')
            .replace('execution reverted: ', '')
            .replace('Error: ', '');
    };

    const formatResponse = (response) => {
        if (typeof response === 'string') {
            // If response is a transaction hash, format it nicely
            if (response.startsWith('0x') && response.length === 66) {
                return (
                    <a
                        href={`https://etherscan.io/tx/${response}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 break-all"
                    >
                        {response}
                    </a>
                );
            }
            // For long responses, add word break
            return <span className="break-all">{response}</span>;
        }
        return response;
    };

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">{fn.name}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${fn.stateMutability === 'view'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-blue-100 text-blue-800'
                    }`}>
                    {fn.stateMutability}
                </span>
            </div>

            {/* Input Form */}
            <form onSubmit={executeFn} className="space-y-4">
                {fn.inputs.map((input, index) => (
                    <div key={`${fn.name}-${input.name}-${index}`} className="space-y-2">
                        <label
                            htmlFor={`${fn.name}-${input.name}`}
                            className="block text-sm font-medium text-gray-700"
                        >
                            {input.name}
                            <span className="ml-2 text-xs text-gray-500">({input.type})</span>
                        </label>
                        <input
                            id={`${fn.name}-${input.name}`}
                            name={input.name}
                            type="text"
                            value={inputVals[input.name]}
                            onChange={e => updateInputVal(input.name, e)}
                            placeholder={`Enter ${input.type}`}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        />
                    </div>
                ))}

                <button
                    type="submit"
                    disabled={isDisabled() || loading}
                    className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md
          focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-blue-600
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all duration-200"
                >
                    {loading ? 'Processing...' : 'Execute'}
                </button>
            </form>

            {/* Feedback Section */}
            {(response || txConfirmation || error) && (
                <div className="mt-4 p-3 rounded-md border">
                    {response && (
                        <div className="text-green-700 bg-green-50 p-3 rounded overflow-auto max-h-[200px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                            {formatResponse(response)}
                        </div>
                    )}
                    {txConfirmation && (
                        <div className="text-blue-700 bg-blue-50 p-3 rounded break-all">
                            {formatResponse(txConfirmation)}
                        </div>
                    )}
                    {error && (
                        <div className="text-red-700 bg-red-50 p-3 rounded flex items-start gap-2">
                            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="break-words">{formatErrorMessage(error)}</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}