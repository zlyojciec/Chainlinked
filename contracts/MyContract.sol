pragma solidity 0.4.24;

import "chainlink.js/contracts/Chainlinked.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract MyContract is Chainlinked, Ownable {
  // solium-disable-next-line zeppelin/no-arithmetic-operations
  uint256 constant private ORACLE_PAYMENT = 1 * LINK;
  uint256 public data;

  constructor(address _link, address _oracle) public {
    setLinkToken(_link);
    setOracle(_oracle);
  }

  function getChainlinkToken() public view returns (address) {
    return chainlinkToken();
  }

  function getOracle() public view returns (address) {
    return oracleAddress();
  }

  function createRequest(
    bytes32 _jobId,
    string _url,
    string _path,
    int256 _times
  )
    public
    onlyOwner
    returns (bytes32) 
  {
    return createRequestTo(getOracle(), _jobId, _url, _path, _times);
  }

  function createRequestTo(
    address _oracle,
    bytes32 _jobId,
    string _url,
    string _path,
    int256 _times
  )
    public
    onlyOwner
    returns (bytes32 requestId) 
  {
    Chainlink.Request memory req = newRequest(_jobId, this, this.fulfill.selector);
    req.add("url", _url);
    req.add("path", _path);
    req.addInt("times", _times);
    requestId = chainlinkRequestTo(_oracle, req, ORACLE_PAYMENT);
  }

  function fulfill(bytes32 _requestId, uint256 _data)
    public
    recordChainlinkFulfillment(_requestId)
  {
    data = _data;
  }

  function withdrawLink() public onlyOwner {
    LinkTokenInterface link = LinkTokenInterface(chainlinkToken());
    require(link.transfer(msg.sender, link.balanceOf(address(this))), "Unable to transfer");
  }

  function cancelRequest(
    bytes32 _requestId,
    uint256 _payment,
    bytes4 _callbackFunctionId,
    uint256 _expiration
  )
    public
	onlyOwner
  {
    cancelChainlinkRequest(_requestId, _payment, _callbackFunctionId, _expiration);
  }
}