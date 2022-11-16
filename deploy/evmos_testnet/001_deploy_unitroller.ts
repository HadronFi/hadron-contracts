import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployments, getNamedAccounts} = hre;
  const {deploy, execute, getOrNull, log} = deployments;

  const {deployer, admin} = await getNamedAccounts();
  const Unitroller = await getOrNull("Unitroller");
  if(Unitroller){
    log(`reusing Unitroller at ${Unitroller.address}`);
  } else{
    await deploy('Unitroller', {
      from: deployer,
      log: true,
    });
  
    await execute('Unitroller', { from: deployer }, '_setPendingAdmin', admin);
  }
};
export default func;
func.tags = ['Unitroller'];