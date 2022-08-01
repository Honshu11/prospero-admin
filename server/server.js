var http = require("http");

var server = http.createServer(handleRequest);

server.listen(80);

console.log("started server on port 80");

function handleRequest(request, response){
    
    if(request.url == "/" && request.method == "GET"){
        console.log("Hello world");
        response.writeHead(200);
        response.write("<h1>Hello World</h1>");
        response.end();
    } else {
        response.write("404 file not found");
        response.writeHead(404);
        response.end();
    }
}