
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

function fetchServerList(){
    fetch("http://143.198.138.219/api/servers").then(function(response){
        if(response.ok){
            return response.json();
        }
    }).then(function(data){
        console.log(data);
        var container = document.querySelector('#server-list');
        data.forEach(function(server){
            var element = document.createElement("p");
            element.innerHTML = server.name;
            container.appendChild(element);
        })
    })
}

async function registerStaticEventHandlers(){
    let form = document.querySelector('form[name="new-server"]'); //name equals attribute value
    form.addEventListener("submit", async function(event){
        event.preventDefault();
        let nameElement = form.querySelector('[name="repo_url"]');
        let name = nameElement.value;
        let data = {};
        data.repo_url = name;
        createServer(data);
    })

    let inputElement = form.querySelector('[name="repo_url"]');
    inputElement.addEventListener('change', async function(event){
        let payload = {
            repo_url: inputElement.value
        }
        const response = await fetch(`${apiEndPoint}github-branches?repo_url=${encodeURIComponent(payload.repo_url)}`, {
            body: JSON.stringify(payload)
        });
        if(response.ok){
            const data = await response.json();
            console.log(data);
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
            var element = document.createElement("p");
            var timestamp = new Date(server.created_at);
            element.innerHTML = `${server.name} ${timestamp} ${server.size_slug}`;
            container.appendChild(element);
        })
    })
}

registerStaticEventHandlers();
fetchServerList();
fetchDropletList();