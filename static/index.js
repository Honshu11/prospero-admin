
function createServer(){
    let createButtonTest = document.getElementById("create-server");
    
    if(createButtonTest){
        console.log("You've clicked on create server button");

    }

    var data = {};

    fetch("https://143.198.138.219/api/server", {
        method: "POST",
        body: JSON.stringify(data)
    })
}

function registerStaticEventHandlers(){
    document.querySelector('form[name="new-server"]'); //name equals attribute value
}

registerStaticEventHandlers();