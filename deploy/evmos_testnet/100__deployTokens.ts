import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre
  const { deploy, execute, getOrNull, log } = deployments

  const { deployer, admin } = await getNamedAccounts()
  const Unitroller = await getOrNull('Unitroller')
  const tokens = [
    ['1000000', 'ATOM', 'ATOM', '18'],
    ['1000000', 'Axelar USDC', 'axlUSDC', '6'],
    ['1000000', 'Axelar WBTC', 'axlWBTC', '18'],
    ['1000000', 'Axelar WETH', 'axlWETH', '18'],
    ['1000000', 'Celer USDC', 'ceUSDC', '6'],
    ['1000000', 'Celer WETH', 'ceWETH', '18'],
    ['1000000', 'Gravity DAI', 'gDAI', '18'],
    ['1000000', 'Gravity USDC', 'gUSDC', '6'],
    ['1000000', 'Gravity USDT', 'gUSDT', '6'],
    ['1000000', 'Gravity WETH', 'gWETH', '18'],
    ['1000000', 'Juno', 'JUNO', '18'],
    ['1000000', 'Osmosis', 'OSMO', '18'],
    ['10000000', 'Wrapped Evmos', 'WEVMOS', '18'],
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
func.tags = ['Unitroller']
