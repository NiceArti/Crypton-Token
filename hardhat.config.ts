import * as dotenv from "dotenv";

import { HardhatUserConfig, task, types } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import { Address } from "cluster";

dotenv.config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});


const deployedAddress: string = "0x39B9883F970BFDCf8Ad9D13fE383959AF987d3c9";

task("approve", "Increases allowance for recipient to transfer owner's amount")
.addParam("to", "Address of recepient")
.addParam("amount", "The INT amount you withdraw", 0, types.int)
.setAction(async (taskArgs, hre) => 
{
  const Token = await hre.ethers.getContractFactory("ERC20");
  const instance = await Token.attach(deployedAddress);

  await instance.approve(taskArgs.to, taskArgs.amount)
  console.log(`You gave permision ${taskArgs.to} to use ${taskArgs.amount} INT for transfers`)
});


// task("transferFrom", "transfers amount from some address to another")
// .addParam("from", "Address of sender")
// .addParam("to", "Address of recepient")
// .addParam("amount", "The INT amount you withdraw", 0, types.int)
// .setAction(async (taskArgs, hre) => 
// {
//   const Token = await hre.ethers.getContractFactory("ERC20");
//   const instance = await Token.attach(deployedAddress);

//   let allowance = await instance.allowance(taskArgs.from, taskArgs.to)

//   if(allowance >= taskArgs.amount)
//   {
//     await instance.transferFrom(taskArgs.from, taskArgs.to, taskArgs.amount)
//     console.log(`${taskArgs.amount} INT was transfered from: ${taskArgs.from} to: ${taskArgs.to}`)
//   }
//   else
//   {
//     console.log(`Allowance is: ${allowance} You ask: ${taskArgs.amount}`)
//   }
// });


// task("transfer", "transfers amount to some account's address")
// .addParam("to", "Address of recepient")
// .addParam("amount", "The INT amount you withdraw", 0, types.int)
// .setAction(async (taskArgs, hre) => 
// {
//   const Token = await hre.ethers.getContractFactory("ERC20");
//   const instance = await Token.attach(deployedAddress);

//   await instance.transfer(taskArgs.to, taskArgs.amount)
//   console.log(`${taskArgs.amount} INT was transfered to: ${taskArgs.to}`)
// });

// task("balanceOf", "shows balance of some account's address")
// .addParam("account", "Address of recepient")
// .setAction(async (taskArgs, hre) => 
// {
//   const Token = await hre.ethers.getContractFactory("ERC20");
//   const instance = await Token.attach(deployedAddress);

//   let balance = await instance.balanceOf(taskArgs.account)
//   console.log(`Balance of ${taskArgs.account} is: ${balance} INT`)
// });


// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    kovan: {
      url: process.env.KOVAN || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },

  solidity: 
  {
    version: "0.8.7",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  paths: 
  {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  mocha: 
  {
    timeout: 40000
  }
};

export default config;
