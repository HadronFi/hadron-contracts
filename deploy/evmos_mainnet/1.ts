import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre
  const { deploy, execute, get, getOrNull, log, save } = deployments
  const { deployer, poster, admin } = await getNamedAccounts()

  const AdrastiaPriceOracle = await getOrNull('AdrastiaPriceOracle')
  if (AdrastiaPriceOracle) {
    log(`reusing AdrastiaPriceOracle at ${AdrastiaPriceOracle.address}`)
  } else {
    await deploy('AdrastiaPriceOracle', {
      from: deployer,
      log: true,
    })
  }

  const oracleAddr = '0x51d3d22965Bb2CB2749f896B82756eBaD7812b6d'
  await execute(
    'AdrastiaPriceOracle',
    { from: deployer },
    'setOracleAddress',
    oracleAddr,
  )
  const tokens = ['0x5FD55A1B9FC24967C4dB09C513C3BA0DFa7FF687']

  for (let i = 0; i < tokens.length; i++) {
    const tx = await execute(
      'AdrastiaPriceOracle',
      { from: deployer },
      'getPrice',
      tokens[i],
    )
    console.log(tx)
  }
}
export default func
func.tags = ['PriceOracleV1']
