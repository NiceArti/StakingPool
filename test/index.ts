import { expect } from "chai";
import { BigNumber } from "bignumber.js";
import { ethers } from "hardhat";
import { equal } from "assert";
import { time } from "console";

describe("StakingPool", () =>
{
  const DEFAULT_ADMIN_ROLE: String = '0x0000000000000000000000000000000000000000000000000000000000000000'
  const ZERO_ADDRESS: String = '0x0000000000000000000000000000000000000000'
  let owner: any, acc1: any, acc2: any, acc3: any;
  let instance: any;
  let tokenForClaim: any;
  let tokenLP: any;


  beforeEach(async () => 
  {
    const TokenForClaim = await ethers.getContractFactory("Token");
    const TokenLP = await ethers.getContractFactory("Token");
    const StakingPool = await ethers.getContractFactory("StakingPool");

    // create accounts
    [owner, acc1, acc2, acc3] = await ethers.getSigners();

    // create tokens
    tokenForClaim = await TokenForClaim.deploy("Intern Token", "INT");
    tokenLP = await TokenLP.deploy("UniswapV2", "LP");

    // wait untill tokens will be created
    await tokenForClaim.deployed();
    await tokenLP.deployed();

    instance = await StakingPool.deploy(tokenForClaim.address, tokenLP.address);
    
    // wait untill staking pool will be deployed
    await instance.deployed();
  });


  describe("Initial Deposit:", async () =>
  {
    it("initialDeposit(): should be called only by owner just once", async () => 
    {
      await tokenForClaim.approve(instance.address, 1000000);

      // show status of initial deposit
      console.log(`\tOwner deposited before: ${await instance._locked.call()}`)
      await instance.initialDeposit(1000000)

      expect(await tokenForClaim.balanceOf(instance.address)).to.equal(1000000)
      
      console.log(`\tOwner deposited after: ${await instance._locked.call()}`)

      await expect(instance.initialDeposit(1000000))
        .to.be.revertedWith('StakingPool: Owner already deposited their funds')
    })

    it("initialDeposit(): should fail if this function is called with not admin role", async () => 
    {
      await tokenForClaim.connect(acc1).approve(instance.address, 1000000);
      
      await expect(instance.connect(acc1).initialDeposit(1000000))
        .to.be.revertedWith(`AccessControl: account 0x70997970c51812dc3a010c7d01b50e0d17dc79c8 is missing role ${DEFAULT_ADMIN_ROLE}`)
    })
  })

  const ONE_MONTH = 2592000
  const TWO_MONTHS = ONE_MONTH * 2
  let timestamp: any = Date.now() / 1000; // time in secconds
  timestamp = parseInt(timestamp)

  describe("Main functionality check:", async () =>
  {
    beforeEach(async () => 
    {
      let balance = new BigNumber('10000e18')
      await tokenForClaim.approve(instance.address, balance.toFixed());
      await instance.initialDeposit(balance.toFixed())
    })

    it("claimTokenSupply(): should show supply of the contract", async () => 
    {
      let balance = new BigNumber('10000e18').toFixed()
      expect(await instance.claimTokenSupply()).to.equal(balance)
    })

    it("depositUniswapV2LP(): should deposit some value of LP tokens", async () => 
    {
      let deposit: BigNumber = new BigNumber('10e18')

      await tokenLP.approve(instance.address, deposit.toFixed())
      await instance.depositUniswapV2LP(deposit.toFixed())

      // get parameter amount from mapping (value => struct)
      let deposited = (await instance.userInfo(owner.address)).amount;
      
      expect(deposit.toFixed()).to.equal(deposited)
    })

    it("tokensForClaim(): should return tokens that user staked", async () => 
    {
      let deposit: BigNumber = new BigNumber('10e18')
      
      await tokenLP.approve(instance.address, deposit.toFixed())
      await instance.depositUniswapV2LP(deposit.toFixed())
      await ethers.provider.send('evm_mine', [timestamp += TWO_MONTHS]); // check by two month and 8 blocks

      let time = (await instance.userInfo(owner.address)).timestamp;
      await instance.updateReward()

      let canClaim = false;
      if (await instance.tokensForClaim() > 0)
        canClaim = true;

      expect(canClaim).to.equal(true)
    })

    it("claimRewardToken(): should fail if claim more than user have", async () => 
    {
      await expect(instance.connect(acc1).claimRewardToken(1000000))
        .to.be.revertedWith(`Staking: insufficient amount`)
    })

    it("claimRewardToken(): should give tokens to user", async () => 
    {
      let deposit: BigNumber = new BigNumber('10e18')

      await tokenLP.approve(instance.address, deposit.toFixed())
      await instance.depositUniswapV2LP(deposit.toFixed())
      await ethers.provider.send('evm_mine', [timestamp += TWO_MONTHS]); // check by one month and 8 blocks
      await instance.updateReward()

      let balBefore = await tokenForClaim.balanceOf(owner.address);
      await instance.claimRewardToken(100)
      let balAfter = await tokenForClaim.balanceOf(owner.address);

      expect(balBefore.add(100)).to.equal(balAfter)
    })

    it("claimRewardToken(): should fail if ask too many", async () => 
    {
      await expect(instance.claimRewardToken(100)).to.be.revertedWith("Staking: insufficient amount")
    })

    it("claimAllRewardToken(): should give all tokens to user", async () => 
    {
      let deposit: BigNumber = new BigNumber('10000e18')

      await tokenLP.approve(instance.address, deposit.toFixed())
      await instance.depositUniswapV2LP(deposit.toFixed())

      await ethers.provider.send('evm_mine', [timestamp += TWO_MONTHS]); // check by two months and 8 blocks
      await instance.updateReward()

      let balBefore = await tokenForClaim.balanceOf(owner.address);
      let toClaim = await instance.tokensForClaim()

      await instance.claimAllRewardToken()
      let balAfter = await tokenForClaim.balanceOf(owner.address);

      expect(balBefore.add(toClaim)).to.equal(balAfter)
    })

    it("withdrawUniswapV2LP(): should give lp tokens to user", async () => 
    {
      let deposit: BigNumber = new BigNumber('10000e18')

      await tokenLP.approve(instance.address, deposit.toFixed())
      await instance.depositUniswapV2LP(deposit.toFixed())
      let balBefore = await tokenLP.balanceOf(owner.address);
      await instance.withdrawUniswapV2LP(100)
      let balAfter = await tokenLP.balanceOf(owner.address);

      expect(balBefore.add(100)).to.equal(balAfter)
    })

    it("withdrawUniswapV2LP(): should give lp tokens to user", async () => 
    {
      await expect(instance.withdrawUniswapV2LP(100)).to.be.revertedWith("Staking: insufficient amount")
    })

    it("withdrawAllUniswapV2LP(): should give all lp tokens to user", async () => 
    {
      let deposit: BigNumber = new BigNumber('10000e18')

      await tokenLP.approve(instance.address, deposit.toFixed())
      await instance.depositUniswapV2LP(deposit.toFixed())
      let balBefore = await tokenLP.balanceOf(owner.address);

      let toClaim = (await instance.userInfo(owner.address)).amount

      await instance.withdrawAllUniswapV2LP()
      let balAfter = await tokenLP.balanceOf(owner.address);

      expect(balBefore.add(toClaim)).to.equal(balAfter)
    })

    it("withdrawAllTokens(): should give all claim tokens to admin", async () => 
    {

      let balBefore = await tokenForClaim.balanceOf(owner.address);
      let balance = await tokenForClaim.balanceOf(instance.address)
      await instance.withdrawAllTokens()
      let balAfter = await tokenForClaim.balanceOf(owner.address);

      expect(balBefore.add(balance)).to.equal(balAfter)
    })
  })


})
