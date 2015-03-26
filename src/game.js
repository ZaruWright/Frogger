var sprites = {
  frog: { sx: 0, sy: 0, w: 48, h: 48, frames: 3 },
  bg: { sx: 433, sy: 0, w: 320, h: 528, frames: 1 },
  bg2: { sx: 795, sy: 0, w: 837, h: 768, frames: 1 },
  car1: { sx: 143, sy: 0, w: 48, h: 48, frames: 1 },
  car2: { sx: 191, sy: 0, w: 48, h: 48, frames: 1 },  
  car3: { sx: 239, sy: 0, w: 96, h: 48, frames: 1 },
  car4: { sx: 335, sy: 0, w: 48, h: 48, frames: 1 },
  car5: { sx: 383, sy: 0, w: 48, h: 48, frames: 1 },
  bug: { sx: 96, sy: 288, w: 48, h: 48, frames: 1 },
  snake: { sx: 0, sy: 384, w: 96, h: 48, frames: 3 },
  turtle: { sx: 0, sy: 240, w: 48, h: 48, frames: 5 },
  trunk: { sx: 288, sy: 383, w: 142, h: 48, frames: 1 },
  death: { sx: 0, sy: 143, w: 48, h: 48, frames: 4 }
}

var roadObstacles = {
  radioControlLeftCar: {sprite: 'car1',  direction: 'left'},
  radioControlRightCar: {sprite: 'car5', direction: 'right'},
  truck: {sprite: 'car3', direction: 'left'},
  crawler:{sprite: 'car2', direction: 'right'},
  car:{sprite:'car4', direction: 'left'}
}

var waterObstacles = {
  slowTrunk: {sprite: 'trunk', vx:20},
  middleTrunk: {sprite: 'trunk', vx:50},
  fastTrunk: {sprite: 'trunk', vx:80}
}

var grassObstacles = {
  snake: {vx:100}
}

var turtleObstacles = {
  turtle: {vx:30}
}

var OBJECT_PLAYER = 1,
    OBJECT_CAR = 2,
    OBJECT_TRUNK = 4,
    OBJECT_WATER = 8,
    OBJECT_HOME = 16,
    OBJECT_BUG = 32,
    OBJECT_SNAKE = 64,
    OBJECT_TURTLE = 128;

/*
#####
# Data Levels
##############
*/

//[Frequency,  Blueprint, Override]
var Level1 = [

//CARS
[
  [ 5, 'radioControlRightCar', {row:2}],
  [ 5, 'radioControlLeftCar', {row:3}],
  [ 3, 'truck', {row:4}],
  [ 8, 'crawler', {row:5}]

],

//TRUNKS
[
  //[ 10, 'slowTrunk', {row:7, direction:'left'}],
  [ 3, 'fastTrunk', {row:8, direction:'right'}],
  [ 5, 'middleTrunk', {row:9, direction:'left'}]
],

//SNAKE
[
  [6, 'snake', {row:6}]
],

//TURTLE
[
  [3, 'turtle', {row:7}]
]

];

//[Frequency,  Blueprint, Override]
var Level2 = [

//CARS
[
  [ 5, 'radioControlRightCar', {row:9, vx:50}],
  [ 3, 'truck', {row:8, vx:70}],
  [ 2, 'car', {row:7, vx:75}],
  [ 9, 'crawler', {row:6, vx:100}],
  [ 5, 'car', {row:5, vx:120}],
  [ 6, 'truck', {row:4, vx:150}],
  [ 7, 'car', {row:3, vx:146}],
  [ 8, 'crawler', {row:2, vx:180}]

],

//TRUNKS
[
  //[ 10, 'slowTrunk', {row:11, direction:'left'}],
  [ 3, 'fastTrunk', {row:12, direction:'right'}],
  [ 5, 'middleTrunk', {row:13, direction:'left'}],
  [ 3, 'fastTrunk', {row:14, direction:'right', vx: 180}]
],
//SNAKE
[
  [2, 'snake', {row:10, vx:150}]
],

//TURTLE
[
  [3, 'turtle', {row:11}]
]

];



var startGame = function() {
  var ua = navigator.userAgent.toLowerCase();

  //Background of the game
  Game.setBoard(1, new Field('bg'));
  
  Game.setBoard(2,new TitleScreen("Frogger", 
                                  "Press Enter to start playing",
                                  playGame));
  Game.lifes = 3;
  Game.points = 0;
  
};


