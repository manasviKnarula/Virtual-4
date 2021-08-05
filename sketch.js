var dog,dogImg,happyDogImg;
var foodStock, foodS;
var database;
var feed,addFood;
var lastFed,CurrentTime;
var foodObj;
var garden,washroom,readState,Bedroom;
var gamestate="hungry";

function preload()
{
  happyDogImg = loadImage("images/dogImg1.png");
  dogImg= loadImage("images/dogImg.png");
  Bedroom=loadImage("images/Bed Room.png");
  washroom=loadImage("images/Wash Room.png");
  garden=loadImage("images/Garden.png");
}

function setup() {
  createCanvas(1000, 600);
  database = firebase.database();
  dog = createSprite(700,300);
  dog.addImage("dog",dogImg);
  dog.scale =0.5;
  
  feed=createButton("Feed the dog"); 
  feed.position(350,95); 
  feed.mousePressed(feedDog); 

  addFood=createButton("Add Food"); 
  addFood.position(450,95); 
  addFood.mousePressed(addFoods);   

  foodStock = database.ref('Food');
  foodStock.on("value",function(data){
    foodS = data.val();
  })
  foodObj = new Food();

  fedTime = database.ref('time');
  fedTime.on("value",function(data){
    lastFed = data.val();
  });
  readState = database.ref('gamestate');
  readState.on("value",function(data){
    gamestate = data.val();
  });
}




function draw() {  
  background(46,139,87);

  foodObj.display();
  writeStock(foodS);

  if(foodS ==0){
    dog.addImage(happyDog);
    milkbotltle2.visible=false
    }  else{
      dog.addImage(sadDog);
      milkBotltle2.visible=true;
    }

  fill("white");
  textSize(30);
 
  text("Food left:" + foodS,200,500);
  drawSprites();
  
  foodObj.display();
  fill(255,255,254); 
  textSize(15); 
  currentTime=hour();
  if(currentTime==(lastFed+1)){ 
    update("playing");
    foodObj.garden();
  }else if(currentTime==(lastFed+2)){ 
    update("sleeping");
    foodObj.bedroom();
  }
  else if(currentTime>(lastFed+2)&&currentTime<=(lastFed+4)){ 
    update("bathing");
    foodObj.washroom();
  }
  else{ 
    update("hungry");
    foodObj.display();
  } 
  if (gamestate!="hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
  }
  else{
    feed.show();
    addFood.show();
    dog.addImage(dogImg);
  }



  if (gamestate === 1){
    dog.addImage(happyDog);
    dog.scale=0.175;
    dog.y=250
  }

  if (gamestate === 2){
    dog.addImage(sadDog);
    dog.scale=0.175
    milkBotltle2.visible=false;
    dog.y=250
  }

  var bath=createButton("I want to take a bath");
  bath.position(580,125);
  if(bath.mousePressed(function(){
    gameState=3
    database.ref("/").update({"gameState":gameState});
  }));
  if (gameState===3){
    dog.addImage(washroom);
    dog.scale=1;
    milkBotltle2.visible=false
  }

  var Sleep=createButton("I am so sleepy");
  Sleep.position(710,125);
  if(Sleep.mousePressed(function(){
    gameState=4
    database.ref("/").update({"gameState":gameState});
  }));
  if (gameState===4){
    dog.addImage(bedroom);
    dog.scale=1;
    milkBotltle2.visible=false
  }

  var Play =createButton("Let's Play");
  Play.position(500,160);
  if(Play.mousePressed(function(){
    gameState=5
    database.ref("/").update({"gameState":gameState});
  }));
  if (gameState===5){
    dog.addImage(livingroom);
    dog.scale=1;
    milkBotltle2.visible=false
  }

  var PlayInGarden =createButton("Let's Play in park");
  PlayInGarden.position(500,160);
  if(PlayInGarden.mousePressed(function(){
    gameState=6
    database.ref("/").update({"gameState":gameState});
  }));
  if (gameState===6){
    dog.y=175;
    dog.addImage(garden);
    dog.scale=1;
    milkBotltle2.visible=false
  }

  var buttom=createButton("Feed this dog");
  button.position(400,125);

  if(button.mousePressed(function(){
    foodS=foodS-1;
    gameState=1;
    database.ref("/").update({"gameState":gameState});
  }))



function feedDog(){ 
  dog.addImage("dog",happyDogImg); 
  foodObj.updateFoodStock(foodObj.getFoodStock()-1); 
  database.ref('/').update({ 
    Food:foodObj.getFoodStock(),
    time:hour(),
    gamestate:"hungry"
  })
} 

function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}

function update(state){
  database.ref("/").update({
    gamestate:state, 
  })
}

function addFoods(){ 
  foodS++; 
  database.ref('/').update({ 
    Food:foodS 
  }) 
} 

function writeStock(data){
  database.ref('/').update({
    food:x
  })
}
}
