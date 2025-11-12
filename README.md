# Viem ERC-20 Token Interactions

A TypeScript project demonstrating how to interact with ERC-20 tokens on Ethereum using [Viem](https://viem.sh/) - a modern TypeScript interface for Ethereum.

## Features

This project demonstrates the following ERC-20 token interactions:

- 📊 **Token Information**: Get token name, symbol, decimals, and total supply
- 💰 **Balance Checking**: Check token balances for any address
- 🔍 **Allowance Checking**: Check spending allowances between addresses
- ✅ **Token Approval**: Approve spending allowances for other addresses
- 📤 **Token Transfer**: Transfer tokens between addresses
- 🏭 **Token Minting**: Mint new tokens (if you have minting permissions)
- 🔥 **Token Burning**: Burn tokens from your balance

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- An Ethereum wallet with a private key
- Some Sepolia ETH for transaction fees
- Access to an ERC-20 token contract on Sepolia testnet

## Installation

1. Clone this repository:
```bash
git clone <your-repo-url>
cd viem-erc20-interactions
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example src/.env
```

4. Edit the `src/.env` file and add your private key:
```bash
PRIVATE_KEY=0xyour_private_key_here
```

⚠️ **Security Warning**: Never commit your actual private key to version control. The `.env` file is already in `.gitignore` to prevent accidental commits.

## Configuration

Before running the project, you need to update the token contract address in `src/main.ts`:

```typescript
// Replace this with your actual ERC-20 token contract address
const TOKEN_ADDRESS: `0x${string}` = '0xYourTokenContractAddressHere';
```

## Usage

Run the interactive demo:

```bash
npm start
```

This will start an interactive menu where you can:

1. View account information and ETH balance
2. Get token information (name, symbol, decimals, supply)
3. Check your token balance
4. Check allowances
5. Approve token spending
6. Transfer tokens
7. Mint tokens (if you have permission)
8. Burn tokens

## Project Structure

```
src/
├── main.ts                 # Main application with interactive menu
└── utils/
    ├── approveToken.ts     # Approve token spending
    ├── burnTokens.ts       # Burn tokens
    ├── getAccount.ts       # Get account information
    ├── getAllowance.ts     # Check spending allowances
    ├── getTokenBalance.ts  # Get token balance
    ├── getTokenInfo.ts     # Get token information
    ├── mintTokens.ts       # Mint new tokens
    ├── sepoliaClient.ts    # Viem client configuration
    ├── tokenAbi.ts         # ERC-20 token ABI
    └── transferToken.ts    # Transfer tokens
```

## Key Functions

### getTokenInfo()
Retrieves basic information about an ERC-20 token including name, symbol, decimals, and total supply.

### getTokenBalance()
Checks the token balance of a specific address.

### approveToken()
Approves another address to spend a specific amount of your tokens.

### transferToken()
Transfers tokens from your account to another address.

### mintTokens()
Mints new tokens (requires minting permissions on the contract).

### burnTokens()
Burns tokens from your balance, reducing the total supply.

## Network Configuration

This project is configured to work with the Sepolia testnet. The network configuration is in `src/utils/sepoliaClient.ts`.

To use a different network:

1. Update the RPC URL in `sepoliaClient.ts`
2. Make sure your private key corresponds to an account with funds on that network
3. Update the token contract address to match the network

## Getting Test Tokens

To get Sepolia ETH for testing:
- Use the [Sepolia Faucet](https://sepoliafaucet.com/)
- Or any other Sepolia testnet faucet

For ERC-20 test tokens, you can:
- Deploy your own ERC-20 contract
- Use existing test tokens on Sepolia
- Mint tokens if the contract allows public minting

## Error Handling

The project includes comprehensive error handling for common scenarios:
- Insufficient token balance
- Insufficient ETH for gas fees
- Invalid addresses
- Contract interaction failures
- Network connectivity issues

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Security Best Practices

- Never commit private keys to version control
- Use test networks for development
- Validate all inputs before making transactions
- Double-check recipient addresses before transfers
- Start with small amounts when testing

## Resources

- [Viem Documentation](https://viem.sh/)
- [Ethereum ERC-20 Standard](https://eips.ethereum.org/EIPS/eip-20)
- [Sepolia Testnet Info](https://sepolia.dev/)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Disclaimer

This project is for educational purposes only. Always exercise caution when dealing with real funds and smart contracts. The authors are not responsible for any loss of funds or other damages.
