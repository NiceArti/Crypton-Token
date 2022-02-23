import { task, types } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import {deployedAddress} from "./task-settings";


task("transfer", "transfers amount to some account's address")
.addParam("to", "Address of recepient")
.addParam("amount", "The INT amount you withdraw", 0, types.int)
.setAction(async (taskArgs, hre) => 
{
  const Token = await hre.ethers.getContractFactory("ERC20");
  const instance = await Token.attach(deployedAddress);

  await instance.transfer(taskArgs.to, taskArgs.amount)
  console.log(`${taskArgs.amount} INT was transfered to: ${taskArgs.to}`)
});