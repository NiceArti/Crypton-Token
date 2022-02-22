import { expect } from "chai";
import { ethers } from "hardhat";
import BigNumber from 'bignumber.js';



describe("ERC20", () => 
{
  const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
  const ONE_BILLION = 100000000
  const initialSupply = new BigNumber(ONE_BILLION * 10e18)
  let token;
  let instance: any;

  let owner: any, acc1: any, acc2: any, acc3: any;

  beforeEach(async () => 
  {
    const Token = await ethers.getContractFactory("ERC20");
    [owner, acc1, acc2, acc3] = await ethers.getSigners();


    instance = await Token.deploy("Intern Token", "INT");
  });



  describe("View functions:", async () =>
  {
    it("name(): Should return token name", async () => 
    {
      expect(await instance.name()).to.equal("Intern Token")
    })

    it("symbol(): Should return token symbol", async () => 
    {
      expect(await instance.symbol()).to.equal("INT")
    })

    it("decimals(): Should return the token decimals", async () => 
    {
      expect(await instance.decimals()).to.equal(18)
    })

    it("totalSupply(): Should return the tokens total supply include decimals", async () => 
    {
      const initialSupply = new BigNumber(ONE_BILLION * 10e18)
      expect(await instance.totalSupply()).to.equal(initialSupply.toFixed())
    })

    it("balanceOf(): should return balance of accounts", async () => 
    {
      const ownerBalance = await instance.balanceOf(owner.address)
      const simpleAccBalance = await instance.balanceOf(acc1.address)
      
      expect(ownerBalance).to.equal(initialSupply.toFixed())
      expect(simpleAccBalance).to.equal(0)

      console.log(`\tOwner's balance is ${ownerBalance / 1e18}`)
      console.log(`\tNot owner's balance is ${simpleAccBalance}`)
    })
  })


  const transferValue = new BigNumber('100e18')
  describe("Main token's functionality:", async () =>
  {
    it("transfer(): Should transfer tokens from owner to spender", async () => 
    {

      let ownerBalance = await instance.balanceOf(owner.address)
      let simpleAccBalance = await instance.balanceOf(acc1.address)
      
      console.log(`\tOwner's balance before ${ownerBalance / 1e18}`)
      console.log(`\tNot owner's balance before ${simpleAccBalance / 1e18}`)

      await instance.transfer(acc1.address, transferValue.toFixed(), {from: owner.address})

      ownerBalance = await instance.balanceOf(owner.address)
      simpleAccBalance = await instance.balanceOf(acc1.address)

      console.log(`\n\tOwner's balance after ${ownerBalance / 1e18}`)
      console.log(`\tNot owner's balance after ${simpleAccBalance / 1e18}`)

      expect(ownerBalance).to.equal(initialSupply.minus(transferValue).toFixed())
      expect(simpleAccBalance).to.equal(transferValue.toFixed())
    })


    it("transfer(): should break when send too big amount", async () => 
    {
      await expect(instance.connect(acc1).transfer(acc2.address, transferValue.toFixed()))
        .to.be.revertedWith('ERC20: transfer amount exceeds balance')
    })


    it("transferFrom(): owner should allow spender to transfer his tokens", async () => 
    {

      let ownerBalance = await instance.balanceOf(owner.address)
      let simpleAccBalance = await instance.balanceOf(acc1.address)

      await instance.approve(acc1.address, transferValue.toFixed());
      let allowance = await instance.allowance(owner.address, acc1.address)
      await instance.connect(acc1).transferFrom(owner.address, acc1.address, transferValue.toFixed())

      allowance = await instance.allowance(owner.address, acc1.address)

      ownerBalance = await instance.balanceOf(owner.address)
      simpleAccBalance = await instance.balanceOf(acc1.address)
      
      expect(ownerBalance).to.equal(initialSupply.minus(transferValue).toFixed())
      expect(simpleAccBalance).to.equal(transferValue.toFixed())
      expect(allowance).to.equal(0)
    })


    it("transferFrom(): should fall if allowance less than amount", async () => 
    {
      await instance.approve(acc1.address, transferValue.toFixed());
      await expect(instance.connect(acc1).transferFrom(owner.address, acc1.address, transferValue.plus(1e18).toFixed()))
        .to.be.revertedWith('ERC20: insufficient allowance')
    })

    
  })


  describe("Additional token's functionality:", async () =>
  {
    it("increaseAllowance(): should increase allowance", async () => 
    {
      await instance.approve(acc1.address, transferValue.toFixed());
      
      let allowance = await instance.allowance(owner.address, acc1.address)
      console.log(`\tAllowance before: ${allowance / 1e18}`)
      
      await instance.increaseAllowance(acc1.address, transferValue.toFixed());
      
      allowance = await instance.allowance(owner.address, acc1.address)
      console.log(`\tAllowance after: ${allowance / 1e18}`)
      
      await expect(instance.connect(acc1)
      .transferFrom(owner.address, acc1.address, 
        transferValue.plus(transferValue.toFixed()).toFixed()))
    })

    it("decreaseAllowance(): should decrease allowance", async () => 
    {
      await instance.approve(acc1.address, transferValue.toFixed());
      
      let allowance = await instance.allowance(owner.address, acc1.address)
      console.log(`\tAllowance before: ${allowance / 1e18}`)
      
      await instance.decreaseAllowance(acc1.address, transferValue.dividedBy(2).toFixed());
      
      allowance = await instance.allowance(owner.address, acc1.address)
      console.log(`\tAllowance after: ${allowance / 1e18}`)
      

      await expect(instance.connect(acc1)
      .transferFrom(owner.address, acc1.address, transferValue.minus(transferValue.dividedBy(2).toFixed()).toFixed()))
     
      // await expect(instance.connect(acc1)
      // .transferFrom(owner.address, acc1.address, 
      //   transferValue.plus(transferValue.dividedBy(2).toFixed()).toFixed()))
    })

    it("mint(): must increase total supply and account's amount", async () =>
    {
      await instance.mint(acc1.address, transferValue.toFixed())
      let acc1Balance = await instance.balanceOf(acc1.address)
      let totalSupply = await instance.totalSupply()

      await expect(acc1Balance).to.equal(transferValue.toFixed())
      await expect(totalSupply).to.equal(initialSupply.plus(transferValue.toFixed()).toFixed())
    })

    it("burn(): must decrease total supply and account's amount", async () =>
    {
      await instance.burn(owner.address, transferValue.toFixed())
      let ownerBalance = await instance.balanceOf(owner.address)
      let totalSupply = await instance.totalSupply()

      await expect(ownerBalance).to.equal(initialSupply.minus(transferValue.toFixed()).toFixed())
      await expect(totalSupply).to.equal(initialSupply.minus(transferValue.toFixed()).toFixed())
    })

    it("mint(): only contract owner can call this function", async () =>
    {
      await expect(instance.connect(acc1).mint(acc1.address, transferValue.toFixed()))
        .to.be.revertedWith('ERC20: account is not an owner')
    })

    it("burn(): only contract owner can call this function", async () =>
    {
      await expect(instance.connect(acc1).burn(acc1.address, transferValue.toFixed()))
        .to.be.revertedWith('ERC20: account is not an owner')
    })

    it("burn(): must fail if burn amount is higher than balance", async () =>
    {
      await expect(instance.burn(acc1.address, transferValue.toFixed()))
        .to.be.revertedWith('ERC20: burn amount exceeds balance')
    })

  })


  describe("Check on zero address:", async () =>
  {
    it("Should fail if make transaction to zero address", async () =>
    {

      await expect(instance.transfer(ZERO_ADDRESS, transferValue.toFixed()))
        .to.be.revertedWith('ERC20: transfer to the zero address')

      
      await expect(instance.approve(ZERO_ADDRESS, transferValue.toFixed()))
        .to.be.revertedWith('ERC20: approve to the zero address')


      await expect(instance.mint(ZERO_ADDRESS, transferValue.toFixed()))
        .to.be.revertedWith('ERC20: mint to the zero address')


      await expect(instance.burn(ZERO_ADDRESS, transferValue.toFixed()))
        .to.be.revertedWith('ERC20: burn from the zero address')


      await expect(instance.increaseAllowance(ZERO_ADDRESS, transferValue.toFixed()))
        .to.be.revertedWith('ERC20: approve to the zero address')
    })
  })


})
