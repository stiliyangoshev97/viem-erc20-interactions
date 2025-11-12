import { parseUnits, formatEther, type PublicClient } from "viem";
import { tokenAbi } from "./tokenAbi";

interface TransferTokenParams {
    client: PublicClient;
    walletClient: any; // WalletClient with account for signing the transaction
    tokenAddress: `0x${string}`;
    fromAddress: `0x${string}`;
    toAddress: `0x${string}`;
    amount: string; // Amount in human-readable format
}

interface TransferTokenResult {
    txHash: `0x${string}`;
}

// Function to transfer a specific amount of tokens from one address to another
const transferToken = async({ client, walletClient, tokenAddress, fromAddress, toAddress, amount}: TransferTokenParams): Promise<TransferTokenResult> => {
    // Read token decimals first
    const decimals = await client.readContract({
        address: tokenAddress,
        abi: tokenAbi,
        functionName: "decimals",
    }) as number;

    // Parse the human-readable amount to the token's smallest unit
    const parsedAmount = parseUnits(amount, decimals);

    console.log(`Transferring ${amount} tokens from ${fromAddress} to ${toAddress}`);

    // Write to contract - transfer the tokens
    const txHash = await walletClient.writeContract({
        address: tokenAddress,
        abi: tokenAbi,
        functionName: "transferFrom",
        args: [fromAddress, toAddress, parsedAmount],
    })

    console.log(`Transfer transaction sent: ${txHash}`);
    console.log('Waiting for transaction confirmation...');

    // Wait for transaction receipt
    const receipt = await client.waitForTransactionReceipt({
        hash: txHash,
    })

    console.log(`Transaction confirmed in block: ${receipt.blockNumber}`);
    console.log(`Gas used: ${receipt.gasUsed.toString()}`);
    console.log(`Transaction fee: ${formatEther(BigInt(receipt.gasUsed) * BigInt(receipt.effectiveGasPrice))} ETH`);

    // Return the tx hash
    return {
        txHash: txHash,
    }

    
}

export { transferToken };