const express = require('express');
const mongodb = require('mongodb');
const fs = require('fs');
const app = express();
const db = (new mongodb.MongoClient(process.env.DB_STRING)).db('admin');


//ROUTES

app.get('/:filename', function(request, response){
    //response.send(fs.readFileSync('../static/index.html').toString());
    response.send(fs.readFileSync('../static/' + request.params.filename).toString());
});

app.get('/quixlab-main/theme/css/style.css', function(request, response){
    //response.send(fs.readFileSync('../static/index.html').toString());
    response.send(fs.readFileSync('../static/quixlab-main/theme/css/style.css').toString());
});

app.get('/', function(request, response){
    //response.send(fs.readFileSync('../static/index.html').toString());
    response.send(fs.readFileSync('../static/index.html').toString());
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
    db.collection('servers').find().toArray().then(function(serverData){
        response.status(200);
        response.send(serverData);
    }).catch(function(){
        response.status(500);
    })
})

app.listen(80);
