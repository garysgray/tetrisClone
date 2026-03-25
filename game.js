//=============================================================================
// File:    game.js
// Desc:    Shapes and Game classes - manages well state, DOM generation,
//          block types, and game reset logic
//=============================================================================

class Shapes
{
    constructor()
    {
        this.shapes = [A, B, C, D, E, F, G];
    }

    // returns a random shape array from the shapes list
    makeRandom()
    {
        return [...this.shapes[Math.floor(Math.random() * this.shapes.length)]];
    }
}

class Game
{
    constructor(width, height)
    {
        this.gameState    = gameStates.INIT;
        this.width        = width;
        this.height       = height;
        this.shapes       = new Shapes();
        this.middleSpot   = Math.floor(width / 2) - 1;
        this.well         = new Array(height);
        this.currentShape = [0, 0, 0, 0, 0, 0];
        this.nextShape    = [0, 0, 0, 0, 0, 0];
        this.currentPos   = { x: this.middleSpot, y: 0 };
        this.lastPos      = { x: this.middleSpot, y: 0 };
    }

    // saves current position so the previous frame can be erased next draw
    updateLastPos()
    {
        this.lastPos = { ...this.currentPos };
    }

    // maps a blockType value to its display color
    // returns null for types with no color (SHAPE, FILL handled by controller)
    blockColor(type)
    {
        const colors =
        {
            [blockType.EMPTY]: blankWellColor,
            [blockType.WALL]:  wallColor,
            [blockType.FLOOR]: floorColor,
            [blockType.LIMIT]: limitColor,
        };
        return colors[type] ?? null;
    }

    // creates and returns a styled div square at the given grid position
    createSquare(id, x, y)
    {
        const square = document.createElement("div");
        square.setAttribute("id", id);
        Object.assign(square.style,
        {
            position: "absolute",
            left:     `${x * squareSize}px`,
            top:      `${y * squareSize}px`,
            width:    `${squareSize}px`,
            height:   `${squareSize}px`,
            border:   "solid",
            zIndex:   0,
        });
        return square;
    }

    // builds the DOM for the well and next-piece preview and adds it to the page
    // only called once at the start of the game
    initGame()
    {
        this.currentShape = this.shapes.makeRandom();
        this.nextShape    = this.shapes.makeRandom();
        this.resetWell();

        const holder = document.createElement("div");
        holder.setAttribute("id", "holder");

        // generate next-piece preview squares to the right of the well
        let nextIndex = 0;
        for (let y = 0; y < shapeSize; y++)
        {
            for (let x = 0; x < shapeSize; x++, nextIndex++)
            {
                const square = this.createSquare("next_" + nextIndex,
                    this.width * gapSize / squareSize + x, y);
                square.style.left       = `${this.width * gapSize + 1 + x * squareSize}px`;
                square.style.background = blankWellColor;
                holder.appendChild(square);
            }
        }

        // generate the well squares and color them based on their block type
        for (let x = 0; x < this.width; x++)
        {
            for (let y = 0; y < this.height; y++)
            {
                const square = this.createSquare(`square_x${x}y${y}`, x, y);
                const color  = this.blockColor(this.well[x][y]);
                if (color) square.style.background = color;
                holder.appendChild(square);
            }
        }

        document.getElementById("game-holder").appendChild(holder);
    }

    // resets the well data to its initial state
    // empty interior, walls on sides, limit zone at top, floor at bottom
    resetWell()
    {
        // fill entire well with empty
        for (let x = 0; x < this.width; x++)
        {
            this.well[x] = new Array(this.height).fill(blockType.EMPTY);
        }

        // side walls — limit above lose line, wall below
        for (let y = 0; y < this.height; y++)
        {
            const wallVal = y < LOSELINE ? blockType.LIMIT : blockType.WALL;
            this.well[0][y]              = wallVal;
            this.well[this.width - 1][y] = wallVal;
        }

        // floor along the bottom
        for (let x = 0; x < this.width; x++)
        {
            this.well[x][this.height - 1] = blockType.FLOOR;
        }
    }

    // resets game state and redraws the well and next-piece preview
    // called when player hits reset — reuses existing DOM, does not rebuild it
    reset()
    {
        this.currentShape = this.shapes.makeRandom();
        this.nextShape    = this.shapes.makeRandom();
        this.currentPos   = { x: this.middleSpot, y: 0 };
        this.lastPos      = { x: this.middleSpot, y: 0 };
        this.resetWell();

        // clear next-piece preview
        let nextIndex = 0;
        for (let y = 0; y < shapeSize; y++)
        {
            for (let x = 0; x < shapeSize; x++, nextIndex++)
            {
                document.getElementById("next_" + nextIndex).style.background = blankWellColor;
            }
        }

        // redraw well squares based on reset well data
        for (let x = 0; x < this.width; x++)
        {
            for (let y = 0; y < this.height; y++)
            {
                const square = document.getElementById(`square_x${x}y${y}`);
                const color  = this.blockColor(this.well[x][y]);
                if (color) square.style.background = color;
            }
        }
    }
}