var sprites = {
  frog: { sx: 0, sy: 0, w: 48, h: 48, frames: 1 },
  bg: { sx: 433, sy: 0, w: 320, h: 480, frames: 1 },
  car1: { sx: 143, sy: 0, w: 48, h: 48, frames: 1 },
  car2: { sx: 191, sy: 0, w: 48, h: 48, frames: 1 },  
  car3: { sx: 239, sy: 0, w: 96, h: 48, frames: 1 },
  car4: { sx: 335, sy: 0, w: 48, h: 48, frames: 1 },
  car5: { sx: 383, sy: 0, w: 48, h: 48, frames: 1 },
  trunk: { sx: 288, sy: 383, w: 142, h: 48, frames: 1 },
  death: { sx: 0, sy: 143, w: 48, h: 48, frames: 4 }
}

var OBJECT_PLAYER = 1,
    OBJECT_CAR = 2,
    OBJECT_TRUNK = 4,
    OBJECT_WATER = 8,
    OBJECT_HOME = 16;

var startGame = function() {
  var ua = navigator.userAgent.toLowerCase();

  //Background of the game
  Game.setBoard(1, new Field());
  
  Game.setBoard(2,new TitleScreen("Frogger", 
                                  "Press Enter to start playing",
                                  playGame));
};


var Field = function() {

  this.step = function(dt) {
    this.setup('bg');
    this.x = 0;
    this.y = 0;
  };

};
Field.prototype = new Sprite();

var winGame = function() {
  /*Game.setBoard(3,new TitleScreen("You win!", 
                                  "Press Enter to start playing",
                                  playGame));*/
  if (!this.end){
    this.board.add(new TitleScreen("You win!", 
                                    "Press Enter to start playing",
                                    playGame));
    this.end = true;
  }
};

var loseGame = function() {
  /*Game.setBoard(3,new TitleScreen("You lose!", 
                                  "Press Enter to start playing",
                                  playGame));*/
  this.board.add(new TitleScreen("You lose!", 
                                  "Press Enter to start playing",
                                  playGame));
};

var playGame = function() {
  var board = new GameBoard();

  board.add(new Water());
  board.add(new Home());
  board.add(new Trunk('right', 7, 20));
  board.add(new Trunk('left', 8, 30));
  board.add(new Trunk('right', 9, 40));
  board.add(new Frog());
  board.add(new Spawner(new Car('car1', 'left', 2, 20), 8));
  //board.add(new Car('car1', 'left', 2, 20));
  board.add(new Car('car2', 'right', 4, 50));
  //board.add(new Level(level1,winGame));
  Game.setBoard(2,board);
  //Game.setBoard(5,new GamePoints(0));
};

var betweenRows = function(min, max, dt){
  if (this.row < min || this.row > max){
    console.error("You cannot put a car at this place!!");
  }
  this.y = Game.height - (this.row * this.h);

  if (this.direction == 'left' && this.x >= -this.w){
    this.x -= this.vx * dt;
  }
  else if (this.direction == 'left' && this.x < -this.w){
    this.hit(9999); //erase de car
  }
  else if (this.direction == 'right' && Game.width >= this.x){
    this.x += this.vx * dt;
  }
  else if (this.direction == 'right' && Game.width < this.x){
    this.hit(9999); //erase de car
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
      if(Game.keys['left']) { this.x -= this.maxVel; console.log("x = " + this.x);}
      else if(Game.keys['right']) { this.x += this.maxVel; console.log("x = " + this.x);}
      else if(Game.keys['up']) { this.y -= this.maxVel; console.log("y = " + this.y);}
      else if(Game.keys['down']) { this.y += this.maxVel; console.log("y = " + this.y);}
      else { this.vx = 0; }

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
    loseGame.call(this);
  }
};

/*
#####
# Car Class
##############
*/
var Car = function(sprite, direction, row, velocity){
  this.setup( sprite, { vx: velocity, direction: direction, row: row });
  this.y = 0;

  if (this.direction == 'left'){
    this.x = Game.width;
  }
  else if (this.direction == 'right'){
    this.x = -this.h;
  }
  else{
    console.error("The direction only can be left or right");
  }

};
Car.prototype = new Sprite();
Car.prototype.type = OBJECT_CAR;

Car.prototype.step = function(dt){
    betweenRows.call(this,2,5,dt);
    var frog = this.board.collide(this,OBJECT_PLAYER);
    if(frog) {
      frog.hit(9999);
      //this.board.remove(this);
    }
  };

/*
#####
# Trunk Class
##############
*/
var Trunk = function(direction, row, velocity){
this.setup( 'trunk', { vx: velocity, direction: direction, row: row });
this.y = 0;

  if (this.direction == 'left'){
    this.x = Game.width;
  }
  else if (this.direction == 'right'){
    this.x = -this.h;
  }
  else{
    console.error("The direction only can be left or right");
  }
};

Trunk.prototype = new Sprite();
Trunk.prototype.type = OBJECT_TRUNK;

Trunk.prototype.step = function(dt){
    betweenRows.call(this,7,9,dt);
  };

/*
#####
# Water Class
##############
*/
var Water = function(){
  this.x = 0;
  this.y = 48;
  this.h = 48 * 3;
  this.w = Game.width;

  this.draw = function (ctx){
    // No Sprite
  };

  this.step = function (dt){
    var frog = this.board.collide(this,OBJECT_PLAYER);
    if(frog) {
      var trunk = this.board.collide(frog,OBJECT_TRUNK);
      if (!trunk){
        frog.hit(9999);
        //this.board.remove(this);
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
# Death Class
##############
*/
var Home = function (){
  this.x = 0;
  this.y = 0;
  this.h = 48;
  this.w = Game.width;

  this.draw = function (ctx){
    // No Sprite
  };

  this.step = function (dt){
    var frog = this.board.collide(this,OBJECT_PLAYER);
    if(frog) {
      console.log("fin");
      winGame.call(frog);
    }
  }

}

Water.prototype = new Sprite();
Water.prototype.type = OBJECT_HOME;

/*
#####
# Spawner Class
##############
*/
var Spawner = function(obj, interval){
  this.interval = interval;
  this.reload = interval;
}
Spawner.prototype = new Sprite();

Spawner.prototype.draw = function(ctx){
  //No Sprite
}

Spawner.prototype.step = function(dt){
  this.reload -= dt;
  if (this.reload < 0){
    obj.create(obj.prototype);
    this.reload = interval;
  }
}

/*
#####
# Load event
##############
*/
window.addEventListener("load", function() {
  Game.initialize("game",sprites,'img/spritesFrogger.png',startGame);
});