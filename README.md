# Cream Finance Deployment Script
### Quickstart: deploy to Evmos testnet
```
yarn install
cp .env.default .env
Fill out .env with the private key you copy from metamask
npx hardhat deploy --network evmos_testnet
```

### Quickstart: deploy to localhost
```
yarn install
cp .env.default .env
Fill out .env with the private key you copy from metamask
npx hardhat node --no-deploy
npx hardhat deploy --network localhost
```

### Evmos Mainnet Deployment
axl = axelar, ce = celer, g = gravity
USDC - has oracle, cf = .8, rf = .2
WEVMOS - has oracle, cf = .75, rf = .2
OSMO - has oracle, cf = .6, rf = .25
JUNO - has oracle, cf = .6, rf = .25
ATOM - has oracle, cf = .73, rf = .2

Near future, as soon as we have oracle support
WETH - axl, ce, g
USDT - axl, ce, g 
DAI - axl, ce, g
axlWBTC? - why wbtc

Far Future
EEUR - emoney euro
REGEN - regen network
STARS - stargaze
GRAV - gravity bridge token


## Installation

    git clone https://github.com/CreamFi/cream-deployment
    cd cream-deployment
    yarn install

## Setup

### .env
Copy `.env` from `.env.default`

    cp .env.default .env

abd fill in all the variables in `.env`

### hardhat.config.ts
Modify `namedAccounts` in `hardhat.config.ts` and add networks if necessary.

## Deployment
### Deploy Comptroller, PriceOracle, InterestRateModel, etc.

    npx hardhat deploy --network <NETWORK>

#### Options

`--tags <tags>`: only excute deploy scripts with the given tags (separated by commas) and their dependencies

See more options [here](https://github.com/wighawag/hardhat-deploy#1-hardhat-deploy) for `hardhat deploy`.

### Deploy crTokens
Edit constructor arguments in `/scripts/deploy_new_markets.ts` before executing the comment below.

    npx hardhat run scripts/deploy_new_markets.ts --network <NETWORK>

### Support Market
Fill up the crToken address, price feed source, reserve factors, etc. before execution

    npx hardhat run scripts/support_multiple_markets.ts --network <NETWORK>


## Verification

    npx hardhat --network <NETWORK> sourcify

Note: CWrappedNativeDelegator and CErc20Delegator need to verify manually by uploading the flatten source code `CWrappedNativeDelegatorFlatten.sol` and `CErc20DelegatorFlatten.sol`
