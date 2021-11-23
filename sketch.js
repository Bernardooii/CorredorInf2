var PLAY = 1;
var END = 0;
var gameState = PLAY;

var canvas;
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var UWin,UWinImg
var gameOverImg,restartImg;
var jumpSound , checkPointSound, dieSound;

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  UWinImg = loadImage("UWin.jpg");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  canvas = createCanvas(displayWidth - 20, displayHeight-30);

  trex = createSprite(50,180,20,50);
  
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  

  trex.scale = 0.5;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);

  UWin = createSprite(300,100);
  UWin.addImage(UWinImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(200,190,10000000,10);
  invisibleGround.visible = false;
  
  //criar Grupos de Obstáculos e Nuvens
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  
  trex.setCollider("rectangle",0,0,trex.width,trex.height);
  trex.debug = true
  
  score = 0;
  
}

function draw() {
  
  background(180);
  //exibir pontuação
  text("Pontuação: "+ score, 500,50);
  camera.position.x = displayWidth/2;
  camera.position.x = trex.x

  
  
  if(gameState === PLAY){
    //mover o 
    gameOver.visible = false;
    restart.visible = false;
    //mudar a animação do trex
      trex.changeAnimation("running", trex_running);
    
    ground.velocityX = 0;
    //pontuação
    score = score + Math.round(frameCount/60);
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //pular quando a barra de espaço é pressionada
    if(keyDown("space")&& trex.y >= 100) {
        trex.velocityY = -12;
        jumpSound.play();
    }
    
    //acrescentar gravidade
    trex.velocityY = trex.velocityY + 0.8
    trex.velocityX = 3;
  
    //gerar as nuvens
    spawnClouds();
  
    //gerar obstáculos no chão
    spawnObstacles();
    if(score === 5000){
      trex.velocityX = 0;
      gameState = END;
      dieSound.play();
      UWin.visible = true;
  }
    
    if(obstaclesGroup.isTouching(trex)){
        trex.velocityX = 0;
        jumpSound.play();
        gameState = END;
        dieSound.play();
        gameOver.visible = true;
    }
    UWin.visible = false;
  }
   else if (gameState === END) {
      restart.visible = true;
     //mudar a animação do trex
      trex.changeAnimation("collided", trex_collided);
       

     
      ground.velocityX = 0;
      trex.velocityY = 0
      
     
      //definir tempo de vida dos objetos do jogo para que eles nunca sejam destruídos
     obstaclesGroup.setLifetimeEach(-1);
     cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);    
   }
  
 
  //impedir que trex caia
  trex.collide(invisibleGround);
  

  drawSprites();
}




function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(600,165,10,40);
   //obstacle.velocityX = -(6 + score/100);
   obstacle.x = Math.round(random(115,3000));
   
    //gerar obstáculos aleatórios
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //atribuir escala e tempo de vida ao obstáculo           
    obstacle.scale = 0.5;
    //obstacle.lifetime = 300;
   
   //acrescentar cada obstáculo ao grupo
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //escreva o código aqui para gerar as nuvens
 if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.x = Math.round(random(0,3000));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    //cloud.velocityX = -3;
    
     //atribuir o tempo de vida da variável
    //cloud.lifetime = 200;
    
    //ajuste a profundidade
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //acrescente cada nuvem ao grupo
    cloudsGroup.add(cloud);
  }
}

