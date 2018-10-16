var LinkToken = artifacts.require("LinkToken");
var Oracle = artifacts.require("Oracle");

module.exports = function(deployer, network) {
  if (network == "test" || network == "development") {
    deployer.deploy(Oracle, LinkToken.address);
  }
};
