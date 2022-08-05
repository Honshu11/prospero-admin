var express = require('express');
var mongodb = require('mongodb');
var app = express();
const db = (new mongodb.MongoClient(process.env.DB_STRING)).db('admin');


//ROUTES

app.get('/', function(request, response){
    response.send("Hello World");
});

app.get('/server/:id', function(request, response){
    response.send("Server " + request.params.id);
})

app.post('/api/servers', function(request, response){ //promise
    db.collection('servers').insertOne({name: 'test server'}).then(function(serverData){
        response.status(201); //returns connection and addition to something
        response.send(serverData);
    }).catch(function(){
        response.status(500); //
    });
})

app.get('/api/servers', function(request, response){
    db.collection('servers').find({}).then(function(serverData){
        response.status(200);
        response.send(serverData);
    }).catch(function(){
        response.status(500);
    })
})

app.listen(80);
