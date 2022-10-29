import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployments, getNamedAccounts} = hre;
  const {deploy, getOrNull, log} = deployments;

  const {deployer} = await getNamedAccounts();

  const CWrappedNativeDelegate = await getOrNull("CWrappedNativeDelegate");
  if(CWrappedNativeDelegate){
    log(`reusing CWrappedNativeDelegate at ${CWrappedNativeDelegate.address}`);
  } else{
    await deploy('CWrappedNativeDelegate', {
      from: deployer,
      log: true
    });
  }

  const CCollateralCapErc20Delegate = await getOrNull("CCollateralCapErc20Delegate");
  if(CCollateralCapErc20Delegate){
    log(`reusing CCollateralCapErc20Delegate at ${CCollateralCapErc20Delegate.address}`);
  } else{
    await deploy('CCollateralCapErc20Delegate', {
      from: deployer,
      log: true
    });
  }

};
export default func;
func.tags = ['CTokenImplementation'];
func.runAtTheEnd = true;
