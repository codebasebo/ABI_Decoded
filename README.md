# ABI Decoded - Smart Contract Interaction Tool

ABI Decoded is a modern web application that allows users to easily interact with smart contracts across multiple blockchain networks. Built with Next.js and Tailwind CSS, it provides a seamless interface for connecting wallets, switching networks, and executing smart contract functions.

## Features

- 🔌 Multi-network support (Ethereum, Polygon, BSC, etc.)
- 👛 MetaMask wallet integration
- 🔄 Network switching capability
- 📝 ABI parsing and validation
- 🎯 Dynamic function interface generation
- 🎨 Clean and responsive UI
- ⚡ Real-time transaction feedback
- 🔍 Error handling and validation

## Supported Networks

- Ethereum Mainnet
- Goerli Testnet
- Sepolia Testnet
- Polygon
- BSC (Binance Smart Chain)
- Arbitrum
- Optimism

## Prerequisites

- Node.js 16.x or later
- MetaMask browser extension
- npm or yarn package manager

## Installation

1. Clone the repository:

```bash
git https://github.com/codebasebo/ABI_Decoded.git

```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory and add your API keys:
```env
NEXT_PUBLIC_ETHERSCAN_API_KEY=your_etherscan_key
NEXT_PUBLIC_BSCSCAN_API_KEY=your_bscscan_key
NEXT_PUBLIC_POLYGONSCAN_API_KEY=your_polygonscan_key
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Connect your MetaMask wallet
2. Select desired network
3. Enter contract address or paste ABI
4. Interact with contract functions
5. View transaction results and responses

## Key Components

- `NetworkSelector`: Handles network switching and chain management
- `Connect`: Manages wallet connection and authentication
- `UploadContract`: Handles contract ABI parsing and validation
- `FunctionUI`: Generates dynamic interfaces for contract functions
- `ContractUI`: Manages contract interaction and response handling

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Smart contract interaction via [ethers.js](https://docs.ethers.org/)
- Wallet integration with [MetaMask](https://metamask.io/)

## Support

For support, please open an issue in the repository or contact the maintainers.

## Security

This is a tool for interacting with smart contracts. Always verify contract addresses and functions before executing transactions. Use at your own risk.
