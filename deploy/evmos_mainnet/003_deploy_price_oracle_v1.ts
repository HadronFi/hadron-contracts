import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployments, getNamedAccounts} = hre;
  const {deploy, get, getOrNull,log, save} = deployments;
  const {deployer, poster, admin} = await getNamedAccounts();

  const SimplePriceOracle = await getOrNull("SimplePriceOracle");
  if(SimplePriceOracle){
    log(`reusing SimplePriceOracle at ${SimplePriceOracle.address}`);
  } else{
    await deploy('SimplePriceOracle', {
      from: deployer,
      log: true,
    });
  }
};
export default func;
func.tags = ['PriceOracleV1'];
