
function controls(player, socket) {
    console.log("here");
      
    window.addEventListener("keydown", downKey);

    function downKey(event){

        event.preventDefault(); //disregrard the inbuilt default representation of the key events
        player.keyEvents[event.key] = true;

        player.move();   
        socket.emit("playerMoved", {id: player.id, horizontalPos: player.horizontalPos, verticalPos: player.verticalPos});
    }

    window.addEventListener("keyup", upKey);
    function upKey(event){
        event.preventDefault();
        player.keyEvents[event.key] = false;
        player.move();
    }

    document.getElementById("button").addEventListener("click", attack);
    
    function attack(){
        console.log("attack is called");

        if (player.score >= 30){
            player.attack = true;
            let angle= attacks[1].generatePos(player.horizontalPos, player.verticalPos);
            //update player's attack properties
            
            player.bull_angle = angle; 
            
            socket.emit("playerAttack", ({id:player.id, bull_angle: player.bull_angle}));

            player.score -=30;

            setTimeout(()=> {client.attack=false;},5000);   //reset the client's attack state after 5 seconds.
            
        }
        
    }

};
