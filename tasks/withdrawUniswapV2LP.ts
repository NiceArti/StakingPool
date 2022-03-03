import { task, types } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import {deployedAddress, tokenForClaim, tokenLP} from "./task-settings";
import { parseUnits } from "ethers/lib/utils";


task("withdrawUniswapV2LP", "stake LP tokens to get reward")
.addParam("amount", "amount of LP tokens", 0, types.int)
.setAction(async (taskArgs, hre) => 
{
    const StakeContract = await hre.ethers.getContractAt("StakingPool", deployedAddress);
    let deposit = parseUnits(`${taskArgs.amount}`)

    await StakeContract.depositUniswapV2LP(deposit)
    console.log(`You successfully withdrawed ${taskArgs.amount} LP tokens`)
});