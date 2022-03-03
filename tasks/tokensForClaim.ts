import { task, types } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import {deployedAddress} from "./task-settings";


task("tokensForClaim", "shows total supply of claimable tokens in the contract")
.setAction(async (taskArgs, hre) => 
{
  const StakeContract = await hre.ethers.getContractAt("StakingPool", deployedAddress);

  let available = await StakeContract.tokensForClaim()
  console.log(`There are ${available} INT in the contract`)
});