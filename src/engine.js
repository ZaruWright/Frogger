(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = 
          window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());
  

var Game = new function() {                                                                  
  var boards = [];
  var boardsEnable = [];

  // Game Initialization
  this.initialize = function(canvasElementId,sprite_data,sprite_image,callback) {//callback = startGame
    this.canvas = document.getElementById(canvasElementId);

    //this.playerOffset = 10;
    this.canvasMultiplier= 1;
    this.setupMobile();

    this.width = this.canvas.width;
    this.height= this.canvas.height;

    this.ctx = this.canvas.getContext && this.canvas.getContext('2d');
    if(!this.ctx) { return alert("Please upgrade your browser to play"); }

    this.setupInput();

    this.loop(); 

    if(this.mobile) {
      this.setBoard(4,new TouchControls());
    }

    SpriteSheet.load(sprite_data,sprite_image,callback);
  };

  this.changeSizeCanvas = function(width, height){
    $('canvas').attr("width", width);
    $('canvas').attr("height", height);

    this.width = width;
    this.height= height;
  };
  

  // Handle Input
  var KEY_CODES = { 37:'left', 39:'right', 32 :'fire',  13:'enter',
                    38: 'up', 40:'down'};
  this.keys = {};

  this.setupInput = function() {

    //keydown, A key is pressed down.
    window.addEventListener('keydown',function(e) { 
      if(KEY_CODES[e.keyCode]) {
       Game.keys[KEY_CODES[e.keyCode]] = true;
       e.preventDefault();
      }
    },false);

    //keyup, A key is released.
    window.addEventListener('keyup',function(e) {
      if(KEY_CODES[e.keyCode]) {
       Game.keys[KEY_CODES[e.keyCode]] = false; 
       e.preventDefault();
      }
    },false);
  };


  var lastTime = new Date().getTime();
  var maxTime = 1/30;
  // Game Loop
  this.loop = function() { 
    var curTime = new Date().getTime();
    requestAnimationFrame(Game.loop);
    var dt = (curTime - lastTime)/1000;
    if(dt > maxTime) { dt = maxTime; }

    for(var i=0,len = boards.length;i<len;i++) {
      if(boards[i] && boardsEnable[i]) { 
        boards[i].step(dt);
        boards[i].draw(Game.ctx);
      }
    }
    lastTime = curTime;
  };
  
  // Change an active game board
  this.setBoard = function(num,board) { boards[num] = board; this.setBoardEnable(num);};

  this.setBoardEnable = function(i){ boardsEnable[i] = true;};

  this.setBoardDisable = function(i){ boardsEnable[i] = false;};


  this.setupMobile = function() {
    var container = document.getElementById("container"),
        hasTouch =  !!('ontouchstart' in window),
        w = window.innerWidth, h = window.innerHeight;
      
    if(hasTouch) { this.mobile = true; }

    if(screen.width >= 1280 || !hasTouch) { return false; }

    if(w > h) {
      alert("Please rotate the device and then click OK");
      w = window.innerWidth; h = window.innerHeight;
    }

    container.style.height = h*2 + "px";
    window.scrollTo(0,1);

    h = window.innerHeight + 2;
    container.style.height = h + "px";
    container.style.width = w + "px";
    container.style.padding = 0;

    if(h >= this.canvas.height * 1.75 || w >= this.canvas.height * 1.75) {
      this.canvasMultiplier = 2;
      this.canvas.width = w / 2;
      this.canvas.height = h / 2;
      this.canvas.style.width = w + "px";
      this.canvas.style.height = h + "px";
    } else {
      this.canvas.width = w;
      this.canvas.height = h;
    }

    this.canvas.style.position='absolute';
    this.canvas.style.left="0px";
    this.canvas.style.top="0px";

  };

};


