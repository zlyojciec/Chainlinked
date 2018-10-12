var LinkToken = artifacts.require("LinkToken");

module.exports = function(deployer, network) {
  if (network == "test" || network == "development") {
    deployer.deploy(LinkToken);
  }
};
