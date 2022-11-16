import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployments, getNamedAccounts} = hre;
  const {deploy, getOrNull, log} = deployments;

  const {deployer} = await getNamedAccounts();

  const CTokenAdmin = await getOrNull("CTokenAdmin");

  if(CTokenAdmin){
    log(`reusing CTokenAdmin at ${CTokenAdmin.address}`)
  } else{
    await deploy('CTokenAdmin', {
      from: deployer,
      args: [deployer],
      log: true,
    });
  }
};
export default func;
func.tags = ['CTokenAdmin'];