var SpriteSheet = new function() {
  this.map = { }; 

  this.load = function(spriteData,spriteImage,callback) {//callback = startGame
    this.map = spriteData;
    this.image = new Image();
    this.image.onload = callback;
    this.image.src = spriteImage;
  };

  this.draw = function(ctx,sprite,x,y,frame,dWidth, dHeight) {
    var s = this.map[sprite];
    if(!frame) frame = 0;
    if(!dWidth) dWidth = s.w;
    if(!dHeight) dHeight = s.h;

    ctx.drawImage(this.image,
                     s.sx + frame * s.w, 
                     s.sy, 
                     s.w, s.h, 
                     Math.floor(x), Math.floor(y),
                     dWidth, dHeight);
  };

  return this;
};

var TitleScreen = function TitleScreen(title,subtitle,callback) {
  var up = false;
  this.step = function(dt) {
    if(!Game.keys['enter']) up = true;
    if(up && Game.keys['enter'] && callback) callback();
  };

  this.draw = function(ctx) {
    ctx.fillStyle = "#FFFFFF";

    ctx.font = "bold 40px bangers";
    var measure = ctx.measureText(title);  
    ctx.fillText(title,Game.width/2 - measure.width/2,Game.height/2);

    ctx.font = "bold 20px bangers";
    var measure2 = ctx.measureText(subtitle);
    ctx.fillText(subtitle,Game.width/2 - measure2.width/2,Game.height/2 + 40);
  };
};


var GameBoard = function() {
  var board = this;
  

  // The current list of objects
  this.objects = [];
  this.cnt = {}; //Number of types from an object
  this.locked = false;

  // Add a new object to the object list
  this.add = function(obj) { 
    obj.board=this; 
    this.objects.push(obj); 
    this.cnt[obj.type] = (this.cnt[obj.type] || 0) + 1;
    return obj; 
  };

  // Add a new object at the begining of the object list
  this.unshift = function(obj) { 
    obj.board=this; 
    this.objects.unshift(obj); 
    this.cnt[obj.type] = (this.cnt[obj.type] || 0) + 1;
    return obj; 
  };

  // Clear the board.
  this.clearBoard = function(){
    this.objects = [];
    this.removed = [];//Esto borra de verdad??? hay recolector de basura o algo así?
  }

  // Mark an object for removal
  this.remove = function(obj) { 
    var idx = this.removed.indexOf(obj);
    if(idx == -1) {
      this.removed.push(obj); 
      return true;
    } else {
      return false;
    }
  };

  // Reset the list of removed objects
  this.resetRemoved = function() { this.removed = []; };

  // Removed an objects marked for removal from the list
  this.finalizeRemoved = function() {
    for(var i=0,len=this.removed.length;i<len;i++) {
      var idx = this.objects.indexOf(this.removed[i]);
      if(idx != -1) {
        this.cnt[this.removed[i].type]--;
        this.objects.splice(idx,1);
      }
    }
  };

  // Call the same method on all current objects 
  this.iterate = function(funcName) {
     var args = Array.prototype.slice.call(arguments,1);
     for(var i=0,len=this.objects.length;i<len;i++) {
       var obj = this.objects[i];
       obj[funcName].apply(obj,args);
     }
  };

  // Find the first object for which func is true
  this.detect = function(func) {
    for(var i = 0,val=null, len=this.objects.length; i < len; i++) {
      if(func.call(this.objects[i])) return this.objects[i];
    }
    return false;
  };

  // Call step on all objects and them delete
  // any object that have been marked for removal
  this.step = function(dt) {
    if (!this.locked){
      this.resetRemoved();
      this.iterate('step',dt);
      this.finalizeRemoved();
    }
  };

  // Draw all the objects
  this.draw= function(ctx) {
    if (!this.locked){
      this.iterate('draw',ctx);
    }
  };

  // Check for a collision between the 
  // bounding rects of two objects
  this.overlap = function(o1,o2) {
    return !((o1.y+o1.h-1<o2.y) || (o1.y>o2.y+o2.h-1) ||
             (o1.x+o1.w-1<o2.x) || (o1.x>o2.x+o2.w-1));
  };

  // Find the first object that collides with obj
  // match against an optional type
  this.collide = function(obj,type) {
    return this.detect(function() {
      if(obj != this) {
       var col = (!type || this.type & type) && board.overlap(obj,this);
       return col ? this : false;
      }
    });
  };


};

