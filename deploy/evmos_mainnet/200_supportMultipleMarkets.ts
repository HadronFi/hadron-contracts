import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { deployments, ethers, getNamedAccounts } from 'hardhat'
import { DeployFunction } from 'hardhat-deploy/types'
const { parseUnits, parseEther } = ethers.utils

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre
  const { deploy, execute, get, getArtifact, getOrNull, log } = deployments

  const { deployer, admin } = await getNamedAccounts()

  const markets = [
    
    (await get('crWEVMOS')).address,
    (await get('crUSDC')).address,
    (await get('crUSDT')).address,
  ]

  const cfs = [parseEther('0.75'), parseEther('0.75'), parseEther('0.75')]

  const rfs = [parseEther('0.20'), parseEther('0.20'), parseEther('0.20')]

  const prices = [parseEther('1.5'), parseEther('1'), parseEther('1')]

  for (let i = 0; i < markets.length; i++) {
    await execute(
      'AdrastiaPriceOracle',
      { from: deployer, log: true },
      'setUnderlyingPrice',
      markets[i],
      prices[i],
    )
    await execute(
      'CTokenAdmin',
      { from: deployer, log: true },
      '_setReserveFactor',
      markets[i],
      rfs[i],
    )
    await execute(
      'Comptroller',
      { from: deployer, log: true },
      '_supportMarket',
      markets[i],
      1,
    )
    await execute(
      'Comptroller',
      { from: deployer, log: true },
      '_setCollateralFactor',
      markets[i],
      cfs[i],
    )
  }

  await execute(
    'FlashloanLender',
    { from: deployer },
    'updateUnderlyingMapping',
    markets,
  )
}
export default func
func.tags = ['Market']
// func.skip = async (env) => true
