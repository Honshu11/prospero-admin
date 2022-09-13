const express = require('express');
const mongodb = require('mongodb');
const bodyParser = require('body-parser');
const fs = require('fs'); //filesystem
const app = express();
const child_process = require('child_process');
const db = (new mongodb.MongoClient(process.env.DB_STRING)).db('admin');
const { processBranchList } = require('./branchParser/branchParser');
const { response, application } = require('express');
const { json } = require('body-parser');
require('isomorphic-fetch');


app.use(bodyParser.json({type: '*/*'}));

//ROUTES

app.get('/:filename', function(request, response){ //gets all static resource
    try{
        response.send(fs.readFileSync('../static/' + request.params.filename).toString());
    }
    catch(error){
        response.sendStatus(404);
        console.log("404 static resource not found:" + error);
    }
});


app.get('/', function(request, response){
    response.send(fs.readFileSync('../static/index.html').toString());
});

app.get('/server/:id', function(request, response){
    response.send("Server " + request.params.id);
})

app.post('/api/servers', function(request, response){ //promise
    // console.log("POST api/servers: " + request);
    // console.log(request.body);
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
        //console.log(data);
        response.status(200);
        response.send(data);
    })
})

app.post('/api/simulations', function(request, response){
    console.log("POST simulations");
    fetch('https://api.digitalocean.com/v2/droplets?tag_name=' + encodeURIComponent('sim'), {
        headers: {
            'Authorization': 'Bearer ' + process.env.DIGITALOCEAN_TOKEN
        }
    }).then(function(response){
        if(response.ok){
            return response.json();
        }
    }).then(async function(droplets){
        console.log("response", droplets);
        //response.status(200);
        //response.send(data);
        if(droplets.droplets && droplets.droplets.length > 0){
            console.log('data droplets', droplets);
            //TODO: handle case where server is already running.

        } else {
           var payload = {
            "name": "pa.prospero.live", //use ip address
            "region": "sfo3",
            "size": "c-4",
            "image": "116806322",
            "tags": ["sim"],     
           }
           var response = await fetch('https://api.digitalocean.com/v2/droplets', {
                method: 'POST',
                body: JSON.stringify(payload),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + process.env.DIGITALOCEAN_TOKEN
                }
           })
           if(response.ok){
            var server = await response.json();

           } else {
            console.log(response);
           }
           
           console.log(server);
           var edaHostName = 'http://146.190.14.93';
           response = await fetch(edaHostName, {
            method: 'POST',
            body: request.body.sourceCode,
           })
           data = await response.text();
           console.log(data);
           console.log(server.networks);
        }
    })
})

app.get('/api/github-branches', function(request, response){
    const gitProcess = child_process.spawn('git', ['ls-remote', '--heads', request.query.repo_url], {  
    });
    gitProcess.stdout.on('data', function(data){
        var branches = processBranchList(data);
        response.status(200);
        //console.log(branches);
        response.send(JSON.stringify(branches));
    })
    gitProcess.on('exit', function(code, signal){
        console.log("exit", code);
        console.log("signal", signal);
        if(code){
            response.status(400);
            response.send('Invalid git repo url');
        }
    })
    gitProcess.on('error', function(error){
        console.log(`${request.ip} ${error}`);
        response.status(400);
        response.send('Invalid git repo url');
    })

})


app.listen(80);
