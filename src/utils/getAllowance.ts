import { formatUnits, type PublicClient } from "viem";
import { tokenAbi } from "./tokenAbi";

interface GetAllowanceParams {
    client: PublicClient;
    tokenAddress: `0x${string}`;
    ownerAddress: `0x${string}`;
    spenderAddress: `0x${string}`;
}

// Function to get allowance for a specific owner and spender address
const getAllowance = async({ client, tokenAddress, ownerAddress, spenderAddress }: GetAllowanceParams): Promise<string> => {
    // Read token decimals first
    const decimals = await client.readContract({
        address: tokenAddress,
        abi: tokenAbi,
        functionName: "decimals",
    }) as number;

    // Read allowance for the owner and the spender address
    const allowance = await client.readContract({
        address: tokenAddress,
        abi: tokenAbi,
        functionName: "allowance",
        args: [ownerAddress, spenderAddress],
    }) as bigint;

    // Return the formatted allowance
    return formatUnits(allowance, decimals);
}

export { getAllowance };