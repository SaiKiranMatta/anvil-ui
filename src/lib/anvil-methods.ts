import { rpcClient } from './rpc-client';

export const methodCategories = {
  standard: {
    title: 'Standard Methods',
    methods: {
      getAccounts: {
        name: 'Get Accounts',
        method: () => rpcClient.sendRequest('eth_accounts'),
        description: 'Returns a list of addresses owned by client'
      },
      getBalance: {
        name: 'Get Balance',
        method: (address: string) => rpcClient.sendRequest('eth_getBalance', [address, 'latest']),
        params: [{ name: 'address', type: 'string', placeholder: '0x...' }],
        description: 'Returns the balance of the given address'
      },
      getBlockNumber: {
        name: 'Get Block Number',
        method: () => rpcClient.sendRequest('eth_blockNumber'),
        description: 'Returns the current block number'
      }
    }
  },
  anvil: {
    title: 'Anvil Methods',
    methods: {
      impersonateAccount: {
        name: 'Impersonate Account',
        method: (address: string) => rpcClient.sendRequest('anvil_impersonateAccount', [address]),
        params: [{ name: 'address', type: 'string', placeholder: '0x...' }],
        description: 'Impersonate an address for sending transactions'
      },
      setBalance: {
        name: 'Set Balance',
        method: (address: string, balance: string) => 
          rpcClient.sendRequest('anvil_setBalance', [address, balance]),
        params: [
          { name: 'address', type: 'string', placeholder: '0x...' },
          { name: 'balance', type: 'string', placeholder: 'Balance in wei (hex)' }
        ],
        description: 'Sets the balance of an address'
      },
      mine: {
        name: 'Mine Blocks',
        method: (blocks: string) => rpcClient.sendRequest('anvil_mine', [blocks]),
        params: [{ name: 'blocks', type: 'string', placeholder: 'Number of blocks' }],
        description: 'Mine a number of blocks'
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