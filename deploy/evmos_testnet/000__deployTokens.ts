import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre
  const { deploy, execute, getOrNull, log } = deployments

  const { deployer, admin } = await getNamedAccounts()

  const tokens = [
    ['100000000000000000000000', 'ATOM', 'ATOM', '18'],
    ['100000000000000', 'Axelar WBTC', 'axlWBTC', '8'],
    ['100000000000000000000000', 'Axelar WETH', 'axlWETH', '18'],
    ['100000000000000000000000', 'Celer WETH', 'ceWETH', '18'],    
    ['100000000000000000000000', 'Gravity DAI', 'gDAI', '18'],
    ['1000000000000', 'Gravity USDC', 'gUSDC', '6'],
    ['1000000000000', 'Gravity USDT', 'gUSDT', '6'],
    ['100000000000000000000000', 'Gravity WETH', 'gWETH', '18'],
    ['100000000000000000000000', 'Juno', 'JUNO', '18'],
    ['100000000000000000000000', 'Osmosis', 'OSMO', '18'],
    ['100000000000000000000000', 'Wrapped Evmos', 'WEVMOS', '18'],
  ]
  for (let i = 0; i < tokens.length; i++) {
    let [supply, name, symbol, decimals] = [
      tokens[i][0],
      tokens[i][1],
      tokens[i][2],
      tokens[i][3],
    ]
    const token = await getOrNull(symbol)
    if (token) {
      log(`reusing ` + symbol + ` at ${token.address}`)
    } else {
      await deploy(symbol, {
        from: deployer,
        log: true,
        contract: 'GenericERC20',
        args: [supply, name, symbol, decimals],
      })
    }
  }
}
export default func
func.tags = ['tokens']