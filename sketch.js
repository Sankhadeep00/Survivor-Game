var bg,bgImg;
var player, shooterImg, shooter_shooting;
var zombie, zombieImg;

var heart1, heart2, heart3;
var heart1Img, heart2Img, heart3Img;

var zombieGroup;

var bullets=60;
var bulletsGroup;
var reward,rewardImg,rewardGroup;


var gameState="fight";

var loseSound,winSound,explosionSound;

var score=0;
var life=3;


function preload(){
  
  heart1Img = loadImage("assets/heart_1.png")
  heart2Img = loadImage("assets/heart_2.png")
  heart3Img = loadImage("assets/heart_3.png")

  shooterImg = loadImage("assets/shooter_2.png")
  shooter_shooting = loadImage("assets/shooter_3.png")

  rewardImg = loadImage("assets/bullet.png")

  zombieImg = loadImage("assets/zombie.png")

  bgImg = loadImage("assets/bg.jpeg")

  loseSound = loadSound("assets/lose.mp3")
  winSound = loadSound("assets/win.mp3")
  explosionSound = loadSound("assets/explosion.mp3")
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
   heart1 = createSprite(displayWidth-150,40,20,20)
   heart1.visible = false
    heart1.addImage("heart1",heart1Img)
    heart1.scale = 0.4

    heart2 = createSprite(displayWidth-100,40,20,20)
    heart2.visible = false
    heart2.addImage("heart2",heart2Img)
    heart2.scale = 0.4

    heart3 = createSprite(displayWidth-150,40,20,20)
    heart3.addImage("heart3",heart3Img)
    heart3.scale = 0.4
   

    //creating group for zombies,bullets    
    zombieGroup = new Group();

    bulletsGroup = new Group();

    rewardGroup = new Group();

}

function draw() {
  background(0); 

  if(gameState==="fight"){

    //displaying the appropriate images according to the life images
    if(life===3){
      heart3.visible=true;
      heart2.visible=false;
      heart1.visible=false;
    }
    if(life===2){
      heart3.visible=false;
      heart2.visible=true;
      heart1.visible=false;
    }
    if(life===1){
      heart3.visible=false;
      heart2.visible=false;
      heart1.visible=true;
    }
    if(life===0){
      gameState="lost";
      loseSound.play();
    }
    if(score===300){
      gameState="won";
      winSound.play();
    }

      //moving the player up and down and making the game mobile compatible using touches
      if(keyDown("UP_ARROW")||touches.length>0){
        player.y = player.y-30
      }
      if(keyDown("DOWN_ARROW")||touches.length>0){
      player.y = player.y+30
      }
      if(keyDown("LEFT_ARROW")||touches.length>0){
        player.x = player.x-30
      }
      if(keyDown("RIGHT_ARROW")||touches.length>0){
      player.x = player.x+30
      }

      if(keyWentDown("space")){
        bullet=createSprite(displayWidth-1150,player.y-30,20,10);
        bullet.velocityX=20;
        bulletsGroup.add(bullet);

        player.depth=bullet.depth;
        player.depth=player.depth+2;

        player.addImage(shooter_shooting);
        bullets=bullets-1;

        explosionSound.play();
        

      }
      
      //player goes back to original standing image once we stop pressing the space bar
        else if(keyWentUp("space")){
          player.addImage(shooterImg)
        }

        if(bullets===0){
          gameState="bullet";
          loseSound.play();
          
        }
        if(zombieGroup.isTouching(bulletsGroup)){

          for(var i=0;i<zombieGroup.length;i++){
            if(zombieGroup[i].isTouching(bulletsGroup)){
              zombieGroup[i].destroy();
              bulletsGroup.destroyEach();
              explosionSound.play();
              score=score+5;
            }
          }
        }
        //destroy zombie when player touches it
        if(zombieGroup.isTouching(player)){
        

        for(var i=0;i<zombieGroup.length;i++){     
              
          if(zombieGroup[i].isTouching(player)){
              zombieGroup[i].destroy()
              life=life-1;

              } 
        }

        
        }
        if(rewardGroup.isTouching(player)){

          for(var i=0;i<rewardGroup.length;i++){

            if(rewardGroup[i].isTouching(player)){
              rewardGroup[i].destroy()
              bullets=bullets+5;
            }
          }
        }
        
        //change gamestate =won when the reaches the end of the canvas
        if(player.x>=displayWidth-21){
          gameState="won";
        }
        //calling the function to spawn zombies and rewards
        enemy();
        spawnRewards(rewardImg);
        spawnRewards(heart1Img);
}

drawSprites();

//displaying scores and bullets

textSize(20)
fill("yellow")
text("SCORE= "+score,1180,100)
text("BULLETS= "+bullets,1180,120)

if(gameState==="lost"){

  textSize(100);
  fill("red");
  text("YOU LOST!!",400,400);
  zombieGroup.destroyEach();
  player.destroy();

}

else if(gameState==="won"){

  textSize(100);
  fill("white");
  text("YOU WON!!",400,400);
  zombieGroup.destroyEach();
  player.destroy();

}

else if(gameState==="bullet"){

  textSize(60);
  fill("orange");
  text("YOU RAN OUT OF BULLETS!!",470,410);
  zombieGroup.destroyEach();
  player.destroy();
  bulletsGroup.destroyEach();

}

}
//creating function to spawn zombies and rewards
function enemy(){
  if(frameCount%50===0){

    //giving random x and y positions for zombie to appear
    zombie = createSprite(random(500,1100),random(100,500),40,40)

    zombie.addImage(zombieImg)
    zombie.scale = 0.15
    zombie.velocityX = -3
    zombie.debug= true
    zombie.setCollider("rectangle",0,0,400,900)
   
    zombie.lifetime = 400
   zombieGroup.add(zombie)
  }



}

function spawnRewards(rewardImg){
  if(frameCount%150===0){

    //giving random x and y positions for zombie to appear
     reward=createSprite(random(500,1100),random(100,500),40,40)

     
     reward.addImage(rewardImg)
     reward.scale = 0.09
     reward.velocityX = -3
     reward.debug= true
     reward.setCollider("rectangle",0,0,400,900)
   
     reward.lifetime = 400
     rewardGroup.add(reward)

  }



}


