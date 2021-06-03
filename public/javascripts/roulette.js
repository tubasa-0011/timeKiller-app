function setup() {
createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0);
  let cW = width/2;
  let cH = height/2;
  let speed = frameCount/30;

  //台
  rectMode(CORNER);
  noStroke();
  fill("#866629");
  translate(0,-100);
  arc(cW, cH, 700, 500, PI, 0);
  rect(cW-350, cH, 700, 500,);
  resetMatrix(); // 初期化
  fill("#184d18");
  translate(0,-90);
  arc(cW, cH, 660, 480, PI, 0);
  rect(cW-330, cH, 660, 500,);
  resetMatrix(); // 初期化


  //円盤
  translate(cW, cH);
  fill("#6f5436");
  circle(0, 0, 580);
  fill("#866629");
  circle(0, 0, 500);
  resetMatrix(); // 初期化
  translate(cW, cH);
  noFill()
  stroke(255);
  fill("#000");
  circle(0, 0, 350);
  circle(0, 0, 280);
  fill("#6f5436");
  circle(0, 0, 280);
  noStroke();
  fill("#bfbec5");
  circle(0, 0, 100);
  fill("#fff");
  triangle(-15,-200, 0,-185, 15,-200);
  resetMatrix(); // 初期化

  //回転
  strokeWeight(1);
  textSize(20);
  textStyle(BOLD);
  translate(cW, cH);
  textAlign(CENTER)
  rotate(HALF_PI/speed);
  for(var i=1;i<25;i++){
    text(i, 0, -150);
    rotate(HALF_PI/6);
  }
  noStroke();
  fill("#866629");
  rectMode(CENTER);
  rect(0, 0, 150, 15);
  rect(0, 0, 15, 150);
  resetMatrix(); // 初期化

  //ひまつぶし内容
    if(speed>15){
      fill("#fff");
      textSize(frameCount/10+20);
      textStyle(BOLD);
      text("「"+"動画"+"」でひまつぶし！", cW, cH+100);
    }
}