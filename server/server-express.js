const express = require('express');
const mongodb = require('mongodb');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const child_process = require('child_process');
const db = (new mongodb.MongoClient(process.env.DB_STRING)).db('admin');
require('isomorphic-fetch');



app.use(bodyParser.json({type: '*/*'}));

//ROUTES

app.get('/:filename', function(request, response){ //gets all static resource
    //response.send(fs.readFileSync('../static/index.html').toString());
    try{
        response.send(fs.readFileSync('../static/' + request.params.filename).toString());
    }
    catch(error){
        response.sendStatus(404);
        console.log("404 static resource not found: " + error);
    }
});


app.get('/', function(request, response){
    //response.send(fs.readFileSync('../static/index.html').toString());
    response.send(fs.readFileSync('../static/index.html').toString());
});

app.get('/server/:id', function(request, response){
    response.send("Server " + request.params.id);
})

app.post('/api/servers', function(request, response){ //promise
    console.log("POST api/servers: " + request);
    console.log(request.body);
    db.collection('servers').insertOne({name: request.body.name}).then(function(serverData){
        response.status(201); //returns connection and addition to something
        response.send(serverData);
    }).catch(function(){
        response.sendStatus(500);
    });
})

app.get('/api/servers', function(request, response){
    db.collection('servers').find().toArray().then(function(serverData){
        response.status(200);
        response.send(serverData);
    }).catch(function(){
        response.sendStatus(500);
    })
})

app.get('/api/droplets', function(request, response){
    fetch('https://api.digitalocean.com/v2/droplets', {
        headers: {
            'Authorization': 'Bearer ' + process.env.DIGITALOCEAN_TOKEN
        }
    }).then(function(response){
        if(response.ok){
            return response.json();
        }
    }).then(function(data){
        console.log(data);
        response.status(200);
        response.send(data);
    })
})

app.get('/api/github-branches', function(request, response){
    
    const gitProcess = child_process.spawn('/usr/bin/git', ['ls-remote', '--heads', request.query.repo_url], { 
        
    });
    gitProcess.stdout.on('data', function(data){
        response.status(200);
        response.send(data.toString());
    })
    gitProcess.on('exit', function(code){
        if(!code){
            console.log(code);
        }
    })
    gitProcess.on('error', function(error){
        console.log(`${request.ip} ${error}`);
        response.status(400);
        response.send('Invalid git repo url');
    })

})

app.listen(80);
