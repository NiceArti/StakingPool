import { task, types } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import {deployedAddress, tokenForClaim, tokenLP} from "./task-settings";
import { parseUnits } from "ethers/lib/utils";


task("claimRewardToken", "stake LP tokens to get reward")
.addParam("amount", "amount of LP tokens", 0, types.int)
.setAction(async (taskArgs, hre) => 
{
    const StakeContract = await hre.ethers.getContractAt("StakingPool", deployedAddress);

    await StakeContract.claimRewardToken(taskArgs.amount)
    console.log(`You successfully claimed ${taskArgs.amount} LP tokens`)
});