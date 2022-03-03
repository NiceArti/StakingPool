import { task, types } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import {deployedAddress, tokenForClaim, tokenLP} from "./task-settings";
import { parseUnits } from "ethers/lib/utils";


task("claimAllRewardToken", "stake LP tokens to get reward")
.setAction(async (taskArgs, hre) => 
{
    const StakeContract = await hre.ethers.getContractAt("StakingPool", deployedAddress);
    await StakeContract.claimAllRewardToken()
    console.log(`You successfully claimed all LP tokens`)
});