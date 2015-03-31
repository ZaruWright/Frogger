If you want to play this game, click in the follow link: http://rawgit.com/ZaruWright/Frogger/master/index.html

=== Frogger ===

This are the follow features that I have implemented.

* We have an scenery (with water and road) in which the frog can move.

* The frog can move in four directions, up, down, left and down. We have a variable that controls the user cannot press a buton and move the frog very fast. The frog features was implemented in the Frog class.

* We have another class called Car, in which we can create various kinds of vehicles in the road, we cannot create cars in the water that we will explain later.The cars can collide with our frog.

* The objects in our game can collide with anothers. For example the Trunk class, in the step method, We check if our frog collide with a trunk for go up on it.

* Now arrives something great, the frog can jump into the trunks to reach the goal!!. We have a Trunk class in which we define its behaviour, something similar to the Car class. For do that the frog can collide with the trunk and modify its velocity in the axis x depends on the direction of the trunk.

* The frogs as a rule lives in the water, but our frog die if collide with it, thus you be carefull!!. We have a Water class without sprite in which we do the collision with the frog.

* How I said before, our frog can die if its collide with a car or the water, and for this we have an animation when our frog dies in the step method of the Death class.

* This is a game, for this we have menus and end condition. The end condition is that the frog arrives to home save and sound. We have two kinds of menus, the first is to start the game and the another we can see it when we lose the game.

* Also, we have a spawner in the our motor game. This class is responsible for create objects in the game. The objects that we can generate are trunks and vehicles. Also we could create snakes and turtles that we explain later.

=== Improvements ===

When I finished to do the game, I thought that I could do a improve of the game. Thus I done it. Now I explain the other features that I done to complete the game.

* As one level seemed poor I'll do another to know how to do it. For this, I created the level2 function that will be called when the frog arrives to the home. The game finished when the frog arrives to the home of the second level, but you can continue playing again.

* Now the frog has lifes, specific the frog has three lifes when start the game. The frog lose a life when collide with a car, the water, a snake or when the turtle dive under water. This is implemented with a variable called Game.lifes. If you die in the second level and you have lifes, you can retry the game in that level, in the second in this case. To show this on the screen, we have a GameHud in the motor game.

* As we have lifes and the possibility of retry a level, we have a new tittle screen called retry that shows us when the frogs dies and it has lifes yet.

* The game has time to finish the level.This is the green bar in the top right corner of the screen. We can see the code in the GameTime class of the motor game. 

* Normally the games have points and for this I implemented a Bug class. If the frog collide with a bug, you will have 100 point more in your score. Also to see the score in the screen, we have a GamePoints function in the motor game.

* Finally I added two new kinds of enemies/obstacles, they are: snakes and turtles. The snake is implemented in the Snake class. The snakes are similar to the cars, but the snakes only can move in the purple grass and has an animation to move it. For the other things, snakes and cars are equals. The turtle is implemented in the Turtle class. The turtles are similar to the trunks, the difference are that a turtle has an animation and if the frog go up on the turtle and the turtle dive under water, then the frog dies. For the other features, trunks and turtles are equals.


=== In the future... ===

I know that the original game has a lot of functionalities that I cannot implement. For this, if some day I am bored, I think that the best feature that I can do is do the game to two players. I think that this can be fun.

The other thing that I'd like to do, it would be improve the motor game. I don't know a lot of the motors game yet, but I like to do it more abstract to I can do a lot of games for this type. 

Well, I hope that you like this game and you learn something about this code.

Bye!
