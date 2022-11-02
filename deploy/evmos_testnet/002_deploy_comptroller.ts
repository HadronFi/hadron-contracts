import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre
  const { deploy, get, getOrNull, log, save } = deployments

  const { deployer } = await getNamedAccounts()
  const Comptroller = await getOrNull('Comptroller')
  if (Comptroller) {
    log(`reusing Comptroller at ${Comptroller.address}`)
  } else {
    const comptrollerImpl = await deploy('Comptroller_Implementation', {
      from: deployer,
      contract: 'Comptroller',
      log: true,
    })

    // update Comptroller ABI
    await save('Comptroller', {
      abi: comptrollerImpl.abi,
      address: (await get('Unitroller')).address,
    })
  }
}
export default func
func.tags = ['Comptroller']