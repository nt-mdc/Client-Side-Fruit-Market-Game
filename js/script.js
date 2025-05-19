let start = document.getElementById("start");
let startForm = document.getElementById("start-form");
let nicknameInput = document.getElementById("nickname");
let game = document.getElementById("game");
let end = document.getElementById("end");
let scoreItem = document.getElementById("text-score");
let gameBoardItems = document.getElementById("game-board-items");
let textNickname = document.getElementById("text-nickname");
let gameTimer = document.getElementById("game-timer-bg");

gameTimer.style.width = "100%";
let score = 0;
let nickname = "";

startForm.addEventListener("submit", (e) => {
  e.preventDefault();
  start.classList.add("hidden");
  textNickname.innerHTML = nicknameInput.value;
  console.log(nicknameInput.value);
  setTimeout(() => verifyItems(), 1000);
});

const fruits = [
  { fruit: "banana", src: "../imgs/fruit-banana.png" },
  { fruit: "apple", src: "../imgs/fruit-apple.png" },
  { fruit: "grape", src: "../imgs/fruit-grape.png" },
  { fruit: "peach", src: "../imgs/fruit-peach.png" },
  { fruit: "watermelon", src: "../imgs/fruit-watermelon.png" },
];
const bombItem = { type: "bomb", src: "../imgs/bomb.png" };

let itemSelected = null;

let gameMatrix = Array.from({ length: 8 }, (_, i) =>
  Array.from({ length: 8 }, (_, j) => {
    let matrixFruit = fruits[Math.floor(Math.random() * 5)];
    let fruit = document.createElement("div");

    fruit.dataset.type = matrixFruit.fruit;
    fruit.dataset.coordX = i;
    fruit.dataset.coordY = j;

    fruit.classList.add("fruit");
    fruit.style.top = `${i * 12.5}%`;
    fruit.style.left = `${j * 12.5}%`;
    fruit.style.backgroundImage = `url('${matrixFruit.src}')`;

    addClickListener(fruit);

    gameBoardItems.appendChild(fruit);
    return fruit;
  })
);

function addClickListener(item) {
  item.addEventListener("click", (e) => {
    let x = e.currentTarget.dataset.coordX;
    let y = e.currentTarget.dataset.coordY;

    if (!itemSelected) {
      if (gameMatrix[x][y].dataset.type == "bomb") {
        explodeCoord(x, y);
      } else {
        itemSelected = gameMatrix[x][y];
        itemSelected.classList.add("selected");
      }
    } else {
      if (itemSelected == gameMatrix[x][y]) {
        itemSelected.classList.remove("selected");
        itemSelected = null;
      } else {
        toggleItems(gameMatrix[x][y]);
      }
    }
  });
}

function explodeCoord(x, y) {
  let col = [];
  let row = [];

  for (let i = 0; i < 8; i++) {
    col.push(gameMatrix[i][y]);
    row.push(gameMatrix[x][i]);
  }

  removeSequence(col);
  removeSequence(row);

  setTimeout(() => verifyItems(), 500);
}

function toggleItems(item) {
  let leftSel = itemSelected.style.left;
  let topSel = itemSelected.style.top;
  let xSel = +itemSelected.dataset.coordX;
  let ySel = +itemSelected.dataset.coordY;

  let leftItem = item.style.left;
  let topItem = item.style.top;
  let xItem = +item.dataset.coordX;
  let yItem = +item.dataset.coordY;

  if (
    (Math.abs(xItem - xSel) == 1 && yItem == ySel) ||
    (Math.abs(yItem - ySel) == 1 && xItem == xSel)
  ) {
    itemSelected.style.left = leftItem;
    itemSelected.style.top = topItem;
    itemSelected.dataset.coordX = xItem;
    itemSelected.dataset.coordY = yItem;

    item.style.left = leftSel;
    item.style.top = topSel;
    item.dataset.coordX = xSel;
    item.dataset.coordY = ySel;

    gameMatrix[xSel][ySel] = item;
    gameMatrix[xItem][yItem] = itemSelected;

    itemSelected.classList.remove("selected");
    itemSelected = null;

    setTimeout(() => verifyItems(), 500);
  }
}

function verifyItems() {
  let removes = getItemsRemove();

  if (removes.length) {
    for (let i = 0; i < removes.length; i++) {
      removeSequence(removes[i]);
    }

    setTimeout(() => {
      verifyItems();
    }, 500);
  } else {
    for (let i = 0; i < 8; i++) {
      rearrangeMatrix();
    }

    setTimeout(() => {
      generateNews();
    }, 200);
  }
}

