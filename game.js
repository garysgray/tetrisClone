//INITIALIZE members


///////classes and stuff
class Shapes
{
    constructor()
    {
        this.shapes = [A,B,C,D,E,F,G];  
    }
    makeRandom()
    {
        let index = Math.floor((Math.random() * this.shapes.length));
        return [...this.shapes[index]];
    }
}

class Game
{
    constructor(width,height)
    {
        this.gameState = gameStates.INIT;
        this.width = width;
        this.height = height
        this.shapes = new Shapes();
        this.currentShape = [0,0,0,0,0,0];
        this.nextShape    = [0,0,0,0,0,0];
        this.middleSpot = (this.width/2)-1;
        this.well = new Array(this.height);
        this.currentPos = {x:this.middleSpot,y:0};
        this.lastPos = {x:this.middleSpot,y:0};  
    }

    updateLastPos()
    {
        this.lastPos = {x:this.currentPos.x,y:this.currentPos.y};
    }

    initGame()
    {
        this.currentShape = this.shapes.makeRandom();
        this.nextShape = this.shapes.makeRandom();
        
        this.resetWell();

        //let holder = document.getElementById("holder");
        let holder = document.createElement("div");
        holder.setAttribute("id", "holder");

        //generate next piece
        let nextIndex = 0;
        for(let y = 0; y < shapeSize; y++)
        {
            for(let x = 0; x < shapeSize; x++)
            {
                let square = document.createElement("div");
                square.setAttribute("id", "next_"+nextIndex);
                square.style.position = "absolute";
                square.style.left = (this.width*gapSize+1) + (x * squareSize) +"px";
                square.style.top = 0 + (y * squareSize) +"px";
                square.style.width = squareSize + "px";
                square.style.height = squareSize + "px";
                square.style.border = "solid";
                square.style.background = blankWellColor;
                holder.appendChild(square);
                nextIndex++;
            }
        }

        //generate well on screen
        for( let x = 0; x < this.width; x++)
        {
            for(let y = 0; y < this.height; y++)
            {
                let square = document.createElement("div");
                //give square an id for reference
                square.setAttribute("id", "square_x"+ x + "y" + y);
                //set square css properties
                square.style.position = "absolute";
                square.style.left = x * squareSize +"px";
                square.style.top = y * squareSize + "px";
                square.style.width = squareSize + "px";
                square.style.height = squareSize + "px";
                square.style.zIndex = 0;
                square.style.border = "solid";
                let blockType = this.well[x][y];

                switch(blockType)
                {
                    case 0: 
                        square.style.background = blankWellColor;
                    break;
                    case 1:       
                    break;
                    case 2:
                        square.style.background = wallColor; 
                    break;
                    case 3:
                        square.style.background = floorColor; 
                    break;
                    case 4:       
                    break;
                    case 5:
                        square.style.background = limitColor; 
                    break;
                    default: 
                        console.log("wrong input");
                    break;
                }
                //add square dynamiccly to page
                holder.appendChild(square);
            }
        }
        //document.body.appendChild(holder);
        let gameHolder  = document.getElementById("game-holder");
        gameHolder.appendChild(holder);
    }

    resetWell()
    {
        //reset entire well to 0
        for(let y = 0; y < this.width; y++)
        {
            this.well[y] = new Array(this.height).fill(0);
        }
        //set the side walls of well
        for(let y = 0; y < this.height; y++)
        {

            if(y < LOSELINE)
            {
                this.well[0][y] = 5;
                this.well[this.width -1][y] = 5
            }
            else
            {
                this.well[0][y] = 2;
                this.well[this.width -1][y] = 2
            }            
        }
        for(let x = 0; x < this.width; x++)
        {
            this.well[x][this.height-1] = 3;
        }
    }

    reset()
    {
        this.currentShape = this.shapes.makeRandom();
        this.nextShape = this.shapes.makeRandom();
        this.currentPos = {x:this.middleSpot,y:0};
        this.lastPos = {x:this.middleSpot,y:0}; 
             
        this.resetWell();

        let nextIndex = 0;
        for(let y = 0; y < shapeSize; y++)
        {
            for(let x = 0; x < shapeSize; x++)
            {
                let square = document.getElementById("next_"+nextIndex)
                square.style.background = blankWellColor;
                nextIndex++;
            }
        }

        for( let x = 0; x < this.width; x++)
        {
            for(let y = 0; y < this.height; y++)
            {
                let square = document.getElementById("square_x"+ x + "y" + y)
                let blockType = this.well[x][y];
                switch(blockType)
                {
                    case 0: 
                        square.style.background = blankWellColor;
                    break;   
                }
            }
        }
    }
}
 
