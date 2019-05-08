var MyContract = artifacts.require("MyContract");
var LinkToken = artifacts.require("LinkToken");

module.exports = (deployer, network, accounts) => {
  deployer.deploy(MyContract, LinkToken.address, {from: accounts[0]});
};