var trex, trex_running, trex_collided;
var ground, invisible_ground, ground_image;
var cloud, cloud_image;
var obstacle, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5;
var obstaclesGroup, clouds;
var score = 0;
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var gameOverPng, restartPng;
var gameOver, restart;
var checkpoint, die, jump;
 
function preload() {
obstacle = loadImage ("obstacle1.png");
obstacle1 = loadImage ("obstacle2.png");
obstacle2 = loadImage ("obstacle3.png");
obstacle3 = loadImage ("obstacle4.png");
obstacle4 = loadImage ("obstacle5.png");
obstacle5 = loadImage ("obstacle6.png");
trex_running = loadAnimation ("trex1.png","trex3.png","trex4.png");
trex_collided = loadImage ("trex_collided.png");
ground_image = loadImage ("ground2.png");
cloud_image = loadImage ("cloud.png");
gameOverPng = loadImage ("gameOver.png");
restartPng = loadImage ("restart.png");
checkpoint = loadSound ("checkpoint.mp3");
die = loadSound ("die.mp3");
jump = loadSound ("jump.mp3");

}

function setup() {
createCanvas(400,200);
ground = createSprite (200,180,400,20);
invisible_ground = createSprite (200,190,400,10);
invisible_ground.visible = false;
ground.addAnimation("moving",ground_image);
trex = createSprite(50,180,20,50);
trex.scale = 0.5;
trex.x = 50;
trex.addAnimation("running",trex_running);
trex.addAnimation("colliding",trex_collided);
trex.setCollider("circle",0,0,40);
trex.debug = false;
clouds = createGroup();
obstaclesGroup = createGroup();
gameOver = createSprite (200,85);
restart = createSprite (200,115);
gameOver.addAnimation ("end",gameOverPng);
gameOver.scale = 0.5;
restart.addAnimation ("again",restartPng);
restart.scale = 0.5;

}

function draw() {
  background("white");
  text("score: " + score, 300, 50);
  trex.collide(invisible_ground);
 
  if (gameState == PLAY) {

  ground.velocityX = -(10 + score/100);
  create_Cloud();
  create_Obstacles();
  score = score + Math.round(getFrameRate()/60);

  if (score>0 && score%100 === 0) {
  checkpoint.play()
  }

  if (keyDown("space") && trex.y >= 145) { 
   trex.velocityY = -10;
   jump.play();
  }
  if (ground.x <0) {
   ground.x = ground.width/2;        
  }

  gameOver.visible = false; 
  restart.visible = false;

  trex.velocityY = trex.velocityY + 0.8;

 if (obstaclesGroup.isTouching(trex)) {
  gameState = END;
  die.play();
  }
 } 

 if (gameState == END) {
  gameOver.visible = true; 
  restart.visible = true;
  trex.velocityY = 0
  ground.velocityX = 0;
  trex.changeAnimation("colliding",trex_collided);
  clouds.setLifetimeEach(-1);
  obstaclesGroup.setLifetimeEach(-1);
  clouds.setVelocityXEach(0);
  obstaclesGroup.setVelocityXEach(0);

  if (mousePressedOver(restart)) {
   reset();
  }
 }
 
 drawSprites();

}

function create_Cloud() {
  if (frameCount % 60 === 0) {
  
  cloud = createSprite (600, 100, 40, 10);
  cloud.velocityX = -2.5;
  cloud.addImage (cloud_image);
  cloud.scale = 0.5;
  cloud.y = Math.round(random(10,100));
  trex.depth = cloud.depth;
  trex.depth = trex.depth + 1;
  cloud.lifetime = 250;
  clouds.add(cloud);
  }
}

function create_Obstacles() {
  if (frameCount % 60 === 0) {

    var obstacles = createSprite (400, 165, 10, 40);
    obstacles.velocityX = -(10 + score/100);

    var cactus = Math.round(random(1,6)); 
    switch(cactus) { 
    case 1: obstacles.addImage(obstacle); 
            break; 
    case 2: obstacles.addImage(obstacle1); 
            break; 
    case 3: obstacles.addImage(obstacle2);
            break; 
    case 4: obstacles.addImage(obstacle3); 
            break; 
    case 5: obstacles.addImage(obstacle4);
            break; 
    case 6: obstacles.addImage(obstacle5); 
            break; 
    default: break;
    } 

    obstacles.scale = 0.5;
    obstacles.lifetime = 250;
    obstaclesGroup.add(obstacles);
  }
} 

function reset() {
gameOver.visible = false;
restart.visible = false;
gameState = PLAY;
obstaclesGroup.destroyEach();
clouds.destroyEach();
score = 0;
trex.changeAnimation("running",trex_running);
}

//:D