//=============================================================================
// File:    tools.js
// Desc:    KeyTool class - tracks keyboard input using global keysDown and
//          keysUp state objects
//=============================================================================

class KeyTool
{
    // registers keydown and keyup listeners on the window
    initKeys()
    {
        window.addEventListener('keydown', (e) => { keysDown[e.keyCode] = true; });
        window.addEventListener('keyup',   (e) =>
        {
            delete keysDown[e.keyCode];
            keysUp[e.keyCode] = true;
        });
    }

    // returns true if the key is currently held down
    checkKey(aNum)
    {
        return aNum in keysDown;
    }

    // returns true once when a key is released
    // consumes the keyUp event so it only fires once per press
    checkKeyUp(aNum)
    {
        if (aNum in keysUp && !(aNum in keysDown))
        {
            delete keysUp[aNum];
            return true;
        }
        return false;
    }
}