import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { deployments, ethers, getNamedAccounts } from 'hardhat'
import { DeployFunction } from 'hardhat-deploy/types'
const { parseUnits } = ethers.utils

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre
  const { deploy, get, getArtifact, getOrNull, log } = deployments
  const { deployer } = await getNamedAccounts()

  enum IRM {
    Major = 'MajorIRM',
    Stable = 'StableIRM',
    Gov = 'GovIRM',
  }

  const crName = 'ATOM'
  const interestRateModel = IRM.Major
  
  const crSymbol = 'cr' + crName
  const underlyingAddress = (await get(crName)).address
  const exchangeRate = '0.02'

  const comptrollerAddress = (await get('Comptroller')).address
  const irmAddress = (await get(interestRateModel)).address
  const cTokenAdminAddress = (await get('CTokenAdmin')).address
  const cTokenImplementationAddress = (await get('CCollateralCapErc20Delegate'))
    .address

  const erc20ABI = (await getArtifact('EIP20Interface')).abi
  const underlying = await ethers.getContractAt(erc20ABI, underlyingAddress)
  const underlyingDecimal = await underlying.decimals()
  const initialExchangeRate = parseUnits(
    exchangeRate,
    18 + underlyingDecimal - 8,
  )

  const cToken = await getOrNull(crSymbol)
  if (cToken) {
    log(`reusing ${crSymbol} at ${cToken.address}`)
  } else {
    await deploy(crSymbol, {
      from: deployer,
      contract: 'CErc20Delegator',
      args: [
        underlyingAddress,
        comptrollerAddress,
        irmAddress,
        initialExchangeRate,
        crName,
        crSymbol,
        8,
        cTokenAdminAddress,
        cTokenImplementationAddress,
        '0x',
      ],
      log: true,
    })
  }
}
export default func
func.tags = ['Market']
