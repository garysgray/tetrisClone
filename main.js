//CONST
const gameStates = {INIT:0, PLAY: 1, PAUSE:2, WIN:3, LOSE:4, RESET:5};
const dir = { LEFT: 0, RIGHT: 1, DOWN: 2 };
const blockType = { EMPTY: 0, SHAPE: 1, WALL: 2, FLOOR: 3, FILL: 4, LIMIT: 5};

const WIDTH = 20;
const HEIGHT = 30; //cant be less then 15
const LOSELINE = (HEIGHT/6)-2;

const squareSize = 16;
const shapeSize = 3;
const gapSize = 20;

const blankWellColor = "black";
const wallColor = "#841550";
const floorColor =  "#c20c98"; 
const shapeColor = "blue";
const fillColor = "red";
const limitColor = "yellow";

//these are global and used by device key checker
//its a issue i need to fix but works for now
keysDown = {};
keysUp = {};


//GAME LOOP
const intervalSpeed = 7;
const FRAME_RATE = 1000;
const SLOW_RATE = 10000;
let time = 0;
	
myControl = new Controller();

function gameLoop(timestamp)
{
   setTimeout(function()
   {
    var now = new Date().getTime();
    var dt = (now - (time || now))/(myControl.framRate/intervalSpeed);
    console.log(dt);
    myControl.updateGame(dt);
    requestAnimationFrame(gameLoop);
    time = now;
   }, myControl.framRate/intervalSpeed)  
}
requestAnimationFrame(gameLoop);

