var sprites = {
  frog: { sx: 0, sy: 0, w: 48, h: 48, frames: 1 },
  bg: { sx: 433, sy: 0, w: 320, h: 528, frames: 1 },
  bg2: { sx: 795, sy: 0, w: 837, h: 768, frames: 1 },
  car1: { sx: 143, sy: 0, w: 48, h: 48, frames: 1 },
  car2: { sx: 191, sy: 0, w: 48, h: 48, frames: 1 },  
  car3: { sx: 239, sy: 0, w: 96, h: 48, frames: 1 },
  car4: { sx: 335, sy: 0, w: 48, h: 48, frames: 1 },
  car5: { sx: 383, sy: 0, w: 48, h: 48, frames: 1 },
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

var OBJECT_PLAYER = 1,
    OBJECT_CAR = 2,
    OBJECT_TRUNK = 4,
    OBJECT_WATER = 8,
    OBJECT_HOME = 16;

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
  [ 10, 'slowTrunk', {row:7, direction:'left'}],
  [ 3, 'fastTrunk', {row:8, direction:'right'}],
  [ 5, 'middleTrunk', {row:9, direction:'left'}]
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
  [ 10, 'slowTrunk', {row:11, direction:'left'}],
  [ 3, 'fastTrunk', {row:12, direction:'right'}],
  [ 5, 'middleTrunk', {row:13, direction:'left'}],
  [ 3, 'fastTrunk', {row:14, direction:'right', vx: 180}]
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

  if (!this.end){
    Game.lifes += 3;
    this.add(new TitleScreen("You win!", 
                                    "Press Enter to start playing",
                                    playGame));
    this.end = true;
  }
};

var loseGame = function() {
  Game.lifes = 3;
  this.add(new TitleScreen("You lose!", 
                                  "Press Enter to start playing",
                                  playGame));
  
};

var retry = function(){

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
  
}

var playGame = function() {
  Game.changeSizeCanvas(320,528);
  Game.setBoard(1, new Field('bg'));
  var board = new GameBoard();
  Game.levelNumber = 1;

  board.add(new Water(3));
  board.add(new Home());
  board.add(new Frog());
  board.add(new Spawner(Level1));
  Game.setBoard(2,board);
  Game.setBoard(3,new GameHud());
  //Game.setBoard(4,new GameTime(2, board));
};

var level2 = function(){
  Game.changeSizeCanvas(837,768);
  Game.setBoard(1, new Field('bg2'));

  var board = new GameBoard();
  Game.levelNumber = 2;

  board.add(new Water(4));
  board.add(new Home());
  board.add(new Frog());
  board.add(new Spawner(Level2));
  Game.setBoard(2,board);
  Game.setBoard(3,new GameHud());
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
  this.setup('frog', { vx: 0, reloadTime: 0.15, maxVel: 48 });

  this.reload = this.reloadTime;
  this.x = this.h * 3;
  this.y = Game.height - this.h;

  this.step = function(dt) {
    this.reload -= dt;
    if (this.reload < 0){

      // If the frog arrives to home, it won't move. 
      if (!this.end){
        if(Game.keys['left']) { this.x -= this.maxVel; console.log("x = " + this.x);}
        else if(Game.keys['right']) { this.x += this.maxVel; console.log("x = " + this.x);}
        else if(Game.keys['up']) { this.y -= this.maxVel; console.log("y = " + this.y);}
        else if(Game.keys['down']) { this.y += this.maxVel; console.log("y = " + this.y);}
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

    var trunk = this.board.collide(this,OBJECT_TRUNK);
    if(trunk) {
      this.onTrunk(trunk, dt);
    }

  };
};

Frog.prototype = new Sprite();
Frog.prototype.type = OBJECT_PLAYER;

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
      if (!trunk){
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
      if (Game.levelNumber == 1){
        level2();
      }
      else if (Game.levelNumber == 2){
        winGame.call(this.board);  
      }
      
    }
  }

}

Water.prototype = new Sprite();
Water.prototype.type = OBJECT_HOME;

/*
#####
# Load event
##############
*/
window.addEventListener("load", function() {
  Game.initialize("game",sprites,'img/spritesFroggerMoreLevels.png',startGame);
});