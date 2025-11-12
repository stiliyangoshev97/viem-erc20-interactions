import { createWalletClient, http, formatEther, type PublicClient } from "viem";
import { sepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

interface GetAccountParams {
    client: PublicClient;
}

interface AccountInfo {
    address: `0x${string}`;
    balance: string;
    type: string;
    walletClient: any; // WalletClient with account attached
}

// Function to get account information from private key
async function getAccount({ client }: GetAccountParams): Promise<AccountInfo> {
    const privateKey = process.env.PRIVATE_KEY as `0x${string}`;

    // Ensure the private key is provided
    if (!privateKey) {
        throw new Error("Private key not found in environment variables. Make sure to set PRIVATE_KEY in your .env file.");
    }

    // Create an account from the private key
    const account = privateKeyToAccount(privateKey);
    
    // Create a wallet client for the account to interact with the blockchain
    const walletClient = createWalletClient({
        chain: sepolia,
        transport: http(),
        account: account,
    })

    // Fetch the account balance
    const accountBalance = await client.getBalance({
        address: account.address,
    })

    // Ensure the balance is fetched successfully
    if (!accountBalance) {
        throw new Error("Failed to fetch account balance");
    }

    // Return the account information
    return {
        address: account.address,
        balance: formatEther(accountBalance), // Format balance to Ether
        type: account.type,
        walletClient: walletClient,
    }
}

export { getAccount };
export type { AccountInfo };