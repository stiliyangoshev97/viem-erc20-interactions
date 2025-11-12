import { formatEther, type PublicClient } from "viem";
import { tokenAbi } from "./tokenAbi";

interface BurnTokensParams {
    walletClient: any; // WalletClient with account
    client: PublicClient;
    tokenAddress: `0x${string}`;
    fromAddress: `0x${string}`;
    toAddress: `0x${string}`;
}

interface BurnTokensResult {
    hash: `0x${string}`;
}

// Function to burn tokens (requires burner role)
// Note: This contract's burn function burns ALL tokens from 'from' address to 'to' address
const burnTokens = async ({ 
    walletClient, 
    client,
    tokenAddress, 
    fromAddress,
    toAddress 
}: BurnTokensParams): Promise<BurnTokensResult> => {
    
    console.log(`Burning tokens from ${fromAddress} to ${toAddress}...`);

    // Write to contract - burn function
    const hash = await walletClient.writeContract({
        address: tokenAddress,
        abi: tokenAbi,
        functionName: 'burn',
        args: [fromAddress, toAddress],
    });

    console.log(`Burn transaction sent: ${hash}`);
    console.log('Waiting for transaction confirmation...');

    // Wait for transaction receipt
    const receipt = await client.waitForTransactionReceipt({ hash });

    console.log(`Transaction confirmed in block: ${receipt.blockNumber}`);
    console.log(`Gas used: ${receipt.gasUsed.toString()}`);
    console.log(`Transaction fee: ${formatEther(BigInt(receipt.gasUsed) * BigInt(receipt.effectiveGasPrice))} ETH`);

    return { hash };
}

export { burnTokens };
export type { BurnTokensParams, BurnTokensResult };