const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ScoreStorage", function () {
  it("Should store and return scores", async function () {
    // 1. Deploy contract
    const ScoreStorage = await ethers.getContractFactory("ScoreStorage");
    const scoreStorage = await ScoreStorage.deploy();
    await scoreStorage.waitForDeployment();

    // 2. Get signer's address properly
    const [signer] = await ethers.getSigners();
    const signerAddress = await signer.getAddress();

    // 3. Test initial score
    expect(await scoreStorage.scores(signerAddress)).to.equal(0);

    // 4. Test storing score
    await scoreStorage.storeScore(420);
    expect(await scoreStorage.scores(signerAddress)).to.equal(420);
  });
});