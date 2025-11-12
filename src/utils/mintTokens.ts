import { parseUnits, formatEther, type PublicClient } from "viem";
import { tokenAbi } from "./tokenAbi";

interface MintTokensParams {
    walletClient: any; // WalletClient with account
    client: PublicClient;
    tokenAddress: `0x${string}`;
    toAddress: `0x${string}`;
    amount: string;
}

interface MintTokensResult {
    hash: `0x${string}`;
}

// Function to mint new tokens (requires minter role)
const mintTokens = async ({ 
    walletClient, // Added walletClient for signing the transaction
    client,
    tokenAddress, 
    toAddress, 
    amount 
}: MintTokensParams): Promise<MintTokensResult> => {
    
    // Get token decimals
    const decimals = await client.readContract({
        address: tokenAddress,
        abi: tokenAbi,
        functionName: 'decimals',
    }) as number;

    // Parse amount to token units
    const parsedAmount = parseUnits(amount, decimals);

    console.log(`Minting ${amount} tokens to ${toAddress}...`);

    // Write to contract - mintTokens function
    const hash = await walletClient.writeContract({
        address: tokenAddress,
        abi: tokenAbi,
        functionName: 'mintTokens',
        args: [toAddress, parsedAmount],
    });

    console.log(`Mint transaction sent: ${hash}`);
    console.log('Waiting for transaction confirmation...');

    // Wait for transaction receipt
    const receipt = await client.waitForTransactionReceipt({ hash });

    console.log(`Transaction confirmed in block: ${receipt.blockNumber}`);
    console.log(`Gas used: ${receipt.gasUsed.toString()}`);
    console.log(`Transaction fee: ${formatEther(BigInt(receipt.gasUsed) * BigInt(receipt.effectiveGasPrice))} ETH`);

    return { hash };
}

export { mintTokens };
export type { MintTokensParams, MintTokensResult };