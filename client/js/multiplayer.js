// js code here

/*var raceGame;
var spwanpoint=0;
var type=0;
var raceObstacles = [];
var raceScore;


function startGame() {
    raceGame = new component(40, 70, "c1.png",200,400, "image");
    raceGame.gravity = 0.00;
    raceScore = new component("30px", "Impact", "white", 150, 40, "text");
    raceGameArea.start();
}

var raceGameArea = {
    canvas : document.getElementById("Game") ,
        start : function() {
        this.canvas.width = 420;
        this.canvas.height = 500;
		this.canvas.id="demo";
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
		 window.addEventListener('keydown', function (e) {
            raceGameArea.key = e.keyCode;
        })
        window.addEventListener('keyup', function (e) {
            raceGameArea.key = false;
        })

console.log("the client script is working") ;

function downarrow() {
    accelerate(-0.2);
  }
  
  function uparrow() {
    accelerate(0.05);
  }
          },
      clear : function() {
          this.context.clearRect(0, 0, this.canvas.Width, this.canvas.Height);
      },
      stop : function() {
          clearInterval(this.interval);
      }


}

//background music
function startGame() {
    
    
    myMusic = new sound("car bg music 1.mp3");
    myMusic.play();
    myGameArea.start();
}
function updateGameArea() //this function : stops the music when the car hits an obstacle.
{
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            
            myMusic.stop();
            myGameArea.stop();
            return;
        } 
    }

}*/




const canvas = document.getElementById("canvas"),
ctx = canvas.getContext("2d");

fillTrack(canvas);

function fillTrack(canvas){   //make the canvas cover the entire Track div
    canvas.style.width='100%';
    canvas.style.height='100%';
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}

class Liveplayers{
    constructor({id}){
        this.id = id;
        this.horizontalPos = 10;
        this.verticalPos = 10;
        this.score = 0;
        this.keyEvents = {  //set the default values of all relevant key events to false
            ArrowUp:   false,
            ArrowDown:  false,
            ArrowRight: false,
            ArrowLeft: false
        }; 
        this.speed = 10;
    }
    
    draw(ctx){
        ctx.beginPath();
        const img = new Image();
        img.src = "https://f28wp-dubai-weblings.github.io/Game/client/media/raceGreen.png";
        ctx.drawImage(img, this.horizontalPos, this.verticalPos, img.width, 150);
    }

    move(){
        if (this.keyEvents.ArrowUp) {   //move up when ArrowUp is pressed & don't let the car move above 70px (height)
            this.verticalPos -= this.speed;
        }
        if (this.keyEvents.ArrowLeft) {   //move left when ArrowLeft is pressed & set minimum horizontal position as 35px (width)
            this.horizontalPos -= this.speed;
        }

        if (this.keyEvents.ArrowDown) {  //move down when ArrowDown is pressed & don't let the car move beyond 1000px (height)
            this.verticalPos += this.speed;
        }
        if (this.keyEvents.ArrowRight) {    //move right when the ArrowRight is press & don't let the car move beyond 1020px (width)
            this.horizontalPos += this.speed;
        }
        this.draw(ctx);
    }

}

//import { Liveplayers } from './liveplayers.js';


function controls(player, socket) {
    console.log("here");
      
    window.addEventListener("keydown", downKey);

    function downKey(event){
        console.log("the player positionn is"+ player.horizontalPos + player.verticalPos);
        event.preventDefault(); //disregrard the inbuilt default representation of the key events
        player.keyEvents[event.key] = true;

        player.move();   //try without dir?
        console.log("the new player positionn is"+ player.horizontalPos + player.verticalPos);
        console.log("the player sent is" + player.id);
        socket.emit("playerMoved", {id: player.id, horizontalPos: player.horizontalPos, verticalPos: player.verticalPos});
        console.log("the horizontal Pos sent from multiplayer.js"+ player.horizontalPos);

    }

    window.addEventListener("keyup", upKey);
    function upKey(event){
        event.preventDefault();
        player.keyEvents[event.key] = false;
        player.move();

    }

};

let players = [];

const socket = io(); //initialise a new socket each time a player arrives

socket.on("init", ({id,player_list}) => {
    console.log("there is a player connected" + players.length);

    console.log("got the init message");
    const player = new Liveplayers({id}); //instantiate an object of the 'liveplayers' class

    controls(player, socket);

    socket.emit('newPlayer', player);   //emit to the server that a new player has joined 
    socket.on('newPlayer', newPlayer => {
        console.log("pushing the player onto screen");
        players.push(new Liveplayers(newPlayer))});  //update the 'clients' list on the browser when a newPlayer message is recieved
    

    socket.on('playerMoved', ({id, horizontalPos, verticalPos}) => {
        console.log("the horizontal Pos recieved here in multiplayer.js "+ horizontalPos);
        players.find(elem => elem.id === id).horizontalPos = horizontalPos;
        players.find(elem => elem.id === id).verticalPos = verticalPos;

    });

    players = player_list.map(v => new Liveplayers(v)).concat(player);

    //socket.on('stopMovement', ({id, dir}) => clients.find(elem => elem.id === id).stop());
    

    function draw(){
        ctx.clearRect(0,0,canvas.width,canvas.height); //clear the canvas every frame
        players.forEach(client => client.draw(ctx))    //draw the updated position of the client on the canvas
        requestAnimationFrame(draw); //try adding window.
    }
    draw();
});