var Field = function(bg) {
  this.bg = bg;
  this.step = function(dt) {
    this.setup(this.bg);
    this.x = 0;
    this.y = 0;
  };

};

Field.prototype = new Sprite();

var winGame = function() {

  if (!Game.end && !Game.retry){
    Game.setBoardDisable(4);
    Game.lifes += 3;
    this.add(new TitleScreen("You win!", 
                                    "Press Enter to start playing",
                                    playGame));
    Game.end = true;
  }
};

var loseGame = function() {
  Game.setBoardDisable(4);
  Game.lifes = 3;
  Game.points = 0;
  this.add(new TitleScreen("You lose!", 
                                  "Press Enter to start playing",
                                  playGame));
  
};

var retry = function(){
  
  if (!Game.retry){
    Game.setBoardDisable(4);
    Game.lifes--;
    if (Game.levelNumber == 1){
      callback = playGame;
    }
    else if (Game.levelNumber == 2){
      callback = level2;
    }
    this.add(new TitleScreen("You lose! " + Game.lifes + "-UP", 
                                    "Press Enter to retry it",
                                    callback));
    Game.retry = true;
  }
  
}

var initLevel = function(levelNumber, canvasWidth, canvasHeight, bg){
  Game.end = false;
  Game.retry = false;
  Game.levelNumber = levelNumber;
  Game.changeSizeCanvas(canvasWidth, canvasHeight);
  Game.setBoard(1, new Field(bg));
}

var playGame = function() {

  //Init some variable for the level  
  initLevel(1,320,528, 'bg');

  var board = new GameBoard();

  //Create unique entities
  board.add(new Water(3));
  board.add(new Home());
  //board.add(new Turtle());
  board.add(new Frog());
  
  //Create bugs
  board.add(new Bug(2,5));
  board.add(new Bug(3,8));
  board.add(new Bug(5,5));
  

  //Spawner
  board.add(new Spawner(Level1));

  //Set some boards
  Game.setBoard(2,board);
  Game.setBoard(3,new GameHud());
  Game.setBoard(4,new GameTime(15, board));
  Game.setBoard(5,new GamePoints());
};

var level2 = function(){

  //Init some variable for the level  
  initLevel(2,837,768, 'bg2');

  var board = new GameBoard();

  //Create unique entities
  board.add(new Water(4));
  board.add(new Home());
  board.add(new Frog());

  //Create bugs
  board.add(new Bug(2,8));
  board.add(new Bug(3,9));
  board.add(new Bug(4,7)); 
  board.add(new Bug(7,6));
  board.add(new Bug(8,6));
  board.add(new Bug(10,10));
  board.add(new Bug(13,11));
  board.add(new Bug(15,7));

  //Spawner
  board.add(new Spawner(Level2));

  //Set some boards
  Game.setBoard(2,board);
  Game.setBoard(3,new GameHud());
  Game.setBoard(4,new GameTime(30, board));
  Game.setBoard(5,new GamePoints());
}


var betweenRows = function(min, max, dt){
  if (this.row < min || this.row > max){
    console.error("You cannot put this object at this place!!");
  }
  this.y = Game.height - (this.row * this.h);

  if (this.direction == 'left' && this.x >= -this.w){
    this.x -= this.vx * dt;
  }
  else if (this.direction == 'left' && this.x < -this.w){
    this.board.remove(this); //erase de object
  }
  else if (this.direction == 'right' && Game.width >= this.x){
    this.x += this.vx * dt;
  }
  else if (this.direction == 'right' && Game.width < this.x){
    this.board.remove(this); //erase de object
  }
  else{
    console.error("The direction only can be left or right", this.direction, this.x);
  }
}

