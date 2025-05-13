let start = document.getElementById("inner");
let startForm = document.getElementById("start-form");
let nicaknameInput = document.getElementById("nickname");
let game = document.getElementById("game");
let end = document.getElementById("end");

let gameBoardItems = document.getElementById("game-board-items");

let nickname = "";

const fruits = [
  { fruit: "banana", src: "../imgs/fruit-banana.png" },
  { fruit: "apple", src: "../imgs/fruit-apple.png" },
  { fruit: "grape", src: "../imgs/fruit-grape.png" },
  { fruit: "peach", src: "../imgs/fruit-peach.png" },
  { fruit: "watermelon", src: "../imgs/fruit-watermelon.png" },
];

startForm.addEventListener("submit", (e) => {
  e.preventDefault();
  nickname = nicaknameInput.value;
  start.classList.add("t-left");
});

let timer = 60;

function gameTimer() {
  setInterval(() => {
    timer--;
    console.log(timer);
  }, 1000);
}

let gameMatrix = Array.from({ length: 8 }, () =>
  Array.from({ length: 8 }, () => fruits[Math.floor(Math.random() * 5)])
);
let selectedFruits = [];
let gameMatrixEl = Array.from({ length: 8 }, () => Array.from({ length: 8 }));

for (let i = 0; i < gameMatrix.length; i++) {
  for (let j = 0; j < gameMatrix[i].length; j++) {
    let fruitItem = document.createElement("div");
    let fruit = document.createElement("img");

    fruitItem.classList.add(`item${j + 1}`);
    fruit.setAttribute("src", gameMatrix[i][j].src);
    fruit.classList.add("pointer");
    fruit.alt = gameMatrix[i][j].fruit;

    fruitItem.append(fruit);
    gameBoardItems.append(fruitItem);
    gameMatrixEl[i][j] = { fruit: fruit, fruitItem: fruitItem };

    fruit.addEventListener("click", () => {
      fruit.classList.toggle("selected");

      if (fruit.classList.contains("selected")) {
        selectedFruits.push({ element: fruit, i, j });
      } else {
        selectedFruits = selectedFruits.filter((f) => f.element == !fruit);
      }
      console.log(selectedFruits);

      if (selectedFruits.length == 2) {
        const [first, second] = selectedFruits;

        if (
          (Math.abs(first.i - second.i) === 1 && first.j === second.j) ||
          (Math.abs(first.j - second.j) === 1 && first.i === second.i)
        ) {
          let tempSrc = first.element.getAttribute("src");
          first.element.setAttribute("src", second.element.getAttribute("src"));
          second.element.setAttribute("src", tempSrc);

          let tempMatrixValues = gameMatrix[first.i][first.j];
          gameMatrix[first.i][first.j] = gameMatrix[second.i][second.j];
          gameMatrix[second.i][second.j] = tempMatrixValues;


          let firstCheck = checkForMatches(gameMatrix, first.i, first.j);
          let secondCheck = checkForMatches(gameMatrix, second.i, second.j);

          verifyMatchedIndexes(firstCheck);
          verifyMatchedIndexes(secondCheck);

          console.log(firstCheck, secondCheck);

          selectedFruits = [];
          setTimeout(() => {
            first.element.classList.remove("selected");
            second.element.classList.remove("selected");
          }, 500);
        } else {
          selectedFruits = [];
          setTimeout(() => {
            first.element.classList.remove("selected");
            second.element.classList.remove("selected");
          }, 100);
        }
      }
    });
  }
}

(function () {
  console.log(1);
})();

// console.log(gameMatrix);

// console.log(selectedFruits);

function checkForMatches(gameMatrix, i, j) {
  const fruit = gameMatrix[i][j];
  let horizontalMatches = 1;
  let verticalMatches = 1;
  let horizontalMatchesIndexs = [j];
  let verticalMatchesIndexs = [i];

  // Check horizontal matches to the left
  let left = j - 1;
  while (left >= 0 && gameMatrix[i][left] === fruit) {
    horizontalMatches++;
    horizontalMatchesIndexs.push(left);
    left--;
  }

  // Check horizontal matches to the right
  let right = j + 1;
  while (right < gameMatrix[i].length && gameMatrix[i][right] === fruit) {
    horizontalMatches++;
    horizontalMatchesIndexs.push(right);
    right++;
  }

  // Check vertical matches above
  let up = i - 1;
  while (up >= 0 && gameMatrix[up][j] === fruit) {
    verticalMatches++;
    verticalMatchesIndexs.push(up);
    up--;
  }

  // Check vertical matches below
  let down = i + 1;
  while (down < gameMatrix.length && gameMatrix[down][j] === fruit) {
    verticalMatches++;
    verticalMatchesIndexs.push(down);
    down++;
  }

  return {
    match: horizontalMatches >= 3 || verticalMatches >= 3,
    column: {
      indexs: verticalMatchesIndexs,
      amount: verticalMatches,
    },
    row: {
      indexs: horizontalMatchesIndexs,
      amount: horizontalMatches,
    },
  };
}

function verifyMatchedIndexes({ match, column, row }) {
  if (match) {
    if (column.amount > 1 || row.amount > 1) {
      column.indexs.forEach((i) => {
        row.indexs.forEach((j) => {
          gameMatrixEl[i][j].fruit.classList.add("match");
          setTimeout(() => {
            console.log(gameMatrixEl[i][j]);
            
            gameMatrixEl[i][j].fruitItem.removeChild(gameMatrixEl[i][j].fruit);
            newFruit(gameMatrixEl[i][j].fruitItem)
          }, 1000);

        });
      });
    }
  }
}

function newFruit(fruitItem){
    let fruitData = fruits[Math.floor(Math.random() * 5)];
    let newFruit = document.createElement('img');
    newFruit.setAttribute("src", fruitData.src);
    newFruit.classList.add("pointer", "newFruitItem");
    newFruit.alt = fruitData.fruit;
    fruitItem.append(newFruit);
}
