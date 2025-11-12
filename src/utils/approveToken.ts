import { parseUnits, formatEther, type PublicClient } from "viem";
import { tokenAbi } from "./tokenAbi";

interface ApproveTokenParams {
    walletClient: any; // WalletClient with account
    client: PublicClient;
    tokenAddress: `0x${string}`;
    spenderAddress: `0x${string}`;
    amount: string;
}

interface ApproveTokenResult {
    hash: `0x${string}`;
}

// Function to approve a spender to spend tokens on behalf of the owner
const approveToken = async ({ 
    walletClient, 
    client,
    tokenAddress, 
    spenderAddress, 
    amount 
}: ApproveTokenParams): Promise<ApproveTokenResult> => {
    
    // Get token decimals
    const decimals = await client.readContract({
        address: tokenAddress,
        abi: tokenAbi,
        functionName: 'decimals',
    }) as number;

    // Parse amount to token units
    const parsedAmount = parseUnits(amount, decimals);

    console.log(`Approving ${spenderAddress} to spend ${amount} tokens...`);

    // Write to contract - approve function
    const hash = await walletClient.writeContract({
        address: tokenAddress,
        abi: tokenAbi,
        functionName: 'approve',
        args: [spenderAddress, parsedAmount],
    });

    console.log(`Approval transaction sent: ${hash}`);
    console.log('Waiting for transaction confirmation...');

    // Wait for transaction receipt
    const receipt = await client.waitForTransactionReceipt({ hash });

    console.log(`Transaction confirmed in block: ${receipt.blockNumber}`);
    console.log(`Gas used: ${receipt.gasUsed.toString()}`);
    console.log(`Transaction fee: ${formatEther(BigInt(receipt.gasUsed) * BigInt(receipt.effectiveGasPrice))} ETH`);

    return { hash };
}

export { approveToken };
export type { ApproveTokenParams, ApproveTokenResult };