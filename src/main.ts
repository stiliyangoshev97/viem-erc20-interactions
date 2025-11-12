import 'dotenv/config';
import { sepoliaClient } from './utils/sepoliaClient';
import { getAccount, type AccountInfo } from './utils/getAccount';
import { getTokenInfo, type TokenInfo } from './utils/getTokenInfo';
import { getTokenBalance } from './utils/getTokenBalance';
import { getAllowance } from './utils/getAllowance';
import { approveToken } from './utils/approveToken';
import { transferToken } from './utils/transferToken';
import { mintTokens } from './utils/mintTokens';
import { burnTokens } from './utils/burnTokens';
import readline from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import type { Interface } from 'node:readline/promises';

// Token contract address on Sepolia (example - replace with your actual token address)
const TOKEN_ADDRESS: `0x${string}` = '0xYourTokenContractAddressHere';

const main = async () => {
    console.log('=== Week 6: Writing to Smart Contracts ===\n');

    const rl = readline.createInterface({ input: stdin, output: stdout });

    try {
        // 1. Get account information
        console.log('--- Step 1: Getting Account Information ---');
        const accountInfo = await getAccount({ client: sepoliaClient });
        console.log(`Account Address: ${accountInfo.address}`);
        console.log(`Account Type: ${accountInfo.type}`);
        console.log(`ETH Balance: ${accountInfo.balance} ETH\n`);

        // 2. Get token information
        console.log('--- Step 2: Getting Token Information ---');
        const tokenInfo = await getTokenInfo({ 
            client: sepoliaClient, 
            tokenAddress: TOKEN_ADDRESS 
        });
        console.log(`Token Name: ${tokenInfo.name}`);
        console.log(`Token Symbol: ${tokenInfo.symbol}`);
        console.log(`Token Decimals: ${tokenInfo.decimals}`);
        console.log(`Total Supply: ${tokenInfo.totalSupply} ${tokenInfo.symbol}\n`);

        // 3. Get token balance
        console.log('--- Step 3: Checking Token Balance ---');
        const tokenBalance = await getTokenBalance({
            client: sepoliaClient,
            tokenAddress: TOKEN_ADDRESS,
            accountAddress: accountInfo.address,
        });
        console.log(`Your ${tokenInfo.symbol} Balance: ${tokenBalance}\n`);

        // Menu system for different operations
        let exit = false;
        while (!exit) {
            console.log('\n=== Choose an operation: ===');
            console.log('1. Approve spender for tokens');
            console.log('2. Transfer tokens to another wallet');
            console.log('3. Check allowance');
            console.log('4. Mint tokens (requires minter role)');
            console.log('5. Burn tokens (requires burner role)');
            console.log('6. Check token balance');
            console.log('7. Exit');

            const choice = await rl.question('\nEnter your choice (1-7): ');

            switch (choice.trim()) {
                case '1':
                    // Approve tokens
                    await handleApprove(rl, accountInfo, tokenInfo);
                    break;

                case '2':
                    // Transfer tokens
                    await handleTransfer(rl, accountInfo, tokenInfo);
                    break;

                case '3':
                    // Check allowance
                    await handleCheckAllowance(rl, accountInfo, tokenInfo);
                    break;

                case '4':
                    // Mint tokens
                    await handleMint(rl, accountInfo, tokenInfo);
                    break;

                case '5':
                    // Burn tokens
                    await handleBurn(rl, accountInfo, tokenInfo);
                    break;

                case '6':
                    // Check balance
                    await handleCheckBalance(accountInfo, tokenInfo);
                    break;

                case '7':
                    exit = true;
                    console.log('\nExiting... Goodbye!');
                    break;

                default:
                    console.log('Invalid choice. Please try again.');
            }
        }

        rl.close();

    } catch (error) {
        console.error('\n❌ Error:', error);
        rl.close();
    }
}

// Handler function for approving tokens
async function handleApprove(rl: Interface, accountInfo: AccountInfo, tokenInfo: TokenInfo) {
    console.log('\n--- Approve Spender ---');
    
    let spenderAddress: string;
    do {
        spenderAddress = (await rl.question('Enter spender address (0x...): ')).trim();
    } while (!/^0x[a-fA-F0-9]{40}$/.test(spenderAddress));

    let amount: string;
    do {
        amount = (await rl.question(`Enter amount to approve (e.g., 100): `)).trim();
    } while (!/^\d+(\.\d+)?$/.test(amount));

    try {
        await approveToken({
            walletClient: accountInfo.walletClient,
            client: sepoliaClient,
            tokenAddress: TOKEN_ADDRESS,
            spenderAddress: spenderAddress as `0x${string}`,
            amount: amount,
        });

        console.log(`✅ Successfully approved ${amount} ${tokenInfo.symbol} for ${spenderAddress}`);
    } catch (error) {
        console.error('❌ Approval failed:', error);
    }
}

