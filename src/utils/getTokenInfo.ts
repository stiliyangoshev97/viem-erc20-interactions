import { formatUnits, type PublicClient } from "viem";
import { tokenAbi } from "./tokenAbi";

interface GetTokenInfoParams {
    client: PublicClient;
    tokenAddress: `0x${string}`;
}

interface TokenInfo {
    name: string;
    symbol: string;
    decimals: number;
    totalSupply: string;
}

// Function to get token information from a given token address (name, symbol, decimals, totalSupply)
const getTokenInfo = async({ client, tokenAddress }: GetTokenInfoParams): Promise<TokenInfo> => {
    // Fetch the token name
    const name = await client.readContract({
        address: tokenAddress,
        abi: tokenAbi,
        functionName: "name",
    }) as string;

    // Fetch the token symbol
    const symbol = await client.readContract({
        address: tokenAddress,
        abi: tokenAbi,
        functionName: "symbol",
    }) as string;

    // Fetch the token decimals
    const decimals = await client.readContract({
        address: tokenAddress,
        abi: tokenAbi,
        functionName: "decimals",
    }) as number;

    // Fetch the token total supply
    const totalSupply = await client.readContract({
        address: tokenAddress,
        abi: tokenAbi,
        functionName: "totalSupply",
    }) as bigint;

    // Return the token information
    return {
        name,
        symbol,
        decimals,
        totalSupply: formatUnits(totalSupply, decimals), // Format totalSupply based on decimals
    }
}

export { getTokenInfo };
export type { TokenInfo };