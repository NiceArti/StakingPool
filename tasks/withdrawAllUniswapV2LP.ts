import { task, types } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import {deployedAddress, tokenForClaim, tokenLP} from "./task-settings";
import { parseUnits } from "ethers/lib/utils";


task("withdrawAllUniswapV2LP", "stake LP tokens to get reward")
.setAction(async (taskArgs, hre) => 
{
    const StakeContract = await hre.ethers.getContractAt("StakingPool", deployedAddress);
    await StakeContract.withdrawAllUniswapV2LP()
    console.log(`You successfully withdrawed all LP tokens`)
});