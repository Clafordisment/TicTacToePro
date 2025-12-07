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

    playersPool.push(playerName);
    appearPlayBtn();
}

function appearPlayBtn() {
    if (playersPool.length === 2) {
        const playBtn = document.createElement("button");
        playBtn.className = "play-button";
        playBtn.textContent = "Играть";

        playBtnContainer.appendChild(playBtn);

        // Обработчик на кнопку внутри функции, потому что playBtn - локальная константа
        playBtn.addEventListener("click", startGame);
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
            //Формула для индексирования ячеек (i * 3 + j) + 1
            col.id = `cell-${(i * 3 + j) + 1}`;
            row.appendChild(col);
        }
    }
}


