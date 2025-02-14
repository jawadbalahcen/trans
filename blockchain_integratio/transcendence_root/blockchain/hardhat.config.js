/** @type import('hardhat/config').HardhatUserConfig */


require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.24",
  networks: {
    hardhat: {
      chainId: 1337, // ← Match this to the network's actual chain ID
    },
    localhost: {
      url: "http://blockchain:8545", // DOCKER SERVICE NAME NOT LOCALHOST
      chainId: 1337
    }
  }
};
