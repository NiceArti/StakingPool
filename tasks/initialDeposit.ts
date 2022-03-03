import { task, types } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import {deployedAddress, tokenForClaim} from "./task-settings";


task("initialDeposit", "set initial deposit of claimable tokens")
.addParam("amount", "The INT amount for deposit", 0, types.int)
.setAction(async (taskArgs, hre) => 
{
    const StakeContract = await hre.ethers.getContractAt("StakingPool", deployedAddress);
    const Token = await hre.ethers.getContractAt("ERC20", tokenForClaim);

    await Token.approve(deployedAddress, taskArgs.amount)
    console.log(`You successfully approved ${taskArgs.amount} of INT tokens`)

    await StakeContract.initialDeposit(taskArgs.amount)
    console.log(`You successfully deposit ${taskArgs.amount} of INT tokens`)
});