// Элементы DOM
const mainContent = document.querySelector(".container");
const nameInput = document.querySelector(".add-players-name-input");
const addButton = document.querySelector(".add-players-name-button");
const playBtnContainer = document.querySelector(".play-button-location");
const playersContainer = document.querySelector(".player-frames-container");
const startContainer = document.querySelector(".start-interactives-container");
const gameMeshContainer = document.querySelector(".game-mesh-container");
gameMeshContainer.style.display = "none"; // чтобы не делал лишних отступов

// const  = document.querySelector(".");

let playersPool = [];

// Класс для игрового описания игрока
class GamePlayer {
    constructor(name) {
        this.name = name;                     // str
        this.role = "";                       // str (⭘ или ✖)
        this.isAct = false;                   // bool
        this.firstMove = true;                // bool
        this.moveHistory = [];                // collection
        this.frameElement = null;             // DOM элемент фрейма
    }
}

let gamePlayers = []; // Массив объектов GamePlayer

function addPlayer() {
    const playerName = nameInput.value.trim();

    // Проверки на пустое поле, дубликат и количество игроков
    if (playerName === "") {
        return;
    }

    if (playersPool.includes(playerName)) {
        nameInput.value = "";
        alert("Такое имя уже есть");
        return;
    }

    if (playersPool.length >= 2) {
        alert("Игроков не должно быть больше 2-х!");
        return;
    }

    const playerFrame = document.createElement("div");
    playerFrame.className = "player-frame";
    playerFrame.textContent = playerName;
    playersContainer.appendChild(playerFrame);

    const playerObj = new GamePlayer(playerName);
    playerObj.frameElement = playerFrame;
    gamePlayers.push(playerObj);

    nameInput.value = "";

    const deletePlayerBtn = document.createElement("button");
    deletePlayerBtn.className = "del-player-button";
    deletePlayerBtn.textContent = "×"; // взял посторонний символ, чтобы не был под влиянием шрифта
    playerFrame.appendChild(deletePlayerBtn);

    // Так как создали кнопку через функию, вешаю обработчик внутри
    // Удаление игрока
    deletePlayerBtn.addEventListener("click", function () {
        const playerFrame = this.parentElement; // Определение текущей кнопки
        deletePlayer(playerFrame);
    });

    playersPool.push(playerName);
    appearPlayBtn();
}

// Функция удаления игрока 
function deletePlayer(playerFrame) {
    const allTextOfFrames = playerFrame.textContent;
    const playerName = allTextOfFrames.replace("×", "").trim();

    let iForDel = playersPool.findIndex(player => player === playerName);

    if (iForDel === -1) {
        alert("Имя игрока не найдено");
        console.log("При выполнении функции deletePlayer имя игрока не было найдено");
    }
    else {
        playersPool.splice(iForDel, 1);
    }

    const playerObjIndex = gamePlayers.findIndex(player => player.name === playerName);
    if (playerObjIndex !== -1) {
        gamePlayers.splice(playerObjIndex, 1);
    }

    playerFrame.remove();
    appearPlayBtn(); // удаление кнопки "Играть" в случае, если она появилась (допфункция метода в блоке else)
}

// Появление или исчезновение кнопки "Играть"
function appearPlayBtn() {
    const existPlayBtn = document.querySelector(".play-button");

    if (playersPool.length === 2) {
        if (!existPlayBtn) {
            const playBtn = document.createElement("button");
            playBtn.className = "play-button";
            playBtn.textContent = "Играть";

            playBtnContainer.appendChild(playBtn);

            // Обработчик на кнопку внутри функции, потому что playBtn - локальная константа
            playBtn.addEventListener("click", startGame);
        }
    }
    else {
        if (existPlayBtn) {
            existPlayBtn.remove();
        }
    }
}

// Добавление игрока по кнопке
addButton.addEventListener("click", addPlayer);

// Добавление игрока по клавише enter (даже нампадовской)
nameInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter" || event.keyCode === 13 || event.code === "NumpadEnter") {
        addPlayer();
    }
});


// Функция для старта игры
function startGame() {
    // Убираю путём none и блока, потому что иннер тяжелее контролировать
    startContainer.style.display = "none";
    playBtnContainer.style.display = "none";
    gameMeshContainer.style.display = "block";

    const allDeleteButtons = document.querySelectorAll(".del-player-button");
    allDeleteButtons.forEach(btn => {
        btn.style.display = "none";
    });

    // опять же я создавал фреймы внутри функции, из-за чего их нужно получать заново
    const playerFrames = document.querySelectorAll('.player-frame');
    playerFrames.forEach(frame => {
        frame.classList.replace('player-frame', 'game-player-frame');
    });

    // Новые селекторы для фреймов (чтобы избавиться от ховера):
    /*
    game-player-frame
    act-game-player-frame       (активный игрок)
    */

    // const gamePlayerFrames = document.querySelectorAll('.game-player-frame');

    setRoles(gamePlayers);
    activePlayer(gamePlayers);

    // Создание таблицы-сетки
    const gameMesh = document.createElement("table");
    gameMesh.className = "game-mesh";
    gameMeshContainer.appendChild(gameMesh);

    for (let i = 0; i < 3; i++) {
        const row = document.createElement("tr");
        row.className = "row-mesh";
        gameMesh.appendChild(row);

        for (let j = 0; j < 3; j++) {
            let colIndex = 0;
            const col = document.createElement("td");
            col.className = "col-mesh";
            //Формула для индексирования ячеек (i * 3 + j) + 1 (гениально u-u)
            colIndex = (i * 3 + j) + 1;
            col.id = `cell-${colIndex}`;
            col.dataset.index = colIndex;
            col.dataset.value = "";

            //Обработчик для ячеек, чтобы активный игрок мог сделать ход
            col.addEventListener("click", function () {
                const actPlayer = gamePlayers.find(p => p.isAct);
                if (!actPlayer) return;
                // выход из функии, если ячейка занята. Учитывая, что в игре даже на четвёртом ходе нельзя занимать предыдущую клетку, то это полезная строка
                if (this.textContent !== "") return; 

                this.textContent = actPlayer.role;

                if (actPlayer && actPlayer.role === "✖") {
                    this.classList.add("col-cross");
                }
                else {
                    this.classList.add("col-nought");
                }
                switchPlayer();
            });

            row.appendChild(col);
        }
    }
}

