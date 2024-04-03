
const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*"
    },
    polygon_mumbai_testnet: {
      provider: () => {
        return new HDWalletProvider({
          mnemonic: {
            phrase: 'dolphin inherit smoke right match select kidney eager isolate garbage gentle camera'
          },
          providerOrUrl: 'https://rpc-mumbai.maticvigil.com',
          from: 'bd8a770a4f384c63a46aee4972714c56'
        });
      },
      network_id: 80001, // Mumbai Testnet network id
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
      gas: 5000000,
      gasPrice: 10000000000,
      timeoutBlocks: 2000,
    },
  },

  // Set default mocha options here, use special reporters, etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.0"
    }
  }
}