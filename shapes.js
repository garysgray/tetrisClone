//=============================================================================
// File:    shapes.js
// Desc:    Tetris piece definitions as flat 3x3 arrays
//          0 = empty, 1 = filled
//          read left to right, top to bottom
//=============================================================================

const A = [0,0,1,
           0,0,1,
           0,1,1];

const B = [1,0,0,
           1,0,0,
           1,1,0];

const C = [0,0,0,
           0,1,0,
           1,1,1];

const D = [0,0,0,
           0,1,1,
           1,1,0];

const E = [0,0,0,
           1,1,0,
           0,1,1];

const F = [1,1,0,
           1,1,0,
           0,0,0];

const G = [0,0,0,
           1,1,1,
           0,0,0];

// blank shape used to erase the current piece from its last position
const EMPTY_SHAPE = [0,0,0,
                     0,0,0,
                     0,0,0];