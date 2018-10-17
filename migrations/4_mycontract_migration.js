var MyContract = artifacts.require("MyContract");

module.exports = async (deployer) => {
  deployer.deploy(MyContract);
};