--- Frogger ---

This are the follow features that I have implemented.

* We have an scenery (with water and road) in which the frog can move.

* The frog can move in four directions, up, down, left and down. We have a variable that control that the user cannot press a buton and move the frog very fast. The frog features was implemented in the Frog class.

* We have another class called Car, in which we can create various kinds of vehicles in the road, we cannot create cars in the water that we will explain later.The cars can collide with our frog.

* The objects in our game can collide with anothers.

* Now arrives something great, the frog can jump into the trunks to reach the goal!!. We have a Trunk class in which we define its behaviour, something similir to the Car class. For do that the frog can collide with the trunk and modify its velocity in the axis x.

* The frogs as a rule lives in the water, but our frog die if collide with it, thus you be carefull!!. We have a Water class without sprite in which we do the collision with the frog.

* How I said before, our frog can die if its collide with a car or the water, and for this we have an animation when our frog dies.

* This is a game, for this we have menus and end condition. The end condition is that the frog arrives to home save and sound. We have two kinds of menus, the first is to start the game and the another we can see it when we lose the game.

* Also, we have a spawner in the our motor game. This class is responsible for create objects in the game. The objects that we can generate are trunks and vehicles.
