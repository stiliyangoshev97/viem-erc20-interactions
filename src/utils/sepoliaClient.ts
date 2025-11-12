import { createPublicClient, http } from "viem";
import { sepolia } from "viem/chains";

const sepoliaClient = createPublicClient({
    chain: sepolia,
    transport: http(),
})

export { sepoliaClient };