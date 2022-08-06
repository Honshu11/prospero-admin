
function createServer(data){
    let createButtonTest = document.getElementById("create-server");
    
    if(createButtonTest){
        console.log("You've clicked on create server button");

    }

    fetch("https://143.198.138.219/api/servers", { //API fetch request
        method: "POST",
        body: JSON.stringify(data)
    })
}

function registerStaticEventHandlers(){
    let form = document.querySelector('form[name="new-server"]'); //name equals attribute value
    form.addEventListener("submit", function(event){
        event.preventDefault();
        let nameElement = form.querySelector('[name="name"]');
        let name = nameElement.value;
        let data = {};
        data.name = name;
        createServer(data);
    })
}

registerStaticEventHandlers();