import { toast } from "sonner";
import { rpcClient } from "./rpc-client";
import {
  ethToWeiHex,
  formatNumber,
  fromHex,
  toHex,
  weiHexToEth,
} from "./utils";

export const methodCategories = {
  standard: {
    title: "Standard Methods",
    methods: {
      getAccounts: {
        name: "Get Accounts",
        method: async () => {
          const accounts = await rpcClient.sendRequest("eth_accounts");
          toast.success("Successfully fetched accounts");
          return accounts;
        },
        description: "Returns a list of addresses owned by client",
      },
      getBalance: {
        name: "Get Balance",
        method: async (address: string) => {
          const balanceHex = await rpcClient.sendRequest("eth_getBalance", [
            address,
            "latest",
          ]);
          const balanceEth = weiHexToEth(balanceHex);
          toast.success("Successfully fetched balance");
          return {
            eth: parseFloat(balanceEth).toFixed(6),
            wei: fromHex(balanceHex),
            hex: balanceHex,
          };
        },
        params: [{ name: "address", type: "string", placeholder: "0x..." }],
        description: "Returns the balance of the given address in ETH",
      },
      getBlockNumber: {
        name: "Get Block Number",
        method: async () => {
          const blockHex = await rpcClient.sendRequest("eth_blockNumber");
          const blockNumber = fromHex(blockHex);
          toast.success("Successfully fetched block number");
          return {
            number: formatNumber(blockNumber),
            hex: blockHex,
          };
        },
        description: "Returns the current block number",
      },
      getCode: {
        name: "Get Code",
        method: async (address: string) => {
          const code = await rpcClient.sendRequest("eth_getCode", [
            address,
            "latest",
          ]);
          toast.success("Successfully fetched code");
          return { code };
        },
        params: [{ name: "address", type: "string", placeholder: "0x..." }],
        description: "Returns the deployed bytecode at an address",
      },
      getStorageAt: {
        name: "Get Storage At",
        method: async (address: string, slot: string) => {
          const value = await rpcClient.sendRequest("eth_getStorageAt", [
            address,
            slot,
            "latest",
          ]);
          toast.success("Successfully fetched storage value");
          return { slot, value };
        },
        params: [
          { name: "address", type: "string", placeholder: "0x..." },
          {
            name: "slot",
            type: "string",
            placeholder: "Storage slot (e.g., 0x0)",
          },
        ],
        description: "Returns the value from a storage slot at a given address",
      },
    },
  },
  anvil: {
    title: "Anvil Methods",
    methods: {
      setBalance: {
        name: "Set Balance",
        method: async (address: string, balanceEth: string) => {
          const balanceWeiHex = ethToWeiHex(balanceEth);
          await rpcClient.sendRequest("anvil_setBalance", [
            address,
            balanceWeiHex,
          ]);
          toast.success("Successfully set balance");
          return {
            address,
            setAmount: {
              eth: balanceEth,
              weiHex: balanceWeiHex,
            },
          };
        },
        params: [
          { name: "address", type: "string", placeholder: "0x..." },
          {
            name: "balance",
            type: "string",
            placeholder: "Amount in ETH (e.g., 1.5)",
          },
        ],
        description: "Sets the balance of an address (in ETH)",
      },
      mine: {
        name: "Mine Blocks",
        method: async (blocks: string) => {
          const blockCount = parseInt(blocks);
          const blockHex = toHex(blockCount);
          await rpcClient.sendRequest("anvil_mine", [blockHex]);
          toast.success(`Successfully mined ${blockCount} blocks`);
          return {
            minedBlocks: blockCount,
          };
        },
        params: [
          {
            name: "blocks",
            type: "string",
            placeholder: "Number of blocks (e.g., 5)",
          },
        ],
        description: "Mine a specific number of blocks",
      },
      impersonateAccount: {
        name: "Impersonate Account",
        method: async (address: string) => {
          await rpcClient.sendRequest("anvil_impersonateAccount", [address]);
          toast.success(`Successfully impersonating ${address}`);
          return {
            impersonatingAddress: address,
          };
        },
        params: [{ name: "address", type: "string", placeholder: "0x..." }],
        description: "Impersonate an address for sending transactions",
      },
      stopImpersonatingAccount: {
        name: "Stop Impersonating",
        method: async (address: string) => {
          await rpcClient.sendRequest("anvil_stopImpersonatingAccount", [
            address,
          ]);
          toast.success(`Stopped impersonating ${address}`);
          return {
            address,
          };
        },
        params: [{ name: "address", type: "string", placeholder: "0x..." }],
        description: "Stop impersonating an account",
      },
      setCode: {
        name: "Set Code",
        method: async (address: string, code: string) => {
          await rpcClient.sendRequest("anvil_setCode", [address, code]);
          toast.success("Successfully set code");
          return { address, code };
        },
        params: [
          { name: "address", type: "string", placeholder: "0x..." },
          { name: "code", type: "string", placeholder: "Contract bytecode" },
        ],
        description: "Sets the contract code at a given address",
      },
      setNonce: {
        name: "Set Nonce",
        method: async (address: string, nonce: string) => {
          const nonceHex = toHex(parseInt(nonce));
          await rpcClient.sendRequest("anvil_setNonce", [address, nonceHex]);
          toast.success("Successfully set nonce");
          return { address, nonce: parseInt(nonce) };
        },
        params: [
          { name: "address", type: "string", placeholder: "0x..." },
          { name: "nonce", type: "string", placeholder: "New nonce value" },
        ],
        description: "Sets the nonce of an address",
      },
      setStorageAt: {
        name: "Set Storage",
        method: async (address: string, slot: string, value: string) => {
          await rpcClient.sendRequest("anvil_setStorageAt", [
            address,
            slot,
            value,
          ]);
          toast.success("Successfully set storage");
          return { address, slot, value };
        },
        params: [
          { name: "address", type: "string", placeholder: "0x..." },
          {
            name: "slot",
            type: "string",
            placeholder: "Storage slot (e.g., 0x0)",
          },
          {
            name: "value",
            type: "string",
            placeholder: "New value (32 bytes)",
          },
        ],
        description: "Sets the storage value at a specific slot",
      },
    },
  },
  debug: {
    title: "Debug Methods",
    methods: {
      traceTransaction: {
        name: "Trace Transaction",
        method: (txHash: string) =>
          rpcClient.sendRequest("debug_traceTransaction", [txHash]),
        params: [{ name: "txHash", type: "string", placeholder: "0x..." }],
        description: "Traces a transaction execution",
      },
    },
  },
  evm: {
    title: "EVM Methods",
    methods: {
      snapshot: {
        name: "Take Snapshot",
        method: async () => {
          const snapshotId = await rpcClient.sendRequest("evm_snapshot");
          toast.success("Successfully created snapshot");
          return { snapshotId };
        },
        description: "Takes a snapshot of the current chain state",
      },
      revert: {
        name: "Revert to Snapshot",
        method: async (snapshotId: string) => {
          const success = await rpcClient.sendRequest("evm_revert", [
            snapshotId,
          ]);
          if (success) {
            toast.success("Successfully reverted to snapshot");
          } else {
            toast.error("Failed to revert to snapshot");
          }
          return { success };
        },
        params: [
          { name: "snapshotId", type: "string", placeholder: "Snapshot ID" },
        ],
        description: "Reverts the chain to a previous snapshot",
      },
      increaseTime: {
        name: "Increase Time",
        method: async (seconds: string) => {
          const increasedBy = await rpcClient.sendRequest("evm_increaseTime", [
            parseInt(seconds),
          ]);
          toast.success(`Increased time by ${seconds} seconds`);
          return { increasedBy };
        },
        params: [
          {
            name: "seconds",
            type: "string",
            placeholder: "Seconds to increase",
          },
        ],
        description:
          "Increases the next block timestamp by the specified number of seconds",
      },
      setNextBlockTimestamp: {
        name: "Set Next Block Timestamp",
        method: async (timestamp: string) => {
          await rpcClient.sendRequest("evm_setNextBlockTimestamp", [
            parseInt(timestamp),
          ]);
          toast.success("Set next block timestamp");
          return { timestamp: parseInt(timestamp) };
        },
        params: [
          { name: "timestamp", type: "string", placeholder: "Unix timestamp" },
        ],
        description: "Sets the timestamp for the next block",
      },
    },
  },
};
