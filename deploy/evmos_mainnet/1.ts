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
  console.log('set oracle addr')
  // await execute(
  //   'AdrastiaPriceOracle',
  //   { from: deployer },
  //   'setOracleAddress',
  //   oracleAddr,
  // )
  const tokens = [
    '0x5fd55a1b9fc24967c4db09c513c3ba0dfa7ff687', //gUSDC
    '0xFA3C22C069B9556A4B2f7EcE1Ee3B467909f4864', //Osmo
    '0x3452e23F9c4cC62c70B7ADAd699B264AF3549C19', //Juno
    '0xc5e00d3b04563950941f7137b5afa3a534f0d6d6', //Atom
  ]
  console.log('get oracle price')

  for (let i = 0; i < tokens.length; i++) {
    console.log(await execute(
      'AdrastiaPriceOracle',
      { from: deployer },
      'getPrice',
      tokens[i],
    ))
  }
}
export default func
func.tags = ['PriceOracleV1']
