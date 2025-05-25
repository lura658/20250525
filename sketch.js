let video;
let handpose;
let predictions = [];

let gameState = 0;
let selectedMaterial = null;
let hoverStartTime = 0;
let hoverIndex = -1;

let pairingResult = "";

function setup() {
  const canvas = createCanvas(640, 480);
  canvas.parent("sketch-holder");
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  handpose = ml5.handpose(video, () => {
    console.log("Handpose model loaded.");
  });

  handpose.on("predict", (results) => {
    predictions = results;
  });
}

function draw() {
  image(video, 0, 0, width, height);

  if (gameState === 0) {
    drawMaterialSelection();
  } else if (gameState === 1) {
    drawScenePairing();
  } else if (gameState === 2) {
    showFinalResult();
  }

  drawHandLandmarks();
}

function drawMaterialSelection() {
  textSize(20);
  fill(255, 200);
  textAlign(CENTER);
  text("請選擇一項教材（用手指指向一區域）", width / 2, 30);

  noStroke();
  fill(200, 100, 100, 180);
  rect(0, 100, width / 3, 300);
  fill(100, 200, 100, 180);
  rect(width / 3, 100, width / 3, 300);
  fill(100, 100, 200, 180);
  rect((width / 3) * 2, 100, width / 3, 300);

  fill(0);
  text("圖卡", width / 6, 250);
  text("故事書", width / 2, 250);
  text("教具", (width / 6) * 5, 250);

  if (predictions.length > 0) {
    const hand = predictions[0];
    const indexFinger = hand.landmarks[8];
    const x = indexFinger[0];
    const y = indexFinger[1];

    let currentHover = floor(map(x, 0, width, 0, 3));

    if (currentHover !== hoverIndex) {
      hoverIndex = currentHover;
      hoverStartTime = millis();
    } else {
      if (millis() - hoverStartTime > 2000) {
        selectedMaterial = ["圖卡", "故事書", "教具"][hoverIndex];
        gameState = 1;
      }
    }

    fill(255, 255, 0);
    noStroke();
    ellipse(x, y, 20);
  }
}

function drawScenePairing() {
  textSize(20);
  fill(255, 200);
  textAlign(CENTER);
  text(`你選擇了「${selectedMaterial}」，請配對合適的教學場景`, width / 2, 30);

  fill(255, 180, 150, 160);
  rect(0, 120, width / 3, 240);
  fill(150, 255, 180, 160);
  rect(width / 3, 120, width / 3, 240);
  fill(180, 180, 255, 160);
  rect((width / 3) * 2, 120, width / 3, 240);

  fill(0);
  text("故事時間", width / 6, 260);
  text("數學活動", width / 2, 260);
  text("小組互動", (width / 6) * 5, 260);

  if (predictions.length > 0) {
    const hand = predictions[0];
    const indexFinger = hand.landmarks[8];
    const x = indexFinger[0];
    const y = indexFinger[1];

    let currentHover = floor(map(x, 0, width, 0, 3));

    if (currentHover !== hoverIndex) {
      hoverIndex = currentHover;
      hoverStartTime = millis();
    } else {
      if (millis() - hoverStartTime > 2000) {
        let scenes = ["故事時間", "數學活動", "小組互動"];
        pairingResult = `你選擇將「${selectedMaterial}」用於「${scenes[hoverIndex]}」！`;
        gameState = 2;
      }
    }

    fill(0, 255, 255);
    ellipse(x, y, 20);
  }
}

function showFinalResult() {
  background(30, 100, 160);
  fill(255);
  textSize(28);
  textAlign(CENTER);
  text(pairingResult, width / 2, height / 2);
  textSize(18);
  text("感謝體驗！", width / 2, height / 2 + 40);
}

function drawHandLandmarks() {
  for (let i = 0; i < predictions.length; i++) {
    let prediction = predictions[i];
    for (let j = 0; j < prediction.landmarks.length; j++) {
      let [x, y] = prediction.landmarks[j];
      fill(0, 255, 0);
      noStroke();
      ellipse(x, y, 6);
    }
  }
}