var Sprite = function() { };

Sprite.prototype.setup = function(sprite,props) {
  this.sprite = sprite;
  this.merge(props);
  this.frame = this.frame || 0;
  this.w =  SpriteSheet.map[sprite].w;
  this.h =  SpriteSheet.map[sprite].h;
};

Sprite.prototype.merge = function(props) {
  if(props) {
    for (var prop in props) {
      this[prop] = props[prop];
    }
  }
};

Sprite.prototype.draw = function(ctx) {
  SpriteSheet.draw(ctx,this.sprite,this.x,this.y,this.frame, this.w, this.h);
};

Sprite.prototype.hit = function(damage) {
  this.board.remove(this);
};



var Spawner = function(levelData,callback) {
  this.levelDataRoad = [];
  this.levelDataWater = [];
  this.levelDataSnakes = [];
  this.levelDataTurtles = [];
  this.tRoad = [];
  this.tWater = [];
  this.tSnake = [];
  this.tTurtle = [];

  this.initSpawner(0, levelData, this.levelDataRoad, this.tRoad);
  this.initSpawner(1, levelData, this.levelDataWater, this.tWater);
  this.initSpawner(2, levelData, this.levelDataSnakes, this.tSnake);
  this.initSpawner(3, levelData, this.levelDataTurtles, this.tTurtle);
  
  this.callback = callback;
};

Spawner.prototype.initSpawner = function(index, levelData, level, t){
  for (var i=0; i<levelData[index].length; ++i){
    level.push(Object.create(levelData[index][i]));
    t[i] = 0;
  }
}


Spawner.prototype.createObjects = function(type,level, t, obstacles){
  var index = 0;
  while (index < level.length){

    if (t[index] <= 0){
      this.curObstacle = level[index];

      var obstacle = obstacles[this.curObstacle[1]],
          override = this.curObstacle[2];

      if (type == 'car'){
        this.board.add(new Car(obstacle,override));
      }
      else if (type == 'water'){
        this.board.unshift(new Trunk(obstacle,override));
      }
      else if (type == 'grass'){
        this.board.add(new Snake(obstacle, override))
      }
      else if (type == 'turtle'){
        this.board.unshift(new Turtle(obstacle, override))
      }

      t[index] = this.curObstacle[0];
    }
    ++index;
  }
}

Spawner.prototype.updateTime = function(t, dt){
  for (var i=0; i < t.length; ++i){
    t[i] -= dt;
  }
}

Spawner.prototype.step = function(dt) {
  this.curObstacle = null;

  this.createObjects('car',this.levelDataRoad, this.tRoad, roadObstacles);
  this.createObjects('water',this.levelDataWater, this.tWater, waterObstacles);
  this.createObjects('grass',this.levelDataSnakes, this.tSnake, grassObstacles);
  this.createObjects('turtle',this.levelDataTurtles, this.tTurtle, turtleObstacles);
  
  this.updateTime(this.tRoad, dt);
  this.updateTime(this.tWater, dt);
  this.updateTime(this.tSnake, dt);
  this.updateTime(this.tTurtle, dt);
};

Spawner.prototype.draw = function(ctx) { };


