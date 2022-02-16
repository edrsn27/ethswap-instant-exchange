const EthSwap = artifacts.require("EthSwap");
const Token = artifacts.require("Token");

module.exports = async function (deployer) {
  // deploy Token contract
  await deployer.deploy(Token);
  let token = await Token.deployed();
  // deploy EthSwap contract
  await deployer.deploy(EthSwap, token.address);
  let ethSwap = await EthSwap.deployed();

  await token.transfer(ethSwap.address, "1000000000000000000000000");
};
