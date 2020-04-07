// globals
const app = document.getElementById("app");
const gameAreaElement = document.querySelector(".game__area");
const gameLevelElement = document.getElementById("gameLevel");
const gamePointElement = document.getElementById("gamePoint");
const gameBoxHeight = 15 // box height 15px in css

var easy = {
    row: Math.floor((Math.floor((window.innerHeight - 100) / 15) / 2)),
    col: 13,
    index: -1,
    level: 0,
    width: 3,
    animationSpeed: 85,
    timer: null
};
easy.level = easy.row - 1;

const gameLevels = ["easy", "hard"];
var currentGameLevel = this[gameLevels[0]];
var currentGamePoint = 0;
var activeGameAreaRow;
var activeGameIndex = null;





function bindGameArea() {
    for (let i = 0; i < currentGameLevel.row; i++) {
        const gameBoxesTemplate = "<li></li>".repeat(currentGameLevel.col);
        const gameAreaTemplate = `<div class="game__area-row game__area-row-${i}" id="game__area-row-${i}"><ul>${gameBoxesTemplate}</ul></div>`;
        gameAreaElement.innerHTML += gameAreaTemplate;
    }
}

function startGameAnimation() {
    currentGameLevel.timer = setInterval(() => {
        currentGameLevel.index++;
        // subtracted 1 from level width. because index starts from 0
        if (currentGameLevel.index == (currentGameLevel.col - (currentGameLevel.width - 1))) {
            currentGameLevel.index = 0;
        }

        removeActiveClassFromBoxes();
        activeGameAreaRow = document.querySelector(".game__area-row-" + currentGameLevel.level);
        // add active box as level width
        for (let i = 0; i < currentGameLevel.width; i++) {
            activeGameAreaRow.querySelectorAll(`ul li`)[currentGameLevel.index + i].classList.add("active");
        }
    }, currentGameLevel.animationSpeed);
}

function removeActiveClassFromBoxes() {
    activeGameAreaRow = document.querySelector(".game__area-row-" + currentGameLevel.level);
    activeGameAreaRow.querySelectorAll("ul li").forEach((el) => {
        el.classList.remove("active");
    });
}
function stopGameAnimation() {
    clearInterval(currentGameLevel.timer);
}


function startGame() {
    currentGameLevel.level--;

    if (currentGameLevel.width < 1) {
        gameOver();
        return;
    }

    // update game point
    currentGamePoint += currentGameLevel.width;
    gamePointElement.innerHTML = currentGamePoint;


    if (activeGameIndex !== null) {
        console.log("currentGameLevel.index: " + currentGameLevel.index);
        console.log("activeGameIndex: " + activeGameIndex);

        if (currentGameLevel.index < (activeGameIndex + currentGameLevel.width) && (currentGameLevel.index + currentGameLevel.width) > activeGameIndex) {
            if (currentGameLevel.level < 0) {
                gameFinished();
                return;
            }
            // decreace game width if user can't fit box as the current width
            if (activeGameIndex != currentGameLevel.index) {
                currentGameLevel.width--;
                if (currentGameLevel.width < 1) {
                    gameOver();
                    return;
                }
            }
        } else {
            gameOver();
            return;
        }
    } else {
        if (currentGameLevel.level < 0) {
            gameOver();
            return;
        }
    }

    stopGameAnimation();
    startGameAnimation();
    activeGameIndex = currentGameLevel.index;
    // update game score
    gameLevelElement.innerHTML = currentGameLevel.row - currentGameLevel.level;
}






// game over and game finished alerts
function gameOver() {
    stopGameAnimation();
    swal("Game Over!", `Your score is ${currentGamePoint} and your level is ${gameLevelElement.textContent}.`, "error")
        .then(() => {
            resetGame();
        });
    return;
}
function gameFinished() {
    stopGameAnimation();
    swal("Congrats!", `You have completed the game. Your score is ${currentGamePoint} and your level is ${gameLevelElement.textContent}.`, "success")
        .then(() => {
            resetGame();
        });
    return;
}

function resetGame() {
    window.location.reload();
}



// space press and tap
document.body.onkeyup = function (e) {
    if (e.keyCode == 32) {
        startGame();
    }
};
app.onclick = function () {
    startGame();
};



// let's go!
function init() {
    bindGameArea();
    startGameAnimation();
}
window.onload = function () {
    init();
}
window.onresize = function () {
    window.location.reload();
}