// Сетап ролей игроков (распред на крестики и нолики)
function setRoles(playerObjects) {
    const hasRoles = playerObjects.some(player => player.role !== "");

    if (!hasRoles && playerObjects.length >= 2) {
        const randIndex = Math.floor(Math.random() * playerObjects.length);

        // Назначение ролей игрокам 
        playerObjects.forEach((playerObj, index) => {
            if (index === randIndex) {
                playerObj.role = "✖"

                if (playerObj.frameElement) {
                    const crossPlayer = document.createElement("div");
                    crossPlayer.className = "player-role-cross";
                    crossPlayer.textContent = "✖";
                    playerObj.frameElement.style.backgroundColor = "#976767";
                    playerObj.frameElement.appendChild(crossPlayer);
                }

                console.log(`Крестиком выбран ${playerObj.name}`);
            } else {
                playerObj.role = "⭘";

                if (playerObj.frameElement) {
                    const noughtPlayer = document.createElement("div");
                    noughtPlayer.className = "player-role-nought";
                    noughtPlayer.textContent = "⭘";
                    playerObj.frameElement.style.backgroundColor = "rgb(83, 83, 131)";
                    playerObj.frameElement.appendChild(noughtPlayer);
                }

                console.log(`Ноликом выбран ${playerObj.name}`);
            }
        });
    }
}

function activePlayer(playerObjects) {
    const randIndex = Math.floor(Math.random() * playerObjects.length);

    playerObjects.forEach((playerObj, index) => {

        // Съём активности и её стилей 
        playerObj.isAct = false;

        if (playerObj.frameElement) {
            playerObj.frameElement.classList.remove("act-game-player-frame");

            const roleElement = playerObj.frameElement.querySelector(".player-role-cross, .player-role-nought");
            if (roleElement) {
                roleElement.classList.remove("act-player-role-cross", "act-player-role-nought");
            }
        }

        // Объявление активности
        if (index === randIndex) {
            playerObj.isAct = true;
            console.log(`Активным игроком выбран ${playerObj.name}`);

            if (playerObj.frameElement) {
                playerObj.frameElement.classList.add("act-game-player-frame");
                const roleElement = playerObj.frameElement.querySelector(".player-role-cross, .player-role-nought");
                if (roleElement) {
                    if (playerObj.role === "✖") {
                        roleElement.classList.add("act-player-role-cross");
                    } else {
                        roleElement.classList.add("act-player-role-nought");
                    }
                }
            }
        }
    });
}

//Функция смены игрока
function switchPlayer() {
    // Решил перейти с перебора игроков на их нахождение с помощью find 
    const actPlayer = gamePlayers.find(p => p.isAct);

    // Условие для отладки
    if (!actPlayer) {
        console.log("Для выполнения функции switchPlayer не был найден игрок (undefined)");
        return;
    }

    const actIndex = gamePlayers.indexOf(actPlayer);

    // формула индекса, определяющая следующего игрока:
    // если остаток от деления 1 -> переход к второму игроку.
    // Если 0 -> переход к первому
    const nextPlayer = gamePlayers[(actIndex + 1) % gamePlayers.length];

    const actRoleEl = actPlayer.frameElement.querySelector(".player-role-cross, .player-role-nought");
    const nextRoleEl = nextPlayer.frameElement.querySelector(".player-role-cross, .player-role-nought");

    actPlayer.isAct = false;
    actPlayer.frameElement.classList.remove("act-game-player-frame");
    if (actRoleEl) {
        actRoleEl.classList.remove("act-player-role-cross", "act-player-role-nought");
    }

    nextPlayer.isAct = true;
    nextPlayer.frameElement.classList.add("act-game-player-frame");
    if (nextRoleEl) {
        if (nextPlayer.role === "✖") {
            nextRoleEl.classList.add("act-player-role-cross");
        } else if (nextPlayer.role === "⭘") {
            nextRoleEl.classList.add("act-player-role-nought");
        }
    }
}


// function sleep(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms));
// }

// async function sOmEtHiNg() {
//     for (let i = 0; i < 100; i++) {
//         await sleep(2000);
//         switchPlayer();
//         console.log("Сработал цикл")
//     }
// }

// sOmEtHiNg();


// 1, 2, 3
// 4, 5, 6
// 7, 8, 9

const winCombos = [
    [1, 2, 3], // Горизонталь 1
    [4, 5, 6], // Горизонталь 2
    [7, 8, 9], // Горизонталь 3

    [1, 4, 7], // Вертикаль 1
    [2, 5, 8], // Вертикаль 2
    [3, 6, 9], // Вертикаль 3

    [1, 5, 9], // Диагональ с правого нижнего на верхний левый 
    [3, 5, 7]  // Диагональ с левого нижнего на верхний правый
];