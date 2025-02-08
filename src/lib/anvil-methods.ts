import { toast } from 'sonner';
import { rpcClient } from './rpc-client';
import { ethToWeiHex, formatNumber, fromHex, toHex, weiHexToEth } from './utils';

export const methodCategories = {
  standard: {
    title: 'Standard Methods',
    methods: {
      getAccounts: {
        name: 'Get Accounts',
        method: async () => {
          const accounts = await rpcClient.sendRequest('eth_accounts');
          toast.success('Successfully fetched accounts');
          return accounts;
        },
        description: 'Returns a list of addresses owned by client'
      },
      getBalance: {
        name: 'Get Balance',
        method: async (address: string) => {
          const balanceHex = await rpcClient.sendRequest('eth_getBalance', [address, 'latest']);
          const balanceEth = weiHexToEth(balanceHex);
          toast.success('Successfully fetched balance');
          return {
            eth: parseFloat(balanceEth).toFixed(6),
            wei: fromHex(balanceHex),
            hex: balanceHex
          };
        },
        params: [{ name: 'address', type: 'string', placeholder: '0x...' }],
        description: 'Returns the balance of the given address in ETH'
      },
      getBlockNumber: {
        name: 'Get Block Number',
        method: async () => {
          const blockHex = await rpcClient.sendRequest('eth_blockNumber');
          const blockNumber = fromHex(blockHex);
          toast.success('Successfully fetched block number');
          return {
            number: formatNumber(blockNumber),
            hex: blockHex
          };
        },
        description: 'Returns the current block number'
      }
    }
  },
  anvil: {
    title: 'Anvil Methods',
    methods: {
      setBalance: {
        name: 'Set Balance',
        method: async (address: string, balanceEth: string) => {
          const balanceWeiHex = ethToWeiHex(balanceEth);
          await rpcClient.sendRequest('anvil_setBalance', [address, balanceWeiHex]);
          toast.success('Successfully set balance');
          return {
            address,
            setAmount: {
              eth: balanceEth,
              weiHex: balanceWeiHex
            }
          };
        },
        params: [
          { name: 'address', type: 'string', placeholder: '0x...' },
          { name: 'balance', type: 'string', placeholder: 'Amount in ETH (e.g., 1.5)' }
        ],
        description: 'Sets the balance of an address (in ETH)'
      },
      mine: {
        name: 'Mine Blocks',
        method: async (blocks: string) => {
          const blockCount = parseInt(blocks);
          const blockHex = toHex(blockCount);
          await rpcClient.sendRequest('anvil_mine', [blockHex]);
          toast.success(`Successfully mined ${blockCount} blocks`);
          return {
            minedBlocks: blockCount
          };
        },
        params: [
          { name: 'blocks', type: 'string', placeholder: 'Number of blocks (e.g., 5)' }
        ],
        description: 'Mine a specific number of blocks'
      },
      impersonateAccount: {
        name: 'Impersonate Account',
        method: async (address: string) => {
          await rpcClient.sendRequest('anvil_impersonateAccount', [address]);
          toast.success(`Successfully impersonating ${address}`);
          return {
            impersonatingAddress: address
          };
        },
        params: [{ name: 'address', type: 'string', placeholder: '0x...' }],
        description: 'Impersonate an address for sending transactions'
      }
    }
  },
  debug: {
    title: 'Debug Methods',
    methods: {
      traceTransaction: {
        name: 'Trace Transaction',
        method: (txHash: string) => rpcClient.sendRequest('debug_traceTransaction', [txHash]),
        params: [{ name: 'txHash', type: 'string', placeholder: '0x...' }],
        description: 'Traces a transaction execution'
      }
    }
  }
};