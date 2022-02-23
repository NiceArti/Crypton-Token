import { task, types } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import {deployedAddress} from "./task-settings";

task("transferFrom", "transfers amount from some address to another")
.addParam("from", "Address of sender")
.addParam("to", "Address of recepient")
.addParam("amount", "The INT amount you withdraw", 0, types.int)
.setAction(async (taskArgs, hre) => 
{
  const Token = await hre.ethers.getContractFactory("ERC20");
  const instance = await Token.attach(deployedAddress);

  let allowance = await instance.allowance(taskArgs.from, taskArgs.to)

  if(allowance >= taskArgs.amount)
  {
    await instance.transferFrom(taskArgs.from, taskArgs.to, taskArgs.amount)
    console.log(`${taskArgs.amount} INT was transfered from: ${taskArgs.from} to: ${taskArgs.to}`)
  }
  else
  {
    console.log(`Allowance is: ${allowance} You ask: ${taskArgs.amount}`)
  }
});