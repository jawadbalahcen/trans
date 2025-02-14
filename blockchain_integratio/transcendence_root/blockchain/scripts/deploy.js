// Simple deployment script
const hre = require("hardhat");

async function main() {
  // 1. Compile the contract (if not already done)
  await hre.run("compile");

  // 2. Get the contract factory
  const ScoreStorage = await hre.ethers.getContractFactory("ScoreStorage");

  // 3. Deploy
  const scoreStorage = await ScoreStorage.deploy();
  await scoreStorage.waitForDeployment();

  // 4. Print address
  console.log("Contract deployed to:", await scoreStorage.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});