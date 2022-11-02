import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'
import { ethers } from 'hardhat'
const { parseEther } = ethers.utils

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre
  const { deploy, execute, get, getOrNull, log } = deployments

  const { deployer, admin } = await getNamedAccounts()
  const Comptroller = await getOrNull('Comptroller')
  const speeds = [
    [
      (await get('hATOM')).address,
      (await get('haxlUSDC')).address,
      (await get('haxlWBTC')).address,
      (await get('haxlWETH')).address,
      (await get('hceUSDC')).address,
      (await get('hceWETH')).address,
      (await get('hgDAI')).address,
      (await get('hgUSDC')).address,
      (await get('hgUSDT')).address,
      (await get('hgWETH')).address,
      (await get('hJUNO')).address,
      (await get('hOSMO')).address,
      (await get('hWEVMOS')).address,
    ], // ctoken addresses
    [
      parseEther('0.01'),
      parseEther('0.01'),
      parseEther('0.01'),
      parseEther('0.01'),
      parseEther('0.01'),
      parseEther('0.01'),
      parseEther('0.01'),
      parseEther('0.01'),
      parseEther('0.01'),
      parseEther('0.01'),
      parseEther('0.01'),
      parseEther('0.01'),
      parseEther('0.01'),
    ], // supply speed(int) - comp per block
    [
      parseEther('0.01'),
      parseEther('0.01'),
      parseEther('0.01'),
      parseEther('0.01'),
      parseEther('0.01'),
      parseEther('0.01'),
      parseEther('0.01'),
      parseEther('0.01'),
      parseEther('0.01'),
      parseEther('0.01'),
      parseEther('0.01'),
      parseEther('0.01'),
      parseEther('0.01'),
    ], // borrow speed(int) - comp per block
  ]
  if (!Comptroller) {
    await execute(
      'Comptroller',
      { from: deployer, log: true },
      '_setCompSpeeds',
      speeds[0],
      speeds[1],
      speeds[2],
    )
  }
}
export default func
func.tags = ['Unitroller']
