import { ethers } from "hardhat";

async function main() 
{
  const tokenForClaim = '0x39B9883F970BFDCf8Ad9D13fE383959AF987d3c9';
  const tokenLP = '0x212FDaaEd9699ED0239c1857470Aa174711FB950';

  const StakingPool = await ethers.getContractFactory("StakingPool");
  const stakingPool = await StakingPool.deploy(tokenForClaim, tokenLP);

  await stakingPool.deployed();

  console.log("StakingPool deployed to:", stakingPool.address);
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
