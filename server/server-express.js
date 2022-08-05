var express = require('express');
var app = express();

app.get('/', function(request, response){
    response.send("Hello World");
});

app.get('/server/:id', function(request, response){
    response.send("Server " + request.params.id);
})

app.listen(80);
