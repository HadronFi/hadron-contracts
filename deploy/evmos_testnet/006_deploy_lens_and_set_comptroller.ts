import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
import {parseEther} from 'ethers/lib/utils';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployments, getNamedAccounts} = hre;
  const {deploy, execute,get, getOrNull, log} = deployments;

  const {deployer} = await getNamedAccounts();

  const CompoundLens = await getOrNull("CompoundLens");
  if(CompoundLens){
    log(`reusing CompoundLens at ${CompoundLens.address}`);
  } else{
    await deploy('CompoundLens', {
      from: deployer,
      log: true,
    });

    const unitrollerAddress = (await get('Unitroller')).address;
    const comptrollerImplAddress = (await get('Comptroller_Implementation')).address;
    await execute('Unitroller', { from: deployer }, '_setPendingImplementation', comptrollerImplAddress);
    await execute('Comptroller_Implementation', { from: deployer }, '_become', unitrollerAddress);
  
    const closeFactor = parseEther('0.5');
    const liquidationIncentive = parseEther('1.08');
  
    await execute('Comptroller', { from: deployer }, '_setCloseFactor', closeFactor);
    await execute('Comptroller', { from: deployer }, '_setLiquidationIncentive', liquidationIncentive);
    await execute('Comptroller', { from: deployer }, '_setPriceOracle', (await get('SimplePriceOracle')).address);
    // await execute('Comptroller', { from: deployer }, '_setPauseGuardian', guardian);
    // await execute('Comptroller', { from: deployer }, '_setBorrowCapGuardian', guardian);
  };

};
export default func;
func.tags = ['CompoundLens'];
func.tags = ['SetupComptroller'];
func.dependencies = ['Comptroller', 'PriceOracleProxyUSD'];
