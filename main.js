//=============================================================================
// File:    main.js
// Desc:    Entry point - defines all global constants, initializes the game,
//          and runs the main game loop
//=============================================================================

// game states and directional constants
const gameStates = { INIT: 0, PLAY: 1, PAUSE: 2, WIN: 3, LOSE: 4, RESET: 5 };
const dir        = { LEFT: 0, RIGHT: 1, DOWN: 2 };
const blockType  = { EMPTY: 0, SHAPE: 1, WALL: 2, FLOOR: 3, FILL: 4, LIMIT: 5 };

// well dimensions — HEIGHT must be >= 15
const WIDTH    = 20;
const HEIGHT   = 30;
const LOSELINE = (HEIGHT / 6) - 2;

// display sizes and colors
const squareSize     = 16;
const shapeSize      = 3;
const gapSize        = 20;
const blankWellColor = "black";
const wallColor      = "#841550";
const floorColor     = "#c20c98";
const shapeColor     = "blue";
const fillColor      = "red";
const limitColor     = "yellow";

// global key state objects — kept global so KeyTool event listeners can access them
keysDown = {};
keysUp   = {};

// game loop timing
const intervalSpeed = 7;
const FRAME_RATE    = 1000;
const SLOW_RATE     = 10000;
let time = 0;

// create the controller which creates the game
const myControl = new Controller();

// main game loop — uses setTimeout inside requestAnimationFrame to control tick speed
// dt is calculated from real elapsed time scaled by the current frame rate
function gameLoop(timestamp)
{
    setTimeout(() =>
    {
        const now = Date.now();
        const dt  = (now - (time || now)) / (myControl.framRate / intervalSpeed);
        myControl.updateGame(dt);
        requestAnimationFrame(gameLoop);
        time = now;
    }, myControl.framRate / intervalSpeed);
}

requestAnimationFrame(gameLoop);