import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployments, getNamedAccounts} = hre;
  const {deploy, get, getOrNull, log} = deployments;

  const {deployer, admin} = await getNamedAccounts();

  const unitrollerAddress = (await get('Unitroller')).address

  const FlashloanLender = await getOrNull("FlashloanLender");
  if(FlashloanLender){
    log(`reusing FlashloanLender at ${FlashloanLender.address}`)
  } else{
    await deploy('FlashloanLender', {
      from: deployer,
      args: [unitrollerAddress, admin],
      log: true,
    });
  }
};
export default func;
func.tags = ['FlashloanLender'];