/*
#####
# Frog Class
##############
*/
var Frog = function() { 
  this.setup('frog', { vx: 0, reloadTime: 0.07, reloadAnimation:0.01, maxVel: 48 });

  this.reload = this.reloadTime;
  this.reloadAnima = this.reloadAnimation;
  this.x = this.h * 3;
  this.y = Game.height - this.h;

  this.step = function(dt) {
    this.reload -= dt;
    if (this.reload < 0){

      if (Game.pressKey){
          this.animation(dt);
      }

      // If the frog arrives to home, it won't move. 
      if (!Game.end && !Game.pressKey){

        if (Game.keys['left'] || Game.keys['right'] || Game.keys['up'] || Game.keys['down']){
          this.animation(dt);
        }
        if(Game.keys['left']) { this.x -= this.maxVel; console.log("x = " + this.x);Game.pressKey = true;}
        else if(Game.keys['right']) { this.x += this.maxVel; console.log("x = " + this.x);Game.pressKey = true;}
        else if(Game.keys['up']) { this.y -= this.maxVel; console.log("y = " + this.y);Game.pressKey = true;}
        else if(Game.keys['down']) { this.y += this.maxVel; console.log("y = " + this.y);Game.pressKey = true;}
        else { this.vx = 0; }
      }

      

      // You can't go out of the limits of the screen!!
      if(this.x < 0) { this.x = 0; }
      else if(this.x > Game.width - this.w) { 
        this.x = Game.width - this.w;
      }
      else if(this.y < 0){ this.y = 0; }
      else if(this.y > Game.height - this.w){ 
        this.y = Game.height - this.w;
      }

      this.reload = this.reloadTime;
    }

  };
};

Frog.prototype = new Sprite();
Frog.prototype.type = OBJECT_PLAYER;

Frog.prototype.animation = function(dt){
  this.reloadAnima -= dt;
  if (this.reloadAnima < 0){
    this.frame++; 
    this.reloadAnima = this.reloadAnimation;
  }

  if(this.frame >= 3) {
    this.frame = 0;
    Game.pressKey = false;
  }
}
Frog.prototype.onTrunk = function (trunk, dt){
  if (trunk.direction == 'left'){
    this.x -= trunk.vx * dt;
  }
  else if (trunk.direction == 'right'){
    this.x += trunk.vx * dt;
  }
  else{
    console.error("The direction only can be left or right");
  }
};

Frog.prototype.hit = function(damage) {
  if(this.board.remove(this)) {
    this.board.add(new Death(this.x,this.y));
    if (Game.lifes > 0){
      retry.call(this.board);
    }
    else{
      loseGame.call(this.board);
    }
  }
};

/*
#####
# Car Class
##############
*/
var Car = function(blueprint, override){
  this.merge(this.baseBlueprint);
  this.setup( blueprint.sprite, blueprint);
  this.merge(override);
  this.y = 0;

  if (this.direction == 'left'){
    this.x = Game.width;
  }
  else if (this.direction == 'right'){
    this.x = -this.w;
  }
  else{
    console.error("The direction only can be left or right");
  }
};


Car.prototype = new Sprite();
Car.prototype.baseBlueprint = {vx: 100, direction: 'left', row: 2};
Car.prototype.type = OBJECT_CAR;

Car.prototype.step = function(dt){
    if (Game.levelNumber == 1){
      betweenRows.call(this,2,5,dt);
    }
    else if (Game.levelNumber == 2){
      betweenRows.call(this,2,9,dt);
    }
    var frog = this.board.collide(this,OBJECT_PLAYER);
    if(frog) {
      frog.hit();
    }
  };

/*
#####
# Trunk Class
##############
*/
var Trunk = function(blueprint, override){
  this.merge(this.baseBlueprint);
  this.setup( blueprint.sprite, blueprint);
  this.merge(override);

  this.y = 0;

  if (this.direction == 'left'){
    this.x = Game.width;
  }
  else if (this.direction == 'right'){
    this.x = -this.w;
  }
  else{
    console.error("The direction only can be left or right");
  }
};

Trunk.prototype = new Sprite();
Trunk.prototype.type = OBJECT_TRUNK;
Trunk.prototype.baseBlueprint = {vx: 30, direction: 'left', row: 7};


Trunk.prototype.step = function(dt){
  if (Game.levelNumber == 1){
    betweenRows.call(this,7,9,dt);
  }
  else if (Game.levelNumber == 2){
    betweenRows.call(this,11,15,dt);
  }

  var frog = this.board.collide(this,OBJECT_PLAYER);
    if(frog) {
      frog.onTrunk(this, dt);
    }

  };

/*
#####
# Water Class
##############
*/
var Water = function(rows){
  this.x = 0;
  this.y = 48 * 2;
  this.h = 48 * rows;
  this.w = Game.width;

  this.draw = function (ctx){
    // No Sprite
  };

  this.step = function (dt){
    var frog = this.board.collide(this,OBJECT_PLAYER);
    if(frog) {
      var trunk = this.board.collide(frog,OBJECT_TRUNK);
      var turtle = this.board.collide(frog,OBJECT_TURTLE);
      if (!trunk && !turtle){
        frog.hit();
      }
    }

  };
};

Water.prototype = new Sprite();
Water.prototype.type = OBJECT_WATER;

