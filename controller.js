//=============================================================================
// File:    controller.js
// Desc:    Controller class - handles input, collision, rotation, rendering,
//          and core game loop logic
//=============================================================================
class Controller
{
    constructor()
    {
        this.game = new Game(WIDTH, HEIGHT);
        this.keyTool = new KeyTool();
        this.keyTool.initKeys();
        this.framRate = SLOW_RATE;
    }

    // checks if moving in a direction will cause a collision
    // returns true if collision detected
    checkCollision(aDir, shape, pos, well)
    {
        let index = 0;
        let posX = pos.x;
        let posY = pos.y;

        if      (aDir === dir.LEFT)  posX--;
        else if (aDir === dir.RIGHT) posX++;
        else if (aDir === dir.DOWN)  posY++;

        for (let y = posY; y < posY + shapeSize; y++)
        {
            for (let x = posX; x < posX + shapeSize; x++, index++)
            {
                if (shape[index] == blockType.SHAPE && well[x][y] != blockType.EMPTY)
                {
                    return true;
                }
            }
        }
        return false;
    }

    // checks if rotating will cause a collision
    // returns true if collision detected
    checkRotation(aDir, shape, pos, well)
    {
        let index = 0;
        const tempShape = aDir === dir.LEFT ? this.rotateLeft(shape) : this.rotateRight(shape);

        for (let y = pos.y; y < pos.y + shapeSize; y++)
        {
            for (let x = pos.x; x < pos.x + shapeSize; x++, index++)
            {
                if (tempShape[index] == blockType.SHAPE && well[x][y] != blockType.EMPTY)
                {
                    return true;
                }
            }
        }
        return false;
    }

    // rotates a flat shape array 90 degrees clockwise
    rotateRight(nums)
    {
        const size = Math.sqrt(nums.length);
        const results = [];
        for (let i = 0; i < size; i++)
            for (let j = 0; j < size; j++)
                results.push(nums[(size - j - 1) * size + i]);
        return results;
    }

    // rotates a flat shape array 90 degrees counter-clockwise
    rotateLeft(nums)
    {
        const size = Math.sqrt(nums.length);
        const results = [];
        for (let i = 0; i < size; i++)
            for (let j = 0; j < size; j++)
                results.push(nums[j * size + (size - 1) - i]);
        return results;
    }

    // helper to set a squares background color by its id
    setSquareColor(id, color)
    {
        const el = document.getElementById(id);
        if (el) el.style.backgroundColor = color;
    }

    // draws the next piece preview on the side panel
    drawNext(shape)
    {
        shape.forEach((block, i) =>
        {
            this.setSquareColor("next_" + i, block == blockType.EMPTY ? blankWellColor : shapeColor);
        });
    }

    // draws a shape onto the well at the given position
    // only draws over empty well cells so it doesnt overwrite placed blocks
    drawShape(shape, startPosX, startPosY, well)
    {
        let shapeIndex = 0;
        for (let y = startPosY; y < startPosY + shapeSize; y++)
        {
            for (let x = startPosX; x < startPosX + shapeSize; x++, shapeIndex++)
            {
                let square = document.getElementById("square_x" + x + "y" + y);
                let tempType = shape[shapeIndex];

                if (well[x][y] == blockType.EMPTY && tempType == blockType.EMPTY)
                {
                    square.style.backgroundColor = blankWellColor;
                }
                if (well[x][y] == blockType.EMPTY && tempType == blockType.SHAPE)
                {
                    square.style.backgroundColor = shapeColor;
                }
            }
        }
    }

    // erases old position then redraws next piece and current falling piece
    drawShapes()
    {
        this.drawShape(EMPTY_SHAPE, this.game.lastPos.x, this.game.lastPos.y, this.game.well);
        this.drawNext(this.game.nextShape);
        this.drawShape(this.game.currentShape, this.game.currentPos.x, this.game.currentPos.y, this.game.well);
    }

    // locks the current shape into the well as filled blocks
    pasteBlock(shape, well)
    {
        let shapeIndex = 0;
        const { x: px, y: py } = this.game.currentPos;
        for (let y = py; y < py + shapeSize; y++)
        {
            for (let x = px; x < px + shapeSize; x++, shapeIndex++)
            {
                let square = document.getElementById("square_x" + x + "y" + y);
                if (shape[shapeIndex] == blockType.SHAPE)
                {
                    well[x][y] = blockType.FILL;
                    square.style.backgroundColor = fillColor;
                }
            }
        }
    }

    // moves the block down each tick
    // if it hits something it gets pasted and a new block spawns
    // if the paste position is above the lose line, game over
    updateFallingBlock()
    {
        if (this.checkCollision(dir.DOWN, this.game.currentShape, this.game.currentPos, this.game.well))
        {
            this.pasteAndUpdateWell(this.game.width, this.game.height, this.game.currentShape, this.game.well);

            if (this.game.currentPos.y < LOSELINE)
            {
                this.game.gameState = gameStates.LOSE;
            }

            this.game.currentShape = this.game.nextShape;
            this.game.currentPos = { x: this.game.middleSpot, y: 0 };
            this.game.nextShape = this.game.shapes.makeRandom();
        }
        else
        {
            this.game.currentPos.y += 1;
        }
    }

