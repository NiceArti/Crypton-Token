import { task, types } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import {deployedAddress} from "./task-settings";


task("balanceOf", "shows balance of some account's address")
.addParam("account", "Address of recepient")
.setAction(async (taskArgs, hre) => 
{
  const Token = await hre.ethers.getContractFactory("ERC20");
  const instance = await Token.attach(deployedAddress);

  let balance = await instance.balanceOf(taskArgs.account)
  console.log(`Balance of ${taskArgs.account} is: ${balance} INT`)
});