/*
#####
# Death Class
##############
*/
var Death = function(x,y){
  this.setup('death', { frame: 0 , reloadTime: 0.15 });
  this.x = x;
  this.y = y;
  this.reload = this.reloadTime;
}

Death.prototype = new Sprite();

Death.prototype.step = function (dt){
  this.reload -= dt;
  if (this.reload < 0){
    this.frame++; 
    this.reload = this.reloadTime;
  }

  if(this.frame >= 4) {
    this.board.remove(this);
  }
}

/*
#####
# Home Class
##############
*/
var Home = function (){
  this.x = 0;
  this.y = 48;
  this.h = 48;
  this.w = Game.width;

  this.draw = function (ctx){
    // No Sprite
  };

  this.step = function (dt){
    var frog = this.board.collide(this,OBJECT_PLAYER);
    if(frog) {
      if (Game.levelNumber == 1 && !Game.retry){
        level2();
      }
      else if (Game.levelNumber == 2 && !Game.retry){
        winGame.call(this.board);  
      }
      
    }
  }

}

Water.prototype = new Sprite();
Water.prototype.type = OBJECT_HOME;

/*
#####
# Bug Class
##############
*/
var Bug = function (column, row){
  this.setup('bug');
  
  this.w /= 2;
  this.h /= 2;

  this.x = (48 * column) + 12; 
  this.y = (48 * row) + 12;
}

Bug.prototype = new Sprite();
Bug.prototype.type = OBJECT_BUG;

Bug.prototype.step = function(dt){
  var frog = this.board.collide(this,OBJECT_PLAYER);
  if (frog){
    Game.points += 100;
    this.board.remove(this);
  }
};

/*
#####
# Snake Class
##############
*/
var Snake = function(blueprint, override){
  this.merge(this.baseBlueprint);
  this.setup( 'snake', blueprint);
  this.merge(override);
  this.y = 0;
  this.reload = this.reloadTime;

  if (this.direction == 'left'){
    this.x = Game.width;
  }
  else if (this.direction == 'right'){
    this.x = -this.w;
  }
  else{
    console.error("The direction only can be left or right");
  }
};


Snake.prototype = new Sprite();
Snake.prototype.baseBlueprint = {vx: 100, direction: 'left', row: 6, reloadTime: 0.15};
Snake.prototype.type = OBJECT_SNAKE;

Snake.prototype.step = function(dt){
    if (Game.levelNumber == 1){
      betweenRows.call(this,6,6,dt);
    }
    else if (Game.levelNumber == 2){
      betweenRows.call(this,10,10,dt);
    }
    var frog = this.board.collide(this,OBJECT_PLAYER);
    if(frog) {
      frog.hit();
    }

    this.reload -= dt;
    if (this.reload < 0){
      this.frame++; 
      this.reload = this.reloadTime;
    }

    if(this.frame >= 3) {
      this.frame = 0;
    }
  };

/*
#####
# Turtle Class
##############
*/
var Turtle = function(blueprint, override){
  this.merge(this.baseBlueprint);
  this.setup( 'turtle', blueprint);
  this.merge(override);
  this.reload = this.reloadTime;
  this.y = 0;

  if (this.direction == 'left'){
    this.x = Game.width;
  }
  else if (this.direction == 'right'){
    this.x = -this.w;
  }
  else{
    console.error("The direction only can be left or right");
  }
};

Turtle.prototype = new Sprite();
Turtle.prototype.type = OBJECT_TURTLE;
Turtle.prototype.baseBlueprint = {vx: 30, direction: 'left', row: 7, reloadTime: 0.7};


Turtle.prototype.step = function(dt){
  if (Game.levelNumber == 1){
    betweenRows.call(this,7,9,dt);
  }
  else if (Game.levelNumber == 2){
    betweenRows.call(this,11,15,dt);
  }

  this.reload -= dt;
  if (this.reload < 0){
    this.frame++; 
    this.reload = this.reloadTime;
  }

  if(this.frame >= 5) {
    this.frame = 0;
  }

  var frog = this.board.collide(this,OBJECT_PLAYER);
    if(frog) {
      if (this.frame < 4){
        frog.onTrunk(this, dt);
      }
      else{
        frog.hit();
      }
    }

  };

/*
#####
# Load event
##############
*/
window.addEventListener("load", function() {
  Game.initialize("game",sprites,'img/spritesFroggerMoreLevels.png',startGame);
});