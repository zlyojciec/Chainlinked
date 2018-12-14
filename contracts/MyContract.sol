pragma solidity 0.4.24;

import "chainlink/solidity/contracts/Chainlinked.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract MyContract is Chainlinked, Ownable {
  uint256 constant private ORACLE_PAYMENT = 1 * LINK;
  uint256 public currentPrice;

  event RequestFulfilled(
    bytes32 indexed requestId,
    uint256 indexed price
  );

  constructor() public Ownable() {}

  function updateLinkToken(address _link) public onlyOwner {
    setLinkToken(_link);
  }

  function getChainlinkToken() public view returns (address) {
    return chainlinkToken();
  }

  function updateOracle(address _oracle) public onlyOwner {
    setOracle(_oracle);
  }

  function getOracle() public view returns (address) {
    return oracleAddress();
  }

  function requestEthereumPrice(bytes32 _jobId, string _currency) public onlyOwner returns (bytes32 requestId) {
    ChainlinkLib.Run memory run = newRun(_jobId, this, this.fulfill.selector);
    run.add("url", "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD,EUR,JPY");
    run.add("path", _currency);
    run.addInt("times", 100);
    requestId = chainlinkRequest(run, ORACLE_PAYMENT);
  }

  function cancelRequest(bytes32 _requestId) public onlyOwner {
    cancelChainlinkRequest(_requestId);
  }

  function fulfill(bytes32 _requestId, uint256 _price) public checkChainlinkFulfillment(_requestId) {
    emit RequestFulfilled(_requestId, _price);
    currentPrice = _price;
  }

  function withdrawLink() public onlyOwner {
    LinkTokenInterface link = LinkTokenInterface(chainlinkToken());
    require(link.transfer(msg.sender, link.balanceOf(address(this))), "Unable to transfer");
  }

}