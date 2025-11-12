import { formatUnits, type PublicClient } from "viem";
import { tokenAbi } from "./tokenAbi";

interface GetTokenBalanceParams {
    client: PublicClient;
    tokenAddress: `0x${string}`;
    accountAddress: `0x${string}`;
}

// Function to get token balance for a specific account address
const getTokenBalance = async({ client, tokenAddress, accountAddress }: GetTokenBalanceParams): Promise<string> => {
    // Read token decimals first
    const decimals = await client.readContract({
        address: tokenAddress,
        abi: tokenAbi,
        functionName: "decimals",
    }) as number;

    // Read token balance for the account address
    const balance = await client.readContract({
        address: tokenAddress,
        abi: tokenAbi,
        functionName: "balanceOf",
        args: [accountAddress],
    }) as bigint;

    // Return the formatted token balance
    return formatUnits(balance, decimals);

}

export { getTokenBalance };