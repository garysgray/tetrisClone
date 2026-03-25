class KeyTool
{
    initKeys() 
        {
            window.addEventListener('keydown', function(e) 
            {
                keysDown[e.keyCode] = true;
                            
            });
        
            window.addEventListener('keyup', function(e) 
            {
                delete keysDown[e.keyCode];
                keysUp[e.keyCode] = true;			
            });	
        }
        
        checkKey(aNum)
        {	
            if(aNum in keysDown)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        checkKeyUp(aNum)
        {	
            if(aNum in keysUp && (aNum in keysDown) == false)
            {
                delete keysUp[aNum];
                return true;
            }
            else
            {
                return false;
            }
        }
}