var TouchControls = function() {

  var gutterWidth = 10;
  var unitWidth = Game.width/5;
  var blockWidth = unitWidth-gutterWidth;

  this.drawSquare = function(ctx,x,y,txt,on) {
    ctx.globalAlpha = on ? 0.9 : 0.6;
    ctx.fillStyle =  "#CCC";
    ctx.fillRect(x,y,blockWidth,blockWidth);

    ctx.fillStyle = "#FFF";
    ctx.globalAlpha = 1.0;
    ctx.font = "bold " + (3*unitWidth/4) + "px arial";

    var txtSize = ctx.measureText(txt);

    ctx.fillText(txt, 
                 x+blockWidth/2-txtSize.width/2, 
                 y+3*blockWidth/4+5);
  };

  this.draw = function(ctx) {
    ctx.save();

    var yLoc = Game.height - unitWidth;
    this.drawSquare(ctx,gutterWidth,yLoc,"\u25C0", Game.keys['left']);
    this.drawSquare(ctx,unitWidth + gutterWidth,yLoc,"\u25B6", Game.keys['right']);
    this.drawSquare(ctx,4*unitWidth,yLoc,"A",Game.keys['fire']);

    ctx.restore();
  };

  this.step = function(dt) { };

  this.trackTouch = function(e) {
    var touch, x;

    e.preventDefault();
    Game.keys['left'] = false;
    Game.keys['right'] = false;
    for(var i=0;i<e.targetTouches.length;i++) {
      touch = e.targetTouches[i];
      x = touch.pageX / Game.canvasMultiplier - Game.canvas.offsetLeft;
      if(x < unitWidth) {
        Game.keys['left'] = true;
      } 
      if(x > unitWidth && x < 2*unitWidth) {
        Game.keys['right'] = true;
      } 
    }

    if(e.type == 'touchstart' || e.type == 'touchend') {
      for(i=0;i<e.changedTouches.length;i++) {
        touch = e.changedTouches[i];
        x = touch.pageX / Game.canvasMultiplier - Game.canvas.offsetLeft;
        if(x > 4 * unitWidth) {
          Game.keys['fire'] = (e.type == 'touchstart');
        }
      }
    }
  };

  Game.canvas.addEventListener('touchstart',this.trackTouch,true);
  Game.canvas.addEventListener('touchmove',this.trackTouch,true);
  Game.canvas.addEventListener('touchend',this.trackTouch,true);

  // For Android
  Game.canvas.addEventListener('dblclick',function(e) { e.preventDefault(); },true);
  Game.canvas.addEventListener('click',function(e) { e.preventDefault(); },true);

  Game.playerOffset = unitWidth + 20;
};


var GamePoints = function() {

  var pointsLength = 8;

  this.draw = function(ctx) {
    ctx.save();
    ctx.font = "bold 18px arial";
    ctx.fillStyle= "#FFFFFF";

    var txt = "" + Game.points;
    var i = pointsLength - txt.length, zeros = "";
    while(i-- > 0) { zeros += "0"; }

    ctx.fillText(zeros + txt,10,40);
    ctx.restore();

  };

  this.step = function(dt) { };
};

var GameHud = function(text) {
  this.text = text;

  this.draw = function(ctx) {
    ctx.save();
    ctx.font = "bold 18px arial";
    ctx.fillStyle= "#FFFFFF";
    ctx.fillText(Game.lifes + "-UP",10,20);
    ctx.restore();

  };

  this.step = function(dt) { };
};

var GameTime = function(initTime, board){
  this.initTime = initTime;
  this.initBox = 200;
  this.boxSize = this.initBox;
  this.board = board;

  this.draw = function(ctx){
    ctx.fillStyle = '#00CC00';
    ctx.fillRect(Game.width - this.boxSize - 10,30,this.boxSize,15);
    /*ctx.fillStyle = '#FFFFFF';
    ctx.fillText(this.boxSize,0,60);*/
  };

  this.step = function(dt) { 
    this.boxSize -= dt * (this.initBox / this.initTime);

    if (this.boxSize < 0){
      if (Game.lifes > 0){
        retry.call(this.board);
      }
      else{
        loseGame.call(this.board);
      }
    }
  };
};