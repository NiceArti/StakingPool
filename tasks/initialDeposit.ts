import { task, types } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import {deployedAddress, tokenForClaim} from "./task-settings";
import { parseUnits } from "ethers/lib/utils";


task("initialDeposit", "set initial deposit of claimable tokens")
.addParam("amount", "The INT amount for deposit", 0, types.int)
.setAction(async (taskArgs, hre) => 
{
    const StakeContract = await hre.ethers.getContractAt("StakingPool", deployedAddress);
    const Token = await hre.ethers.getContractAt("ERC20", tokenForClaim);

    let deposit = parseUnits(`${taskArgs.amount}`)
    await Token.approve(deployedAddress, deposit)
    console.log(`You successfully approved ${taskArgs.amount} of INT tokens`)

    await StakeContract.initialDeposit(deposit)
    console.log(`You successfully deposit ${taskArgs.amount} of INT tokens`)
});