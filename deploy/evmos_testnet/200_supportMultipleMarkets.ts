import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { deployments, ethers, getNamedAccounts } from 'hardhat'
import { DeployFunction } from 'hardhat-deploy/types'
import { BigNumber } from 'ethers'
const { parseEther } = ethers.utils

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre
  const {
    deploy,
    execute,
    get,
    getArtifact,
    getOrNull,
    log,
    read,
  } = deployments

  const { deployer, admin } = await getNamedAccounts()

  // Markets = address of ctoken(aka htoken)
  // cfs = collateral factor, should be a mantissa(scaled by 1e18)
  // rfs = reserve factor, should be a mantissa(scaled by 1e18)
  // price = If WEVMOS, set the price with 6 decimals, otherwise use 18 decimals but denominate the price in WEVMOS
  const markets = [
    {
      markets: (await get('hATOM')).address,
      cfs: parseEther('0.63'),
      rfs: parseEther('0.2'),
      price: parseEther('8'),
    },
    {
      markets: (await get('haxlWBTC')).address,
      cfs: parseEther('0.63'),
      rfs: parseEther('0.2'),
      price: parseEther('11723'),
    },
    {
      markets: (await get('haxlWETH')).address,
      cfs: parseEther('0.63'),
      rfs: parseEther('0.2'),
      price: parseEther('856'),
    },
    {
      markets: (await get('hceWETH')).address,
      cfs: parseEther('0.63'),
      rfs: parseEther('0.2'),
      price: parseEther('856'),
    },
    {
      markets: (await get('hgDAI')).address,
      cfs: parseEther('0.7'),
      rfs: parseEther('0.2'),
      price: parseEther('.666'),
    },
    {
      markets: (await get('hgUSDC')).address,
      cfs: parseEther('0.7'),
      rfs: parseEther('0.2'),
      price: parseEther('.666'),
    },
    {
      markets: (await get('hgUSDT')).address,
      cfs: parseEther('0.7'),
      rfs: parseEther('0.2'),
      price: parseEther('.666'),
    },
    {
      markets: (await get('hgWETH')).address,
      cfs: parseEther('0.63'),
      rfs: parseEther('0.2'),
      price: parseEther('856'),
    },
    {
      markets: (await get('hJUNO')).address,
      cfs: parseEther('0.55'),
      rfs: parseEther('0.25'),
      price: parseEther('1'),
    },
    {
      markets: (await get('hOSMO')).address,
      cfs: parseEther('0.55'),
      rfs: parseEther('0.25'),
      price: parseEther('1'),
    },
    {
      markets: (await get('hWEVMOS')).address,
      cfs: parseEther('0.7'),
      rfs: parseEther('0.2'),
      price: BigNumber.from(10).pow(5).mul(15),
    },
  ]

  for (let i = 0; i < markets.length; i++) {
    await execute(
      'AdrastiaPriceOracle',
      { from: deployer, log: true },
      'setUnderlyingPrice',
      markets[i]['markets'],
      markets[i]['price'],
    )
    await execute(
      'CTokenAdmin',
      { from: deployer, log: true },
      '_setReserveFactor',
      markets[i]['markets'],
      markets[i]['rfs'],
    )
    await execute(
      'Comptroller',
      { from: deployer, log: true },
      '_supportMarket',
      markets[i]['markets'],
      1,
    )
    await execute(
      'Comptroller',
      { from: deployer, log: true },
      '_setCollateralFactor',
      markets[i]['markets'],
      markets[i]['cfs'],
    )
  }

  let underlyingMapping = []
  for (let i = 0; i < markets.length; i++) {
    underlyingMapping.push(markets[i]['markets'])
  }
  await execute(
    'FlashloanLender',
    { from: deployer },
    'updateUnderlyingMapping',
    underlyingMapping,
  )
}
export default func
func.tags = ['Market']
func.skip = async () => true