// Handler function for transferring tokens
async function handleTransfer(rl: Interface, accountInfo: AccountInfo, tokenInfo: TokenInfo) {
    console.log('\n--- Transfer Tokens ---');
    
    let recipientAddress: string;
    do {
        recipientAddress = (await rl.question('Enter recipient address (0x...): ')).trim();
    } while (!/^0x[a-fA-F0-9]{40}$/.test(recipientAddress));

    let amount: string;
    do {
        amount = (await rl.question(`Enter amount to transfer (e.g., 10): `)).trim();
    } while (!/^\d+(\.\d+)?$/.test(amount));

    try {
        await transferToken({
            walletClient: accountInfo.walletClient,
            client: sepoliaClient,
            tokenAddress: TOKEN_ADDRESS,
            fromAddress: accountInfo.address as `0x${string}`,
            toAddress: recipientAddress as `0x${string}`,
            amount: amount,
        });

        console.log(`✅ Successfully transferred ${amount} ${tokenInfo.symbol} to ${recipientAddress}`);
    } catch (error) {
        console.error('❌ Transfer failed:', error);
    }
}

// Handler function for checking allowance
async function handleCheckAllowance(rl: Interface, accountInfo: AccountInfo, tokenInfo: TokenInfo) {
    console.log('\n--- Check Allowance ---');
    
    let ownerAddress: string;
    do {
        ownerAddress = (await rl.question('Enter owner address (0x...) or press Enter to use your address: ')).trim();
        if (ownerAddress === '') {
            ownerAddress = accountInfo.address;
            break;
        }
    } while (!/^0x[a-fA-F0-9]{40}$/.test(ownerAddress));

    let spenderAddress: string;
    do {
        spenderAddress = (await rl.question('Enter spender address (0x...): ')).trim();
    } while (!/^0x[a-fA-F0-9]{40}$/.test(spenderAddress));

    try {
        const allowance = await getAllowance({
            client: sepoliaClient,
            tokenAddress: TOKEN_ADDRESS,
            ownerAddress: ownerAddress as `0x${string}`,
            spenderAddress: spenderAddress as `0x${string}`,
        });

        console.log(`\n📊 Allowance: ${allowance} ${tokenInfo.symbol}`);
        console.log(`Owner: ${ownerAddress}`);
        console.log(`Spender: ${spenderAddress}`);
    } catch (error) {
        console.error('❌ Failed to check allowance:', error);
    }
}

// Handler function for minting tokens
async function handleMint(rl: Interface, accountInfo: AccountInfo, tokenInfo: TokenInfo) {
    console.log('\n--- Mint Tokens ---');
    console.log('⚠️  Note: This requires your address to have the MINTER role');
    
    let recipientAddress: string;
    do {
        recipientAddress = (await rl.question('Enter recipient address (0x...) or press Enter to mint to yourself: ')).trim();
        if (recipientAddress === '') {
            recipientAddress = accountInfo.address;
            break;
        }
    } while (!/^0x[a-fA-F0-9]{40}$/.test(recipientAddress));

    let amount: string;
    do {
        amount = (await rl.question(`Enter amount to mint (e.g., 1000): `)).trim();
    } while (!/^\d+(\.\d+)?$/.test(amount));

    try {
        await mintTokens({
            walletClient: accountInfo.walletClient,
            client: sepoliaClient,
            tokenAddress: TOKEN_ADDRESS,
            toAddress: recipientAddress as `0x${string}`,
            amount: amount,
        });

        console.log(`✅ Successfully minted ${amount} ${tokenInfo.symbol} to ${recipientAddress}`);
    } catch (error) {
        console.error('❌ Minting failed:', error);
    }
}

// Handler function for burning tokens
async function handleBurn(rl: Interface, accountInfo: AccountInfo, tokenInfo: TokenInfo) {
    console.log('\n--- Burn Tokens ---');
    console.log('⚠️  Note: This requires your address to have the BURNER role');
    console.log('⚠️  This contract burns ALL tokens from the "from" address');
    
    let fromAddress: string;
    do {
        fromAddress = (await rl.question('Enter from address (0x...): ')).trim();
    } while (!/^0x[a-fA-F0-9]{40}$/.test(fromAddress));

    let toAddress: string;
    do {
        toAddress = (await rl.question('Enter to address (0x...): ')).trim();
    } while (!/^0x[a-fA-F0-9]{40}$/.test(toAddress));

    const confirm = await rl.question('Are you sure you want to burn tokens? (yes/no): ');
    if (confirm.toLowerCase() !== 'yes') {
        console.log('Burn operation cancelled.');
        return;
    }

    try {
        await burnTokens({
            walletClient: accountInfo.walletClient,
            client: sepoliaClient,
            tokenAddress: TOKEN_ADDRESS,
            fromAddress: fromAddress as `0x${string}`,
            toAddress: toAddress as `0x${string}`,
        });

        console.log(`✅ Successfully burned tokens from ${fromAddress} to ${toAddress}`);
    } catch (error) {
        console.error('❌ Burning failed:', error);
    }
}

// Handler function for checking balance
async function handleCheckBalance(accountInfo: AccountInfo, tokenInfo: TokenInfo) {
    console.log('\n--- Checking Token Balance ---');
    
    try {
        const balance = await getTokenBalance({
            client: sepoliaClient,
            tokenAddress: TOKEN_ADDRESS,
            accountAddress: accountInfo.address,
        });

        console.log(`\n💰 Your ${tokenInfo.symbol} Balance: ${balance}`);
    } catch (error) {
        console.error('❌ Failed to check balance:', error);
    }
}

main().catch(console.error);