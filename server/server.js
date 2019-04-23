// gRPC 相关依赖
var PROTO_PATH = __dirname + '/../protos/sign.proto';
var grpc = require('grpc');
var protoLoader = require('@grpc/proto-loader');
var packageDefinition = protoLoader.loadSync(PROTO_PATH,
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  });

var proto = grpc.loadPackageDefinition(packageDefinition).sign;
const signService = require('./service_impl');

global.navigator = {
  userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1"
};

/**
 * 启动 RPC 服务
 */


function main() {
  var server = new grpc.Server();
  let port = 8081;
  let impl = {
    webSign: function (call, callback) {
      callback(null, {signature: signService.webSign(call.request.uid)});
    },
    appSign: function (call, callback) {
      callback(null, {url: signService.appSign});
    }
  };
  console.log(impl);
  server.addService(proto.SignService.service, impl);
  server.bind(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure());
  server.start();
  console.log("douyin rpc service start at " + String(port));
}

main();

/**
 * 字符串 -> 字节数组
 */
function string2Bin(str) {
  const buffer = Buffer.from(str, 'utf-8');
  return Array.prototype.slice.call(buffer, 0)
}

/**
 * 字节数组 -> 字符串
 */
function bin2String(array) {
  return new Buffer(array).toString('utf-8');
}
