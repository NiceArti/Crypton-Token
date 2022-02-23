import { task, types } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import {deployedAddress} from "./task-settings";


task("approve", "Increases allowance for recipient to transfer owner's amount")
.addParam("to", "Address of recepient")
.addParam("amount", "The INT amount you withdraw", 0, types.int)
.setAction(async (taskArgs, hre) => 
{
  const Token = await hre.ethers.getContractAt("ERC20", deployedAddress);

  await Token.approve(taskArgs.to, taskArgs.amount)
  console.log(`You gave permision ${taskArgs.to} to use ${taskArgs.amount} INT for transfers`)
});
