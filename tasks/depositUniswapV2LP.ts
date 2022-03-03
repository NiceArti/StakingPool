import { task, types } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import {deployedAddress, tokenForClaim, tokenLP} from "./task-settings";
import { parseUnits } from "ethers/lib/utils";


task("depositUniswapV2LP", "stake LP tokens to get reward")
.addParam("amount", "amount of LP tokens", 0, types.int)
.setAction(async (taskArgs, hre) => 
{
    const StakeContract = await hre.ethers.getContractAt("StakingPool", deployedAddress);
    const Token = await hre.ethers.getContractAt("ERC20", tokenLP);

    let deposit = parseUnits(`${taskArgs.amount}`)

    await Token.approve(deployedAddress, deposit)
    console.log(`You successfully approved ${taskArgs.amount} of INT tokens`)

    await StakeContract.depositUniswapV2LP(deposit)
    console.log(`You successfully deposited LP tokens`)
});