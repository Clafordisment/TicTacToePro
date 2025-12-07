// Элементы DOM

// const mainContent = document.querySelector(".container");
const nameInput = document.querySelector(".add-players-name-input");
const addButton = document.querySelector(".add-players-name-button");
const playBtnContainer = document.querySelector(".play-button-appearing");
const playersContainer = document.querySelector(".player-frames-container");

// const  = document.querySelector(".");

let playersPool = [];

addButton.addEventListener("click", function() { //позже сделаю функцию отдельной, чтобы повесить на обработчики кнопки и enter

    const playerName = nameInput.value;

    // Проверки на наличие имени, пустое поле и количество игроков
    if (playersPool.includes(playerName)) {
        nameInput.value = "";
        alert("Такое имя уже есть");
        return;
    }

    if (playerName.trim() === "") {
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
});

function appearPlayBtn() {
    if (playersPool.length === 2) {
        const playBtn = document.createElement("button");
        playBtn.className = "play-button";
        playBtn.textContent = "Играть";

        playBtnContainer.appendChild(playBtn);
    }
}

playBtn.addEventListener("click", function() { 
    
});