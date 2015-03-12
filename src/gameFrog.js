var sprites = {
  frog: { sx: 0, sy: 0, w: 48, h: 48, frames: 1 },
  bg: { sx: 433, sy: 0, w: 320, h: 480, frames: 1 },
  car1: { sx: 143, sy: 0, w: 48, h: 48, frames: 1 },
  car2: { sx: 191, sy: 0, w: 48, h: 48, frames: 1 },  
  car3: { sx: 239, sy: 0, w: 96, h: 48, frames: 1 },
  car4: { sx: 335, sy: 0, w: 48, h: 48, frames: 1 },
  car5: { sx: 383, sy: 0, w: 48, h: 48, frames: 1 },
  trunk: { sx: 288, sy: 383, w: 142, h: 48, frames: 1 },
  death: { sx: 0, sy: 143, w: 48, h: 48, frames: 4 },
  field: { sx: 431, sy: 0, w: 320, h: 480, frames: 1}
}

var OBJECT_PLAYER = 1;
    /*OBJECT_PLAYER_PROJECTILE = 2,
    OBJECT_ENEMY = 4,
    OBJECT_ENEMY_PROJECTILE = 8,
    OBJECT_POWERUP = 16;*/

var startGame = function() {
  var ua = navigator.userAgent.toLowerCase();

  //Background of the game
  Game.setBoard(1, new Field());
  
  Game.setBoard(2,new TitleScreen("Frogger", 
                                  "Press Enter to start playing",
                                  playGame));
};


var Field = function() {

  this.step = function(dt) {};

  this.draw = function(ctx) {
    SpriteSheet.draw(ctx, 'field', 0, 0);
  };

};

var playGame = function() {
  var board = new GameBoard();
  board.add(new Frog());
  //board.add(new Level(level1,winGame));
  Game.setBoard(2,board);
  //Game.setBoard(5,new GamePoints(0));
};

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
    /*this.reload-=dt;
    if(Game.keys['fire'] && this.reload < 0) {
      Game.keys['fire'] = false;
      this.reload = this.reloadTime;

      this.board.add(new PlayerMissile(this.x,this.y+this.h/2));
      this.board.add(new PlayerMissile(this.x+this.w,this.y+this.h/2));
    }*/
  };
};

Frog.prototype = new Sprite();
Frog.prototype.type = OBJECT_PLAYER;

Frog.prototype.hit = function(damage) {
  if(this.board.remove(this)) {
    loseGame();
  }
};






window.addEventListener("load", function() {
  Game.initialize("game",sprites,'img/spritesFrogger.png',startGame);
});