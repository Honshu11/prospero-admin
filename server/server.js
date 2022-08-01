var http = require("http");

var server = http.createServer(handleRequest);

server.listen(80);

console.log("started server on port 80");

function handleRequest(request, response){
    console.log("Hello world");
    response.writeHead("content-type", "text/html");
    response.write("<h1>Hello World</h1>");
    response.end();
}