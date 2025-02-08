# Anvil Web UI

A modern web interface for interacting with Anvil, built with Vite, React, and shadcn/ui. This interface provides a user-friendly way to interact with Anvil's JSON-RPC methods, including standard Ethereum methods, Anvil-specific commands, and debugging features.

## Features

- 🌗 Light/Dark mode support
- 🔧 Easy interaction with Anvil's JSON-RPC methods
- 🚀 Built with modern tools: Vite, React, TypeScript
- 🎨 Styled with shadcn/ui components
- 🔌 Configurable RPC endpoint

## Available Methods

### Standard Methods
- Get Accounts: Retrieve all available accounts
- Get Balance: Check ETH balance of any address
- Get Block Number: Get current block number

### Anvil Methods
- Set Balance: Modify an address's ETH balance
- Mine Blocks: Mine a specified number of blocks
- Impersonate Account: Impersonate any address for transactions

### Debug Methods
- Trace Transaction: Get detailed execution trace of a transaction

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- An Anvil instance running locally (or another compatible Ethereum node)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/SaiKiranMatta/anvil-ui
cd anvil-ui
```

2. Install dependencies:
```bash
yarn
```

3. Configure the environment:
```bash
cp .env.example .env
```

Edit `.env` to set your RPC URL if different from the default:
```
VITE_RPC_URL=http://localhost:8545
```

4. Start the development server:
```bash
yarn dev
```

## Development

### Project Structure
```
src/
  ├── components/      # UI components
  ├── lib/            # Core functionality
  │   ├── anvil-methods.ts  # Method definitions
  │   ├── rpc-client.ts     # RPC communication
  │   └── utils.ts          # Helper functions
  └── App.tsx         # Main application component
```

### Adding New Methods

To add new Anvil methods, modify `lib/anvil-methods.ts`. Each method requires:

```typescript
methodName: {
  name: 'Display Name',
  method: async (params) => {
    // Implementation
  },
  params: [
    { name: 'paramName', type: 'string', placeholder: 'Parameter description' }
  ],
  description: 'Method description'
}
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.