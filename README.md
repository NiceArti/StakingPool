# Staking Pool contract

Staking Pool contract for UniswapV2LP and INT


Link to deployed contract: [link](https://kovan.etherscan.io/address/0x3b0A527bb10CB0B4F3026badd2bF64B7E6786d6f)


Contract address:
0x3b0A527bb10CB0B4F3026badd2bF64B7E6786d6f

Token address INT: 0x39B9883F970BFDCf8Ad9D13fE383959AF987d3c9

Token address USDT: 0x39B9883F970BFDCf8Ad9D13fE383959AF987d3c9


- OpenZeppelin library: [link](https://github.com/OpenZeppelin/openzeppelin-contracts)



## Try running some of the following tasks:

| Task | Description |
| --- | --- |
| `npx hardhat claimTokenSupply --network kovan` | shows total supply of claimable tokens in the contract|
| `npx hardhat depositUniswapV2LP --amount some_amount --network kovan` | stake LP tokens to get reward |
| `npx hardhat withdrawUniswapV2LP --amount some_amount --network kovan` | withdraw LP tokens in some amount |
| `npx hardhat withdrawAllUniswapV2LP --network kovan` | withdraw all LP tokens |
| `npx hardhat claimRewardToken --amount some_amount --network kovan` | claim reward from staking in some amount |
| `npx hardhat claimAllRewardToken --network kovan` | claim all reward from staking |
| `npx hardhat tokensForClaim --network kovan` | shows how much tokens user has been staked |

## Admin tasks

| Task | Description |
| --- | --- |
| `npx hardhat initialDeposit --amount some_amount --network kovan` | set initial deposit of claimable tokens |
| `npx hardhat withdrawAllTokens --network kovan` | withdraw all claimable tokens that remain in the contract |
<!-- 0x3Be9De2E8cF39BC661181E21406a7eE265f3C06d -->