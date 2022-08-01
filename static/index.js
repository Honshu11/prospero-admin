
function createServer(data){
    let createButtonTest = document.getElementById("create-server");
    
    if(createButtonTest){
        console.log("You've clicked on create server button");

    }

    fetch("https://143.198.138.219/api/server", {
        method: "POST",
        body: JSON.stringify(data)
    })
}

function registerStaticEventHandlers(){
    var form = document.querySelector('form[name="new-server"]'); //name equals attribute value
    form.addEventListener("submit", function(event){
        event.preventDefault();
        var nameElement = form.querySelector('[name="name"]');
        var name = nameElement.value;
        var data = {};
        data.name = name;
        createServer(data);
    })
}

registerStaticEventHandlers();