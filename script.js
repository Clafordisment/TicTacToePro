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
let crossPlayer, noughtPlayer, actPlayerName;

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

    const player = document.createElement("div");
    player.className = "player-frame";
    player.textContent = playerName;
    playersContainer.appendChild(player);
    nameInput.value = "";

    const deletePlayerBtn = document.createElement("button");
    deletePlayerBtn.className = "del-player-button";
    deletePlayerBtn.textContent = "×"; // взял посторонний символ, чтобы не был под влиянием шрифта
    player.appendChild(deletePlayerBtn);

    // Так как создали кнопку через функию, вешаю обработчик внутри
    // Удаление игрока
    deletePlayerBtn.addEventListener("click", function () {
        const playerFrame = this.parentElement; // Определение текущей кнопки
        deletePlayer(playerFrame);
    });

    playersPool.push(playerName);
    appearPlayBtn();
}

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

    playerFrame.remove();
    appearPlayBtn(); // удаление кнопки "Играть" в случае, если она появилась (допфункция метода в блоке else)
}

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

    const gamePlayerFrames = document.querySelectorAll('.game-player-frame');

    setRules(gamePlayerFrames);
    activePlayer(gamePlayerFrames);

    // Создание таблицы-сетки
    const gameMesh = document.createElement("table");
    gameMesh.className = "game-mesh";
    gameMeshContainer.appendChild(gameMesh);

    for (let i = 0; i < 3; i++) {
        const row = document.createElement("tr");
        row.className = "row-mesh";
        gameMesh.appendChild(row);

        for (let j = 0; j < 3; j++) {
            const col = document.createElement("td");
            col.className = "col-mesh";
            //Формула для индексирования ячеек (i * 3 + j) + 1 (гениально u-u)
            col.id = `cell-${(i * 3 + j) + 1}`;
            row.appendChild(col);
        }
    }

}

// Сетап ролей игроков (распред на крестики и нолики)
function setRules(frames) {
    const playerFrames = frames;

    const hasRoles = Array.from(playerFrames).some(frame =>
        frame.classList.contains("player-role-cross") ||
        frame.classList.contains("player-role-nought")
    );

    if (!hasRoles) {
        const randIndex = Math.floor(Math.random() * playerFrames.length);

        // Отладочные строки
        let getPlayerName = playersPool[randIndex];
        console.log(`Крестиком выбран ${getPlayerName}`);

        playerFrames.forEach((frame, index) => {
            if (index === randIndex) {
                crossPlayer = document.createElement("div");
                crossPlayer.className = "player-role-cross";
                crossPlayer.textContent = "✖";
                frame.appendChild(crossPlayer);
            } else {
                noughtPlayer = document.createElement("div");
                noughtPlayer.className = "player-role-nought";
                noughtPlayer.textContent = "◯";
                frame.appendChild(noughtPlayer);
            }
        });
    }
}


function activePlayer(frames) {
    const playerFrames = frames;
    const randIndex = Math.floor(Math.random() * playerFrames.length);

    playerFrames.forEach((frame, index) => {
        if (index === randIndex) {
            actPlayerName = frame.textContent
                .replace("×", "")
                .replace("✖", "")
                .replace("◯", "")
                .trim();
            console.log(`Активным игроком выбран ${actPlayerName}`);

            frame.classList.add("act-game-player-frame");

            if (frame.classList.contains("player-role-cross")) {
                crossPlayer.classList.add("act-player-role-cross");
            }
            else if (frame.classList.contains("player-role-nought")) {
                noughtPlayer.classList.add("act-player-role-nought");
            }
        }
    });
}


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



