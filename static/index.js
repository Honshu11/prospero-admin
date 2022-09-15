
const apiEndPoint = "http://143.198.138.219/api/";


function createServer(data){
    let createButtonTest = document.getElementById("create-server");
    
    if(createButtonTest){
        console.log("You've clicked on create server button");

    }

    fetch("http://143.198.138.219/api/servers", { //API fetch request
        method: "POST",
        body: JSON.stringify(data)
    }).then(function(response){
        if(response.ok){
            return response.json();
        }else{
            console.log(response);
        }      
    }).then(function(data){
        console.log(data);
    })
}

async function runSimulation(payload){
    var response = await fetch("http://143.198.138.219/api/simulations", { //API fetch request
        method: "POST",
        body: JSON.stringify(payload)
    })
    
    if(response.ok){
        var data = await response.text();
        var output = document.querySelector('.output');
        output.textContent = data;
    }
    else if(response.status == 502){
        var message = document.querySelector('.message');
        message.textContent = "could not connect to eda server, double check it's running";

    } else {
        console.log(response);
    }         
    console.log(data);
}

function fetchServerList(){
    fetch("http://143.198.138.219/api/servers").then(function(response){
        if(response.ok){
            return response.json();
        }
    }).then(function(data){
        console.log(`${data}`); //fetchServerList log
        var container = document.querySelector('#server-list');
        data.forEach(function(server){
            var element = document.createElement("p");
            element.innerHTML = server.name;
            container.appendChild(element);
        })
    })
}

var repo_url;
var sourceCode;

async function fetchSource(branch){
    var url = repo_url.replace('https://github.com/', 'https://raw.githubusercontent.com/');   
    url = url + '/' + branch + '/verilog/rtl/user_proj_example.v'; //url = `${url}/${branch}/verilog/rtl/user_proj_example.v`;
    var response = await fetch(url);
    if(response.ok){
        sourceCode = await response.text();
        //console.log(sourceCode);
        var preElement = document.querySelector('[name="preview-source"]');
        preElement.textContent = sourceCode;
    }    
}

async function registerStaticEventHandlers(){
    let form = document.querySelector('form[name="new-server"]'); //name equals attribute value
    form.addEventListener('submit', async function(event){
        event.preventDefault();
        let nameElement = form.querySelector('[name="repo_url"]');
        let name = nameElement.value;
        let data = {};
        data.repo_url = name;
        //createServer(data)
        data.branch = form.querySelector('[name="branches"]').value;
        data.sourceCode = sourceCode;
        runSimulation(data);
    })
    var dropdown = form.querySelector('[name="branches"]');
    dropdown.addEventListener('change', async function(event){
        var branch = dropdown.value;
        fetchSource(branch);
    })

    // Listening to user input on Git Repo URL 

    let inputElement = form.querySelector('[name="repo_url"]');
    inputElement.addEventListener('change', async function(event){
        repo_url = inputElement.value;
        let payload = {
            repo_url: inputElement.value,
        }
        const response = await fetch(`${apiEndPoint}github-branches?repo_url=${encodeURIComponent(payload.repo_url)}`, {
            //body: JSON.stringify(payload)
        });
        if(response.ok){
            var branches = await response.json();
            console.log(branches);
            updateBranchDropDown(branches);
            form.querySelector('.message').textContent = "";
            form.querySelector('.message').classList.remove('error');
        } else {
            form.querySelector('.message').textContent = await response.text();
            form.querySelector('.message').classList.add('error')
        }
        if(branches.includes('main')){
            fetchSource('main');
        }
        
    })

}

function fetchDropletList(){
    fetch(`${apiEndPoint}droplets`).then(function(response){
        if(response.ok){
            return response.json();
        }
    }).then(function(data){
        console.log(data);
        var container = document.querySelector('#droplet-list');
        data.droplets.forEach(function(server){
            var element = document.createElement('p');
            var timestamp = new Date(server.created_at);
            element.innerHTML = `${server.name} || ${timestamp} || ${server.size_slug} || ${server.memory}/mb || ${server.status}`;
            container.appendChild(element);
        })
    })
}

function updateBranchDropDown(branches){
    var form = document.querySelector('form[name="new-server"]');
    var dropdown = form.querySelector('select[name="branches"]');
    branches.forEach(function(branch){
        var option = document.createElement('option');
        option.textContent = branch;
        dropdown.appendChild(option);
        //console.log(form, option, dropdown);
    })

}

registerStaticEventHandlers();
fetchServerList();
fetchDropletList();