function generateNews() {
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (!gameMatrix[i][j]) {
        let matrixFruit = fruits[Math.floor(Math.random() * 5)];
        let fruit = document.createElement("div");

        fruit.dataset.type = matrixFruit.fruit;
        fruit.dataset.coordX = i;
        fruit.dataset.coordY = j;

        fruit.classList.add("fruit");
        fruit.classList.add("added");
        fruit.style.top = `${i * 12.5}%`;
        fruit.style.left = `${j * 12.5}%`;
        fruit.style.backgroundImage = `url('${matrixFruit.src}')`;

        gameMatrix[i][j] = fruit;

        addClickListener(fruit);

        gameBoardItems.appendChild(fruit);

        setTimeout(() => fruit.classList.remove("added"), 100);
      }
    }
  }

  if (getItemsRemove().length) {
    setTimeout(() => verifyItems(), 500);
  }
}

function rearrangeMatrix() {
  for (let col = 0; col < 8; col++) {
    for (let row = 6; row >= 0; row--) {
      if (gameMatrix[row][col]) {
        let currentRow = row;
        while (currentRow + 1 < 8 && !gameMatrix[currentRow + 1][col]) {
          // Atualizar visualmente
          let item = gameMatrix[currentRow][col];
          item.dataset.coordX = currentRow + 1;
          item.style.top = `${(currentRow + 1) * 12.5}%`;

          // Atualizar na matriz
          gameMatrix[currentRow + 1][col] = item;
          gameMatrix[currentRow][col] = null;

          currentRow++;
        }
      }
    }
  }
}

function removeSequence(sequence) {
  sequence.forEach((i, index) => {
    let x = +i.dataset.coordX;
    let y = +i.dataset.coordY;
    let item = gameMatrix[x][y];

    if (item && sequence.length >= 4 && index == 1 && sequence.length != 8) {
      removeItem(i, true);
    } else {
      if (item) {
        removeItem(i);
      }
    }
  });
}

function removeItem(item, isBomb = false) {
  item.addEventListener("transitionend", () => {
    let x = +item.dataset.coordX;
    let y = +item.dataset.coordY;

    gameMatrix[x][y] = isBomb ? generateBomb(x, y) : null;
    item.remove();
  });

  item.classList.add("removed");
  updateScore();
}

function generateBomb(x, y) {
  let bomb = document.createElement("div");

  bomb.classList.add("fruit");
  bomb.classList.add("added");

  bomb.style.backgroundImage = `url('${bombItem.src}')`;
  bomb.style.top = `${x * 12.5}%`;
  bomb.style.left = `${y * 12.5}%`;

  bomb.dataset.coordX = x;
  bomb.dataset.coordY = y;
  bomb.dataset.type = bombItem.type;

  gameMatrix[x][y] = bomb;

  addClickListener(bomb);
  gameBoardItems.appendChild(bomb);

  setTimeout(() => {
    bomb.classList.remove("added");
  }, 100);

  return bomb;
}

function getItemsRemove() {
  let itemsRemove = [];

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (gameMatrix[i][j]) {
        let itemCheck = gameMatrix[i][j];

        let itemType = itemCheck.dataset.type;

        let seq = [itemCheck];

        while (
          gameMatrix[i][j + 1] &&
          itemType == gameMatrix[i][j + 1].dataset.type
        ) {
          seq.push(gameMatrix[i][j + 1]);

          j++;
        }

        if (seq.length >= 3) itemsRemove.push(seq);
      }
    }
  }

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (gameMatrix[j][i]) {
        let itemCheck = gameMatrix[j][i];

        let itemType = itemCheck.dataset.type;

        let seq = [itemCheck];

        while (
          gameMatrix[j + 1] &&
          gameMatrix[j + 1][i] &&
          itemType == gameMatrix[j + 1][i].dataset.type
        ) {
          seq.push(gameMatrix[j + 1][i]);

          j++;
        }

        if (seq.length >= 3) itemsRemove.push(seq);
      }
    }
  }

  return itemsRemove;
}

function updateScore() {
  score += 20;

  scoreItem.innerHTML = score;
}

document.addEventListener("keyup", (e) => {
  if (itemSelected) {
    let xSel = +itemSelected.dataset.coordX;
    let ySel = +itemSelected.dataset.coordY;
    let another = null;

    switch (e.keyCode) {
      case 37:
        another = gameMatrix[xSel][ySel - 1];
        break;
      case 38:
        another = gameMatrix[xSel - 1][ySel];
        break;
      case 39:
        another = gameMatrix[xSel][ySel + 1];
        break;
      case 40:
        another = gameMatrix[xSel + 1][ySel];
        break;
    }

    if (another) {
      toggleItems(another)
    }

  }
});

setTimeout(() => verifyItems(), 500);
