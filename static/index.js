
function createServer(){
    let createButtonTest = document.getElementById("create-server");
    
    if(createButtonTest){
        console.log("You've clicked on create server button");

    }

    fetch("https://143.198.138.219/api/server", {
        method: "POST",
    })
}

