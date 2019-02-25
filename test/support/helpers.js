abi = require("ethereumjs-abi");
util = require("ethereumjs-util");
BN = require("bn.js");


(() => {

  before(async () => {
    accounts = await web3.eth.accounts;
    defaultAccount = accounts[0];
    oracleNode = accounts[1];
    stranger = accounts[2];
    consumer = accounts[3];
  });

  bigNum = number => web3.utils.toBN(number);

  toHexWithoutPrefix = arg => {
    if (arg instanceof Buffer || arg instanceof BN) {
      return arg.toString("hex");
    } else if (arg instanceof Uint8Array) {
      return Array.prototype.reduce.call(arg, (a, v) => a + v.toString("16").padStart(2, "0"), "");
    } else {
      return Buffer.from(arg, "ascii").toString("hex");
    }
  };
    
  toHex = value => {
    return Ox(toHexWithoutPrefix(value));
  };
    
  Ox = value => ("0x" !== value.slice(0, 2)) ? `0x${value}` : value;
  
  hexToAddress = hex => Ox(bigNum(hex).toString("hex"));

  startMapBuffer = Buffer.from([0xBF]);
  endMapBuffer = Buffer.from([0xFF]);
  
  autoAddMapDelimiters = (data) => {
    let buffer = data;
    
    if (buffer[0] >> 5 !== 5) {
      buffer = Buffer.concat([startMapBuffer, buffer, endMapBuffer], buffer.length + 2);
    }
    
    return buffer;
  };
  
  decodeRunRequest = log => {
    const runABI = util.toBuffer(log.data);
    const types = ["address", "bytes32", "uint256", "address", "bytes4", "uint256", "uint256", "bytes"];
    const [
      requester,
      requestId,
      payment,
      callbackAddress,
      callbackFunc,
      expiration,
      version,
      data
    ] = abi.rawDecode(types, runABI);
    
    return {
      topic: log.topics[0],
      jobId: log.topics[1],
      requester: Ox(requester),
      id: toHex(requestId),
      payment: toHex(payment),
      callbackAddr: Ox(callbackAddress),
      callbackFunc: toHex(callbackFunc),
      expiration: toHex(expiration),
      dataVersion: version,
      data: autoAddMapDelimiters(data)
    };
  };
  
  fulfillOracleRequest = async (oracle, request, response, options) => {
    if (!options) options = {};
    
    return oracle.fulfillOracleRequest(
      request.id,
      request.payment,
      request.callbackAddr,
      request.callbackFunc,
      request.expiration,
      response,
      options);
  };

})();
