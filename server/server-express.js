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
app.use('/static', express.static('../static'));
//ROUTES

// app.get('/:filename', function(request, response){ //gets all static resource
//     try{
//         response.send(fs.readFileSync('../static/' + request.params.filename).toString());
//     }
//     catch(error){
//         response.sendStatus(404);
//         console.log("404 static resource not found:" + error);
//     }
// });


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
    }).then(function(fetchResponse){
        if(fetchResponse.ok){
            return fetchResponse.json();
        }
    }).then(async function(droplets){
        //console.log("response", droplets);
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
            "ssh_keys": [
                "c4:53:01:8c:72:73:54:c2:47:c8:8a:52:2f:a2:b1:00",
                "28:54:bc:4a:0a:42:af:0c:2b:85:76:00:56:f3:7e:65"
            ]     
           }
           var fetchResponse = await fetch('https://api.digitalocean.com/v2/droplets', {
                method: 'POST',
                body: JSON.stringify(payload),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + process.env.DIGITALOCEAN_TOKEN
                }
           })
           if(fetchResponse.ok){
            var server = await fetchResponse.json();

           } else {
            console.log(fetchResponse);
           }
           
           console.log(server);
        }


        //console.log(request.body.sourceCode);
        var edaHostName = 'http://146.190.14.93';
        try {
            fetchResponse = await fetch(edaHostName, {
                method: 'POST',
                body: request.body.sourceCode,
            })
        }
        catch(error) {
            response.status(502);
            response.end("eda server is down"); 
            return;
        }
        
        if(fetchResponse.ok) {
            data = await fetchResponse.text();
        } else {
            console.log(data);
            if(fetchResponse.status > 399){
                response.status(502); //bad gateway error
                response.end("eda server is down");
                return;
            }
        }
        //data = await response.text();
        console.log(data);
        response.status(200);
        response.end(data);
        //console.log(server.networks);
        
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
