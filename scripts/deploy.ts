import { ethers } from "hardhat";

async function main() {
  const Token = await ethers.getContractFactory("ERC20");
  const instance = await Token.deploy("Intern Token", "INT");

  await instance.deployed();

  console.log("Token deployed to:", instance.address);
}


main().catch((error) => 
{
  console.error(error);
  process.exitCode = 1;
});
