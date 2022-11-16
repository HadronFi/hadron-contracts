import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployments, getNamedAccounts} = hre;
  const {deploy, get, getOrNull,log, save} = deployments;
  const {deployer, poster, admin} = await getNamedAccounts();

  const AdrastiaPriceOracle = await getOrNull("AdrastiaPriceOracle");
  if(AdrastiaPriceOracle){
    log(`reusing AdrastiaPriceOracle at ${AdrastiaPriceOracle.address}`);
  } else{
    await deploy('AdrastiaPriceOracle', {
      from: deployer,
      log: true,
    });
  }
};
export default func;
func.tags = ['PriceOracleV1'];
