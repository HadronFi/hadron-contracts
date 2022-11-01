import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployments, getNamedAccounts} = hre;
  const {deploy, getOrNull, log} = deployments;
  const parseEther = hre.ethers.utils.parseEther;

  const {deployer, admin} = await getNamedAccounts();

  let baseRate = 0;
  let multiplier = parseEther('0.15');
  let jump = parseEther('5');
  let kink1 = parseEther('0.8');
  let kink2 = parseEther('0.9');
  let roof = parseEther('1.5');

  const MajorIRM = await getOrNull("MajorIRM");
  if(MajorIRM){
    log(`reusing MajorIRM at ${MajorIRM.address}`);
  } else{
    await deploy('MajorIRM', {
      from: deployer,
      contract: 'TripleSlopeRateModel',
      args: [
        baseRate,
        multiplier.mul(kink1).div(parseEther('1')),
        jump,
        kink1,
        kink2,
        roof,
        admin
      ],
      log: true
    });
  }

  const StableIRM = await getOrNull("StableIRM");
  if(StableIRM){
    log(`reusing StableIRM at ${StableIRM.address}`)
  } else{
    multiplier = parseEther('0.23');
    jump = parseEther('8');
  
    await deploy('StableIRM', {
      from: deployer,
      contract: 'TripleSlopeRateModel',
      args: [
        baseRate,
        multiplier.mul(kink1).div(parseEther('1')),
        jump,
        kink1,
        kink2,
        roof,
        admin
      ],
      log: true
    });
  }


  const GovIRM = await getOrNull("GovIRM");
  if(GovIRM){
    log(`reusing GovIRM at ${GovIRM.address}`);
  } else{
    multiplier = parseEther('0.2');
    jump = parseEther('5');
    kink1 = parseEther('0.7');
    kink2 = parseEther('0.8');
  
    await deploy('GovIRM', {
      from: deployer,
      contract: 'TripleSlopeRateModel',
      args: [
        baseRate,
        multiplier.mul(kink1).div(parseEther('1')),
        jump,
        kink1,
        kink2,
        roof,
        admin
      ],
      log: true
    });
  }
};
export default func;
func.tags = ['InterestRateModel'];
