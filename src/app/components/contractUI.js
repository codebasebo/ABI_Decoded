"use client";
import FunctionUI from "./FunctionUI";

function ContractUI({ abi, contract }) {
    // Helper function to generate unique keys
    const generateUniqueKey = (fn, index) => {
        // Combine name, type, and input types to create a unique signature
        const inputTypes = fn.inputs.map(input => input.type).join(',');
        const outputTypes = fn.outputs?.map(output => output.type).join(',') || '';
        return `${fn.name}_${fn.type}_${inputTypes}_${outputTypes}_${index}`;
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-4">
            <div className="flex items-center gap-2 mb-4">
                <div className="text-2xl">&#11015;</div>
                <h3 className="text-xl font-semibold text-gray-800">
                    Step 2: Interact with smart contract
                </h3>
            </div>
            <div className="space-y-4">
                {abi.map((fn, index) => (
                    <FunctionUI
                        key={generateUniqueKey(fn, index)}
                        fn={fn}
                        contract={contract}
                    />
                ))}
            </div>
        </div>
    );
}

export default ContractUI;