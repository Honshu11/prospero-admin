var http = require("http");

var server = http.createServer(handleRequest);

server.listen(80);

console.log("started server on port 80");

function handleRequest(request, response){
    console.log("Hello world");
    response.write("hello world");
    response.end();
}