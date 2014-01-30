var MAP = [
        1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
        1,0,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,0,1,1,
        1,0,0,0,1,1,1,0,1,1,0,0,0,1,1,1,1,0,0,1,
        1,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,1,1,0,1,
        1,0,0,0,0,0,1,1,1,1,0,0,1,1,1,0,1,1,0,1,
        1,0,0,0,0,0,1,1,1,0,0,1,1,1,1,0,1,1,0,1,
        1,0,0,0,0,0,1,1,1,0,0,1,1,1,1,0,1,1,0,1,
        1,1,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,1,
        1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,0,1,1,1,
        1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,
        1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,
        1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
        ];



// <- 37 ^ 38 -> 39 v 40

var KEYLEFT =   37;
var KEYUP   =   38;
var KEYRIGHT=   39;
var KEYDOWN =   40;

var IDXLEFT =   0;
var IDXUP   =   1;
var IDXRIGHT=   2;
var IDXDOWN =   3;

var P       =   1.0;
var D       =   0.5;
var XWIN    =   640;
var YWIN    =   480;
var PAS     =   0.1;
var PASC    =   0.1;
var ANG     =   Math.PI / 15; // in
var curmap  =   new Map(MAP);
var wolf    =   new Engine(curmap);

function Map(m)
{
    this.wcolor;
    this.map = m;
    
    this.nbcol = -1;
    while (this.map[this.nbcol + 1] == '1')
        this.nbcol++;
    this.nblin = this.map.length  / this.nbcol;
}

function Engine(map)
{
    this.x_pos_s = D;
    this.y_pos_s; // will change depending on the col
    this.mx      = 1.5;
    this.my      = 1.5;
    this.ang     = Math.PI / 2;
    this.map     = curmap;

    // murs
    this.prevwx;
    this.prevwy;
    this.wx;
    this.wy;

    // canvacs 2D context
    this.context;

    // vector director coord
    this.vx;
    this.vy;

    // values of the wall and the sky
    this.mur;
    this.sym;

    // key
    this.keys = [0,0,0,0];
}

//--------------------------------------------
// CALC FUNCTIONS
//--------------------------------------------

function    is_wall(x, y)
{
    var iX = parseInt(x);
    var iY = parseInt(y);
    var pos = iX + iY * wolf.map.nbcol;
    //console.log("POS["+iX+"]["+iY+"] =" + MAP[pos]);
    return MAP[pos];
}


function    find_vector_director(i)
{
    wolf.y_pos_s = (P * ((XWIN / 2) - i)) / XWIN;
    wolf.vx = (wolf.x_pos_s * Math.cos(wolf.ang)) - (wolf.y_pos_s * Math.sin(wolf.ang));
    wolf.vy = (wolf.x_pos_s * Math.sin(wolf.ang)) + (wolf.y_pos_s * Math.cos(wolf.ang));
}

function    setWallColor()
{
 if (Math.floor(wolf.prevwx) == Math.floor(wolf.wx))
    {
      if (Math.floor(wolf.prevwy) > Math.floor(wolf.wy))
        wolf.map.wcolor = "#00f";
      else
        wolf.map.wcolor = "#0f0";
    }
  else if (Math.floor(wolf.prevwy) == Math.floor(wolf.wy))
    {
      if (Math.floor(wolf.prevwx) > Math.floor(wolf.wx))
        wolf.map.wcolor = "#FFD700";
      else
        wolf.map.wcolor = "#f0f";
    }
}

function    find_intersection()
{
  var       k;

  k = 0;
  while (1)
    {
      wolf.wx = wolf.mx + k * wolf.vx;
      wolf.wy = wolf.my + k * wolf.vy;
      if (is_wall(wolf.wx, wolf.wy))
        {
          setWallColor();
          return (k);
        }
      k += 0.05;
      wolf.prevwx = wolf.wx;
      wolf.prevwy = wolf.wy;
    }
  return (k);
}

//--------------------------------------------
// DRAW FUNCTIONS
//--------------------------------------------

function drawscreen()
{
  var i = 0;
  var k;
  var tmpmur;

  while (i < XWIN)
    {
      find_vector_director(i);
      k = find_intersection();
      tmpmur = 480 / (2 * k);
      wolf.mur = Math.floor(tmpmur) * 2;
      wolf.sym = (YWIN - wolf.mur) / 2;
      raycast(i);
      i++;
    }
}

function raycast(i)
{
    wolf.context.fillStyle = "#fff";
    wolf.context.fillRect(i, 0, 1, wolf.sym);
    wolf.context.fillStyle = wolf.map.wcolor;
    wolf.context.fillRect(i, wolf.sym, 1, wolf.sym + wolf.mur);
    wolf.context.fillStyle = "#000";
    wolf.context.fillRect(i, wolf.sym + wolf.mur, 1, YWIN);
}

//--------------------------------------------
// MANAGE KEYBOARD FUNCTIONS
//--------------------------------------------



function goLeft()
{
    wolf.ang += ANG;
}

function goRight()
{
    wolf.ang -= ANG;
}

function goUp()
{
  var a;
  var b;

  a = wolf.mx + PASC * Math.cos(wolf.ang);
  b = wolf.my + PASC * Math.sin(wolf.ang);
  if (is_wall(a, b) == 0)
    {
      wolf.mx += PAS * Math.cos(wolf.ang);
      wolf.my += PAS * Math.sin(wolf.ang);
    }
}

function goDown()
{
  var a;
  var b;

  a = wolf.mx - PASC * Math.cos(wolf.ang);
  b = wolf.my - PASC * Math.sin(wolf.ang);
  if (is_wall(a, b, wolf) == 0)
    {
      wolf.mx -= PAS * Math.cos(wolf.ang);
      wolf.my -= PAS * Math.sin(wolf.ang);
    }
}

// <- 37 ^ 38 -> 39 v 40

function manageKeyboard(e)
{
    var flag = 1;
    if (e.type == 'keyup')
        flag = 0;
    switch (e.keyCode)
    {
        case KEYLEFT:
            wolf.keys[IDXLEFT] = flag;
            break;
        case KEYUP:
            wolf.keys[IDXUP] = flag;
            break;
        case KEYRIGHT:
            wolf.keys[IDXRIGHT] = flag;
            break;
        case KEYDOWN:
            wolf.keys[IDXDOWN] = flag;
            break;
    }
}

//--------------------------------------------
// INIT FUNCTIONS
//--------------------------------------------

function processKeyboard()
{
    if (wolf.keys[IDXLEFT] != wolf.keys[IDXRIGHT])
    {
        if (wolf.keys[IDXLEFT])
            goLeft();
        if (wolf.keys[IDXRIGHT])
            goRight();
    }
    if (wolf.keys[IDXUP] != wolf.keys[IDXDOWN])
    {
        if (wolf.keys[IDXUP])
            goUp();
        if (wolf.keys[IDXDOWN])
            goDown();
    }
}

function gameLogic()
{
    processKeyboard();
    drawscreen();
}

function main()
{ 
    init();
    gameLogic();
    setInterval(gameLogic,6);
}


function init()
{
  var elem = document.getElementById('main');
  if (!elem || !elem.getContext) {
    return;
  }

// Get the canvas 2d context.
  wolf.context = elem.getContext('2d');
  if (!wolf.context) 
  {
    return;
  }
}

window.addEventListener('load', main, false);
window.addEventListener('keyup', manageKeyboard, false);
window.addEventListener('keydown', manageKeyboard, false);
