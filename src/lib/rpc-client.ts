export class RPCClient {
    constructor(private url: string) {}
  
    async sendRequest(method: string, params: any[] = []) {
      try {
        const response = await fetch(this.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: Date.now(),
            method,
            params,
          }),
        });
  
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error.message);
        }
        return data.result;
      } catch (error) {
        throw new Error(`RPC Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  }
  
  export const rpcClient = new RPCClient(import.meta.env.VITE_RPC_URL || 'http://localhost:8545');
  