    // pastes the block then checks for completed rows
    // clears any full rows and shifts remaining rows down
    pasteAndUpdateWell(aWidth, aHeight, shape, well)
    {
        this.pasteBlock(shape, well);

        let filledFloors = false;
        let rowData = [];
        let placeHolder = [];

        // scan every row except the floor
        for (let y = 0; y < aHeight - 1; y++)
        {
            for (let x = 0; x < aWidth; x++)
            {
                rowData[x] = well[x][y];
            }

            // if row has any empty space keep it, otherwise clear it
            if (rowData.includes(0))
            {
                placeHolder.push([...rowData]);
            }
            else
            {
                filledFloors = true;
                for (let x = 1; x < aWidth - 1; x++)
                {
                    well[x][y] = 0;
                    let square = document.getElementById("square_x" + x + "y" + y);
                    square.style.backgroundColor = blankWellColor;
                }
            }
        }

        // shift kept rows down to the bottom of the well
        if (filledFloors)
        {
            for (let y = placeHolder.length; y > 0; y--)
            {
                let row = placeHolder[y - 1];
                for (let x = 1; x < aWidth - 1; x++)
                {
                    well[x][y] = row[x];
                    let square = document.getElementById("square_x" + x + "y" + y);
                    if (well[x][y] == blockType.EMPTY)
                    {
                        square.style.backgroundColor = blankWellColor;
                    }
                    else
                    {
                        square.style.backgroundColor = fillColor;
                    }
                }
            }
        }
    }

    // main update called every tick — runs keys, logic, then render
    // lastPos update must happen after render or erasing breaks
    updateGame(dt)
    {
        this.updateKeys();
        this.updateLogic();
        this.updateRender();
        this.game.updateLastPos();
    }

    // handles game state transitions
    updateLogic()
    {
        const gs = this.game.gameState;

        if (gs === gameStates.INIT)
        {
            this.game.initGame();
            this.game.gameState = gameStates.PLAY;
        }
        else if (gs === gameStates.PLAY)
        {
            this.framRate = FRAME_RATE;
            this.updateFallingBlock();
        }
        else if (gs === gameStates.RESET)
        {
            this.framRate = SLOW_RATE;
            this.game.reset();
            this.game.gameState = gameStates.PLAY;
        }
        else
        {
            this.framRate = SLOW_RATE;
        }
    }

    // updates the DOM status and key hint text, draws shapes during play
    updateRender()
    {
        const status = document.getElementById("status");
        const keys = document.getElementById("keys");
        const gs = this.game.gameState;

        const keyHints =
        {
            [gameStates.PLAY]:  "<li>Arrow Keys = Move</li><li>Z, X = Rotate</li><li>P = Pause; R = Reset</li>",
            [gameStates.PAUSE]: "<li>P = Unpause</li><li>R = Reset</li>",
        };
        const statusText =
        {
            [gameStates.INIT]:  "LOADING....",
            [gameStates.PAUSE]: "GAME PAUSED",
            [gameStates.WIN]:   "YOU WON!",
            [gameStates.LOSE]:  "<li>GAME OVER!</li><li>R = Reset</li>",
            [gameStates.RESET]: "RESETTING...",
        };

        status.innerHTML = statusText[gs] ?? "";
        keys.innerHTML   = keyHints[gs]  ?? "";

        if (gs === gameStates.PLAY)
        {
            this.drawShapes();
        }
        else if (gs === gameStates.LOSE)
        {
            // erase the last falling block on game over
            this.drawShape(EMPTY_SHAPE, this.game.lastPos.x, this.game.lastPos.y, this.game.well);
        }
    }

    // reads keyboard input and updates game state accordingly
    updateKeys()
    {
        const gs = this.game.gameState;
        const { currentShape, currentPos, well } = this.game;

        if (gs === gameStates.PLAY)
        {
            if (this.keyTool.checkKey(37) && !this.checkCollision(dir.LEFT, currentShape, currentPos, well))
            {
                this.game.currentPos.x -= 1;
            }
            else if (this.keyTool.checkKey(39) && !this.checkCollision(dir.RIGHT, currentShape, currentPos, well))
            {
                this.game.currentPos.x += 1;
            }
            else if (this.keyTool.checkKey(40) && !this.checkCollision(dir.DOWN, currentShape, currentPos, well))
            {
                this.game.currentPos.y += 1;
            }
            else if (this.keyTool.checkKeyUp(90) && !this.checkRotation(dir.LEFT, currentShape, currentPos, well))
            {
                this.game.currentShape = this.rotateLeft(currentShape);
            }
            else if (this.keyTool.checkKeyUp(88) && !this.checkRotation(dir.RIGHT, currentShape, currentPos, well))
            {
                this.game.currentShape = this.rotateRight(currentShape);
            }
            else if (this.keyTool.checkKeyUp(80))
            {
                this.game.gameState = gameStates.PAUSE;
            }
            else if (this.keyTool.checkKeyUp(82))
            {
                this.game.gameState = gameStates.RESET;
            }
        }
        else if (gs === gameStates.PAUSE)
        {
            if (this.keyTool.checkKeyUp(80))
            {
                this.game.gameState = gameStates.PLAY;
            }
            else if (this.keyTool.checkKeyUp(82))
            {
                this.game.gameState = gameStates.RESET;
            }
        }
        else if (gs === gameStates.LOSE)
        {
            if (this.keyTool.checkKeyUp(82))
            {
                this.game.gameState = gameStates.RESET;
            }
        }
    }
}