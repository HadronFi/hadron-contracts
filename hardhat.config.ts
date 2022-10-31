import 'dotenv/config'
import { HardhatUserConfig } from 'hardhat/types'
import 'hardhat-deploy'
import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-etherscan'
import 'hardhat-contract-sizer'
import './tasks'

const config: HardhatUserConfig = {
  defaultNetwork: 'hardhat',
  solidity: {
    compilers: [
      {
        version: "0.5.16",
        settings: {
          optimizer: {
            enabled: true,
            runs: 10000,
          },
        },
      },
      {
        version: "0.6.0",
        settings: {
          optimizer: {
            enabled: true,
            runs: 10000,
          },
        },
      },
      {
        version: "0.8.0",
        settings: {
          optimizer: {
            enabled: true,
            runs: 10000,
          },
        },
      },
    ]
  },
  namedAccounts: {
    deployer: {
      localhost: 1,
      evmos_testnet: '0x70b5d93d519C52a00839fEd5f87947D4Bc82ef6d',
      evmos_mainnet: '0x70b5d93d519C52a00839fEd5f87947D4Bc82ef6d',
    },
    poster: {
      localhost: 1,
      evmos_testnet: '0x70b5d93d519C52a00839fEd5f87947D4Bc82ef6d',
    },
    admin: {
      evmos_testnet: '0x70b5d93d519C52a00839fEd5f87947D4Bc82ef6d',
      localhost: 1,
    },
    guardian: {
      evmos_testnet: '0x70b5d93d519C52a00839fEd5f87947D4Bc82ef6d',
      localhost: 1,
      mainnet: '0x9d960dAe0639C95a0C822C9d7769d19d30A430Aa',
      avalanche: '0x93C220cf1Db6ea5Ab593180ccffA7C0C63A9767E',
      fuji: '0x197939c1ca20C2b506d6811d8B6CDB3394471074',
    },
    nativeUsdAggregator: {
      evmos_testnet: '0x0A77230d17318075983913bC2145DB16C7366156',
      hardhat: '0x5498BB86BC934c8D34FDA08E81D444153d0D06aD',
      avalanche: '0x0A77230d17318075983913bC2145DB16C7366156',
      fuji: '0x5498BB86BC934c8D34FDA08E81D444153d0D06aD',
    },
    wrappedNative: {
      evmos_testnet: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
      avalanche: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
      fuji: '0xd00ae08403B9bbb9124bB305C09058E32C39A48c',
    },
  },
  networks: {
    hardhat: {
      deploy: ['./deploy/hardhat'],
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${process.env.INFURA_TOKEN}`,
      accounts:
        process.env.DEPLOY_PRIVATE_KEY == undefined
          ? []
          : [`0x${process.env.DEPLOY_PRIVATE_KEY}`],
    },
    arbitrum: {
      url: 'https://arb1.arbitrum.io/rpc',
      accounts:
        process.env.DEPLOY_PRIVATE_KEY == undefined
          ? []
          : [`0x${process.env.DEPLOY_PRIVATE_KEY}`],
    },
    avalanche: {
      url: 'https://api.avax.network/ext/bc/C/rpc',
      chainId: 43114,
      accounts:
        process.env.DEPLOY_PRIVATE_KEY == undefined
          ? []
          : [`0x${process.env.DEPLOY_PRIVATE_KEY}`],
    },
    polygon: {
      url: 'https://polygon-rpc.com',
      accounts:
        process.env.DEPLOY_PRIVATE_KEY == undefined
          ? []
          : [`0x${process.env.DEPLOY_PRIVATE_KEY}`],
    },
    bsc: {
      url: 'https://bsc-dataseed.binance.org/',
      accounts:
        process.env.DEPLOY_PRIVATE_KEY == undefined
          ? []
          : [`0x${process.env.DEPLOY_PRIVATE_KEY}`],
    },
    fantom: {
      url: 'https://rpc.ftm.tools/',
      accounts:
        process.env.DEPLOY_PRIVATE_KEY == undefined
          ? []
          : [`0x${process.env.DEPLOY_PRIVATE_KEY}`],
    },
    evmos_testnet: {
      url: 'https://eth.bd.evmos.dev:8545',
      chainId: 9000,
      deploy: ['./deploy/evmos_testnet/'],
      accounts:
        process.env.DEPLOY_PRIVATE_KEY == undefined
          ? []
          : [`0x${process.env.DEPLOY_PRIVATE_KEY}`],
    },
    evmos_mainnet: {
      url: 'https://eth.bd.evmos.org:8545',
      chainId: 9001,
      deploy: ['./deploy/evmos_mainnet/'],
      accounts:
        process.env.DEPLOY_PRIVATE_KEY == undefined
          ? []
          : [`0x${process.env.DEPLOY_PRIVATE_KEY}`],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
}

export default config
