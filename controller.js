class Controller
{
    constructor()
    {
        this.game = new Game(WIDTH,HEIGHT);
        this.keyTool = new KeyTool();
        this.keyTool.initKeys();
        this.framRate = SLOW_RATE;
    }

    checkCollision(dir,currentShape,currentPos,aWell)
    {
        let index=0;
        let posX = currentPos.x;
        let posY = currentPos.y;
        let tempCurrent = currentShape;

        switch(dir)
        {
            case 0: //left
                posX--;
            break;
            case 1://right
                posX++;
            break;
            case 2: //down
                posY++;
            break;
            default: 
                console.log("no collison check");
            break;
        }

        for(let y = posY;y < posY+shapeSize;y++)
        {
            for(let x = posX;x < posX+shapeSize;x++,index++)
            {
                if(tempCurrent[index] == blockType.SHAPE && aWell[x][y] != blockType.EMPTY)
                {
                    return true;
                }
            }
        }
        return false;
    }

    checkRotation(dir,currentShape,currentPos,aWell)
    {
        let index=0;
        let posX = currentPos.x;
        let posY = currentPos.y;
        let tempShape = currentShape;

        switch(dir)
        {
            case 0: //left rotation
                tempShape = this.rotateLeft(tempShape)
            break;
            case 1: //right rotation
                tempShape = this.rotateRight(tempShape)
            break;  
        }

        for(let y = posY;y < posY+shapeSize;y++)
        {
            for(let x = posX;x < posX+shapeSize;x++,index++)
            {
                if(tempShape[index] == blockType.SHAPE && aWell[x][y] != blockType.EMPTY)
                {
                    return true;
                }
            }
        }
        return false;
    }

    rotateRight(nums)
    {
        let size = Math.sqrt(nums.length);
        let results = [];

        for (let i = 0; i < size; ++i)
        {
            for (let j = 0; j < size; ++j)
            {
                results.push(nums[(size - j - 1) * size + i]);
            }
        }
        return results;
    }

    rotateLeft(nums)
    {
        let size = Math.sqrt(nums.length);
        let results = [];
        for(let i = 0; i < size;  i++)
        {
            for(let j = 0; j < size; j++)
            {
            results.push(nums[((j *size)+(size-1))-i]) ;
            }
        }
        return results;
    }

    //draw the next piece that will fall on side of well where player can see it
    drawNext(shape)
    {
        //we get passed in a shape array that we index thru
        //to get block type 
        for(let i = 0; i < shape.length; i++)
        {
            //we then get the html square element by using the
            //next_ index and change its color based on block type
            let square = document.getElementById("next_"+ i);
            if(shape[i] == blockType.EMPTY)
            {
                square.style.backgroundColor = blankWellColor;
            }
            else
            {
                square.style.backgroundColor = shapeColor;
            }
        }
    }

    //draw the current piece falling that user has control of
    drawShape(shape,startPosX,startPosY,aWell)
    {   
        //use this to go thru shape array to get block type(color)
        let shapeIndex = 0;
        //we use the currentPos to get a start point to map out shape on well
        for(let y = startPosY; y < startPosY+shapeSize; y++)
        {
            for(let x = startPosX; x < startPosX+shapeSize;x++,shapeIndex++)
            {
                //we get a hold of html element by using the x,y postion index 
                let square = document.getElementById("square_x"+x+"y"+y)
                let tempType = shape[shapeIndex];

                //if well block is empty and shape block is empty 
                if(aWell[x][y] == blockType.EMPTY && tempType == blockType.EMPTY  )
                {
                    //color it black
                    square.style.backgroundColor  = blankWellColor; 
                }
                //if well block is empty and shape segment is blue
                if(aWell[x][y] == blockType.EMPTY &&  tempType == blockType.SHAPE )
                {
                    //color it blue
                    square.style.backgroundColor  = shapeColor;
                }              
            }        
        }
    }

    drawShapes()
    {
        //erase old position by drawing EMPTY_SHAPE array
        this.drawShape(EMPTY_SHAPE,this.game.lastPos.x,this.game.lastPos.y,this.game.well);
        //draw the players next block on side
        this.drawNext(this.game.nextShape);
        //draw the player block
        this.drawShape(this.game.currentShape,this.game.currentPos.x,this.game.currentPos.y,this.game.well); 
    }

    pasteBlock(aCurrentShape,aWell)
    {
        let shapeIndex = 0;
        for(let y = this.game.currentPos.y; y < this.game.currentPos.y+shapeSize; y++)
        {
            for(let x = this.game.currentPos.x; x < this.game.currentPos.x+shapeSize; x++ ,shapeIndex++)
            {
                let square = document.getElementById("square_x"+x+"y"+y)
                if(aCurrentShape[shapeIndex] == blockType.SHAPE)
                {
                    aWell[x][y] = blockType.FILL;
                    square.style.backgroundColor  = fillColor;
                }     
            }           
        } 
    }

    updateFallingBlock()
    {
        if(this.checkCollision(dir.DOWN,this.game.currentShape,this.game.currentPos,this.game.well))
        {  
            this.pasteAndUpdateWell(this.game.width,this.game.height,this.game.currentShape,this.game.well);

            //check what height last paste was, if to high game over
            if(this.game.currentPos.y < LOSELINE)
            {
                this.game.gameState = gameStates.LOSE;
            }
            //set new current shape in middle of well
            this.game.currentShape = this.game.nextShape;      
            this.game.currentPos = {x:this.game.middleSpot,y:0};
            this.game.nextShape = this.game.shapes.makeRandom();
        }
        else
        {
            this.game.currentPos.y +=1;
        }           
    }

    pasteAndUpdateWell(aWidth,aHeight,aCurrentShape,aWell)
    {
        
        this.pasteBlock(aCurrentShape,aWell);

        let filledFloors = false;
        let rowData = [];
        let placeHolder = [];
        for(let y = 0; y < aHeight-1; y++)
        {
            for(let x = 0; x < aWidth; x++)
            {
                rowData[x] = aWell[x][y];  
            }
            if(rowData.includes(0))
            {
                placeHolder.push([...rowData]);
            }
            else
            {
                filledFloors = true;
                for(let x = 1; x < aWidth-1; x++)
                {      
                    aWell[x][y] = 0;
                    let square =document.getElementById("square_x"+x+"y"+y);
                    square.style.backgroundColor = blankWellColor;  
                }    
            }   
        }

        if(filledFloors)
        {
            for(let y = placeHolder.length; y > 0; y--)
            {
                let row = placeHolder[y-1];
                for(let x = 1; x < aWidth -1; x++)
                {
                    aWell[x][y] = row[x];
                    let square =document.getElementById("square_x"+x+"y"+y);
                    if(aWell[x][y] == blockType.EMPTY)
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

    updateGame(dt)
    {
        this.updateKeys();
        this.updateLogic();
        this.updateRender();
        
        //have to update here or it wont erase correctly (timing)
        //may need to fix
        this.game.updateLastPos();
    }
    
    updateLogic()
    {
        switch(this.game.gameState)
        {
            case 0://INIT
                this.game.initGame();
                this.game.gameState = gameStates.PLAY; 
            break;
            case 1://PLAY
                this.framRate = FRAME_RATE;
                this.updateFallingBlock();
            break;
            case 2://PAUSE
                this.framRate = SLOW_RATE;
            break;
            case 3://WIN      
            break;
            case 4://LOSE
                this.framRate = SLOW_RATE;
            break;
            case 5://RESET
                this.framRate = SLOW_RATE;
                this.game.reset();
                this.game.gameState = gameStates.PLAY;
            break;
            default: 
                console.log("no input");
            break; 
        }
    }
    updateRender()
    {
        switch(this.game.gameState)
        {
            case 0://INIT
                document.getElementById("status").innerHTML = "LOADING....";
            break;
            case 1://PLAY     
                this.drawShapes();
                document.getElementById("keys").innerHTML = "<li>Arrow Keys = Move;<li/> <li>Z,X = Rotate;</li> P = Pause; R = Reset;"; 
                document.getElementById("status").innerHTML = "";       
            break;
            case 2://PAUSE
                document.getElementById("keys").innerHTML = "<li> P = Unpause;</li><li> R = Reset;<li/>"; 
                document.getElementById("status").innerHTML = "GAME-PAUSED";
                
            break;
            case 3://WIN
                document.getElementById("status").innerHTML = "YOU FUCKING WON!!!!!!!!!"; 
            break;
            case 4://LOSE
                //erase last player block with EMPTY_SHAPE array
                this.drawShape(EMPTY_SHAPE,this.game.lastPos.x,this.game.lastPos.y,this.game.well);
                document.getElementById("status").innerHTML = "<li>GAME-OVER!</li><li>:( :( :(</li> R = Reset;";
                document.getElementById("keys").innerHTML = "";
            break;
            case 5://RESET
                document.getElementById("status").innerHTML = "RESET THAT SHIT";
            break;
            default: 
                console.log("no input");
            break; 
        }
    }
    updateKeys()
    {
        switch(this.game.gameState)
        {
            case 1://PLAY
                
                if(this.keyTool.checkKey(37))//move left
                {
                    if(!this.checkCollision(dir.LEFT,this.game.currentShape,this.game.currentPos,this.game.well))
                        this.game.currentPos.x -= 1;
                }
                else if(this.keyTool.checkKey(39))//move right
                {
                    if(!this.checkCollision(dir.RIGHT,this.game.currentShape,this.game.currentPos,this.game.well))
                    this.game.currentPos.x += 1;
                }          
                else if(this.keyTool.checkKey(40))//going down
                {
                    if(!this.checkCollision(dir.DOWN,this.game.currentShape,this.game.currentPos,this.game.well))
                    this.game.currentPos.y += 1; 
                }          
                else if(this.keyTool.checkKeyUp(90)) //rotate left
                {
                    if(!this.checkRotation(dir.LEFT,this.game.currentShape,this.game.currentPos,this.game.well))
                    this.game.currentShape = this.rotateLeft(this.game.currentShape);
                }                      
                else if(this.keyTool.checkKeyUp(88))//rotate right
                {
                    if(!this.checkRotation(dir.RIGHT,this.game.currentShape,this.game.currentPos,this.game.well))
                    this.game.currentShape = this.rotateRight(this.game.currentShape);
                } 
                else if(this.keyTool.checkKeyUp(80))//pause
                {
                    this.game.gameState = gameStates.PAUSE;
                } 
                else if(this.keyTool.checkKeyUp(82))//reset
                {
                    this.game.gameState = gameStates.RESET;
                }                                           
            break;
            case 2://PAUSE
                if(this.keyTool.checkKeyUp(80))
                {
                    this.game.gameState = gameStates.PLAY;
                } 
                else if(this.keyTool.checkKeyUp(82))//reset
                {
                    this.game.gameState = gameStates.RESET;
                }    
            break;
            case 3://WIN    
            break;
            case 4://LOSE
                if(this.keyTool.checkKeyUp(82))//reset
                {
                    this.game.gameState = gameStates.RESET;
                }      
            break;
            default: 
                console.log("no input");
            break; 
        }
    }
}

