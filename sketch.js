var bg,bgImg;
var player, shooterImg, shooter_shooting;
var zombie, zombieImg;
var bulletImg;

var heart1, heart2, heart3;
var heart1Img, heart2Img, heart3Img;

var zombieGroup;

var bullets = 70;

var gameState ="instruction"
var score = 0;
var life = 3;

function preload(){
  
  heart1Img = loadImage("assets/heart_1.png")
  heart2Img = loadImage("assets/heart_2.png")
  heart3Img = loadImage("assets/heart_3.png")
  bulletImg = loadImage("assets/bullet.png")
  shooterImg = loadImage("assets/shooter_2.png")
  shooter_shooting = loadImage("assets/shooter_3.png")
  lost=loadSound("assets/lose.mp3")
  winning=loadSound ("assets/win.mp3")
  explosionSound=loadSound ("assets/explosion.mp3")
  
  zombieImg = loadImage("assets/zombie.png")

  bgImg = loadImage("assets/bg.jpeg")

}

function setup() {

  
  createCanvas(windowWidth,windowHeight);

  //adding the background image
  bg = createSprite(displayWidth/2-20,displayHeight/2-40,20,20)
bg.addImage(bgImg)
bg.scale = 1.1
  

//creating the player sprite
player = createSprite(displayWidth-1150, displayHeight-300, 50, 50);
 player.addImage(shooterImg)
   player.scale = 0.3
   player.debug = true
   player.setCollider("rectangle",0,0,300,300)


   //creating sprites to depict lives remaining
   heart1 = createSprite(windowWidth-150,40,20,20)
   //heart1.visible = false
    heart1.addImage("heart1",heart1Img)
    heart1.scale = 0.4

    heart2 = createSprite(windowWidth-100,40,20,20)
    //heart2.visible = false
    heart2.addImage("heart2",heart2Img)
    heart2.scale = 0.4

    heart3 = createSprite(windowWidth-150,40,20,20)
    heart3.addImage("heart3",heart3Img)
    heart3.scale = 0.4
   

    //creating groups for zombies and bullets
    bulletGroup = new Group()
    zombieGroup = new Group()

    

}

function draw() {
  background(0); 
  
  
if(gameState === "fight"){
  
  
  if(life===3){
    heart3.visible = true
    heart2.visible = false
    heart1.visible = false
  }

  if(life===2){
    heart2.visible = true
    heart3.visible = false
    heart1.visible = false
  }

  if(life===1){
    heart1.visible = true
    heart2.visible = false
    heart3.visible = false
  }

  if(life===0){
    gameState="lost"
  }
  if(score==100){
    gameState="won";
    winning.play();
  }

  //moving the player up and down and making the game mobile compatible using touches
if(keyDown("UP_ARROW")||touches.length>0){
  player.y = player.y-30
}
if(keyDown("DOWN_ARROW")||touches.length>0){
 player.y = player.y+30
}


//release bullets and change the image of shooter to shooting position when space is pressed
if(keyWentDown("space")){
  bullet = createSprite(displayWidth-1150,player.y-30,20,10)
  bullet.velocityX = 20
  bullet.addImage(bulletImg)
  bullet.scale = 0.1;
  bulletGroup.add(bullet)
  player.depth = bullet.depth
  player.depth = player.depth+2
  player.addImage(shooter_shooting)
  bullets = bullets-1
}

//player goes back to original standing image once we stop pressing the space bar
else if(keyWentUp("space")){
  player.addImage(shooterImg)
}

//go to gameState "bullet" when player runs out of bullets
if(bullets==0){
  lost.play();
  gameState = "bullet"
    
}

//destroy the zombie when bullet touches it
if(zombieGroup.isTouching(bulletGroup)){
  for(var i=0;i<zombieGroup.length;i++){     
      
   if(zombieGroup[i].isTouching(bulletGroup)){
        zombieGroup[i].destroy();
        bulletGroup.destroyEach();
        explosionSound.play();

        score += 2;
        } 
  
  }
}

//destroy zombie when player touches it
if(zombieGroup.isTouching(player)){

  //gameState= "lost";
 for(var i=0;i<zombieGroup.length;i++){     
  lost.play();      
  if(zombieGroup[i].isTouching(player)){
       zombieGroup[i].destroy()

       life-=1
       } 
 
 }
}

//calling the function to spawn zombies
enemy();
}

drawSprites();
textSize(20);
  fill("white");
  text("bullets="+bullets,windowWidth-210,windowHeight /2-250);
  text("Score = " + score,windowWidth-200,windowHeight/2-220); 
  text("Lives = " + life,windowWidth-200,windowHeight/2-280);

if (gameState === "instruction") {
  strokeWeight(7);
  line(500,0,1000,1000) ;
   line.shapecolor="red"; 
  background("black")

  stroke("red");
  fill("black");
  textFont("trebuchetMS")
  textSize(50);
  text("Zombie Shooter Game", windowWidth / 2 - 300, windowHeight / 2 - 300);
  text("ENJOY THE GAME!", windowWidth / 2 - 300, windowHeight / 2 - 200);
  text("Press Space To Shoot",windowWidth/2 - 300,windowHeight /2 - 100);
  text("Press The Up Arrow Key To Move",windowWidth/2 - 300,windowHeight /2 - 50);
  text("Press The Down Arrow Key To Move",windowWidth/2 - 300,windowHeight /2  + 75);
  
  


    stroke("yellow");
    fill("yellow");
    textSize(35);
    textFont("Apple Chancery");


  if (keyDown("s")) {
    gameState =  "fight";
  }
}

//destroy zombie and player and window a message in gameState "lost"
if(gameState == "lost"){
  //background("black");
  textSize(100)
  fill("red")
  text("You Lost ",400,400)
  text("Press F5 To Try Again",475,500);
  zombieGroup.destroyEach();
  player.destroy();

}

//destroy zombie and player and display a message in gameState "won"
else if(gameState == "won"){
 
  textSize(100)
  fill("yellow")
  text("You Won ",400,400)
  zombieGroup.destroyEach();
  player.destroy();

}

//destroy zombie, player and bullets and display a message in gameState "bullet"
else if(gameState == "bullet"){
 
  textSize(50)
  fill("yellow")
  text("You ran out of bullets!!!",470,410)
  zombieGroup.destroyEach();
  player.destroy();
  bulletGroup.destroyEach();

}

}


//creating function to spawn zombies
function enemy(){
  if(frameCount%50===0){

    //giving random x and y positions for zombie to appear
    zombie = createSprite(2000,random(100,900),40,40)

    zombie.addImage(zombieImg)
    zombie.scale = 0.15
    zombie.velocityX = -3
    zombie.debug= true
    zombie.setCollider("rectangle",0,0,400,400)
   
    zombie.lifetime = 400
   zombieGroup.add(zombie)
  }

}