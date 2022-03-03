import { task, types } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import {deployedAddress, tokenForClaim} from "./task-settings";


task("withdrawAllTokens", "set initial deposit of claimable tokens")
.addParam("amount", "The INT amount for deposit", 0, types.int)
.setAction(async (taskArgs, hre) => 
{
    const StakeContract = await hre.ethers.getContractAt("StakingPool", deployedAddress);

    await StakeContract.withdrawAllTokens()
    console.log(`You successfully withdrawed all INT tokens`)
});