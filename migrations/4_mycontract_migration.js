var MyContract = artifacts.require("MyContract");
var Oracle = artifacts.require("Oracle");
var LinkToken = artifacts.require("LinkToken");

module.exports = async (deployer, network) => {
  switch (network) {
  case "ropsten":
    deployer.deploy(MyContract, "0x20fE562d797A42Dcb3399062AE9546cd06f63280", "0x261a3F70acdC85CfC2FFc8badE43b1D42bf75D69");  
    break;
  case "rinkeby":
    deployer.deploy(MyContract, "0x01BE23585060835E02B77ef475b0Cc51aA1e0709", "0xf18455e70984e8fda0ADbe2c8dD21509DBeFA218");
    break;
  case "kovan":
    deployer.deploy(MyContract, "0xa36085F69e2889c224210F603D836748e7dC0088", "0x4bd72fA5Bb512c1E1f5B65E6E09509C93aC01b45");
    break;
  default:
    deployer.deploy(MyContract, LinkToken.address, Oracle.address);
    break;
  }
};