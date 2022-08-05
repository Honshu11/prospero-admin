var express = require('express');
var app = express();

app.get('/', function(request, response){
    response.send("Hello World");
});

app.get('/server/1234', function(request, response){
    response.send("Server 1234");
})

app.listen(80);
