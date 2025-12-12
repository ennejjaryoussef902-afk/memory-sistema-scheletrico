// --- FILE: script.js FINALE (Con Timer e Audio) ---

// 1. Definisci il prefisso del percorso 
const IMAGE_PATH_PREFIX = ""; 

// 2. IMPOSTA L'ESTENSIONE CORRETTA QUI
const FILE_EXTENSION = ".jpg"; 

const bonePairs = [
    { name: "Cranio", type: "text" }, { name: "Cranio", type: "image", content: "cranio" + FILE_EXTENSION },
    { name: "Scapola", type: "text" }, { name: "Scapola", type: "image", content: "scapola" + FILE_EXTENSION },
    { name: "Clavicola", type: "text" }, { name: "Clavicola", type: "image", content: "clavicola" + FILE_EXTENSION },
    { name: "Colonna", type: "text" }, { name: "Colonna", type: "image", content: "colonna" + FILE_EXTENSION },
    { name: "Bacino", type: "text" }, { name: "Bacino", type: "image", content: "bacino" + FILE_EXTENSION },
    
    { name: "Radio", type: "text" }, { name: "Radio", type: "image", content: "radio" + FILE_EXTENSION },
    { name: "Ulna", type: "text" }, { name: "Ulna", type: "image", content: "ulna" + FILE_EXTENSION },
    { name: "Falangi", type: "text" }, { name: "Falangi", type: "image", content: "falangi" + FILE_EXTENSION },
    
    { name: "Femore", type: "text" }, { name: "Femore", type: "image", content: "femore" + FILE_EXTENSION },
    { name: "Tibia", type: "text" }, { name: "Tibia", type: "image", content: "tibia" + FILE_EXTENSION },
    { name: "Perone", type: "text" }, { name: "Perone", type: "image", content: "perone" + FILE_EXTENSION }
];

let gameCards = [];
let flippedCards = [];
let matchedPairs = 0;
let attempts = 0; 
const totalPairs = bonePairs.length / 2;
const gameBoard = document.getElementById('game-board');
const statusMessage = document.getElementById('status-message');

// Variabili per Timer e Audio
let timerInterval;
let seconds = 0;
const timerDisplay = document.getElementById('timer');
const attemptsDisplay = document.getElementById('attempts-display');
const matchSound = document.getElementById('match-sound');
const failSound = document.getElementById('fail-sound');


function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function startTimer() {
    // Azzera e ferma qualsiasi timer precedente
    clearInterval(timerInterval);
    seconds = 0;
    timerDisplay.textContent = '0:00';

    timerInterval = setInterval(() => {
        seconds++;
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        // Formatta il tempo in M:SS
        timerDisplay.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function playSound(audioElement) {
    // Ferma e riavvolge l'audio prima di riprodurlo per permettere suoni ravvicinati
    audioElement.pause();
    audioElement.currentTime = 0;
    audioElement.play();
}


function initializeGame() {
    gameBoard.innerHTML = ''; 
    gameCards = [...bonePairs];
    shuffle(gameCards);
    flippedCards = [];
    matchedPairs = 0;
    attempts = 0;

    statusMessage.textContent = `Coppie trovate: 0 | Inizia il gioco!`;
    attemptsDisplay.textContent = '0';
    
    // Avvia il timer all'inizio del gioco
    startTimer(); 

    gameBoard.style.gridTemplateColumns = 'repeat(6, 1fr)'; 
    
    gameCards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.name = card.name;
        cardElement.dataset.index = index;
        cardElement.addEventListener('click', () => flipCard(cardElement));

        let cardContent;
        if (card.type === 'image') {
            const imagePath = IMAGE_PATH_PREFIX + card.content; 
            cardContent = `<img src="${imagePath}" alt="${card.name}" onerror="this.outerHTML='[MANCA IMMAGINE: ${card.name.toUpperCase()}]'">`;
        } else {
            cardContent = card.name;
        }

        cardElement.innerHTML = `
            <div class="card-inner">
                <div class="card-front">?</div>
                <div class="card-back">${cardContent}</div>
            </div>
        `;
        gameBoard.appendChild(cardElement);
    });
}

function flipCard(cardElement) {
    if (flippedCards.length < 2 && 
        !cardElement.classList.contains('is-flipped') && 
        !cardElement.classList.contains('is-matched')) {
            
        cardElement.classList.add('is-flipped');
        flippedCards.push(cardElement);

        if (flippedCards.length === 2) {
            attempts++;
            attemptsDisplay.textContent = attempts; // Aggiorna il display dei tentativi
            setTimeout(checkForMatch, 1000); 
        }
    }
}

function checkForMatch() {
    const [card1, card2] = flippedCards;
    const isMatch = card1.dataset.name === card2.dataset.name;

    if (isMatch) {
        playSound(matchSound); // Suono di successo

        card1.classList.add('is-matched');
        card2.classList.add('is-matched');
        card1.style.pointerEvents = 'none';
        card2.style.pointerEvents = 'none';

        matchedPairs++;
        statusMessage.textContent = `Coppia Trovata! Coppie trovate: ${matchedPairs}`;
        
        if (matchedPairs === totalPairs) {
            stopTimer(); // Ferma il timer
            const finalTime = timerDisplay.textContent;
            setTimeout(() => {
                statusMessage.textContent = `🎉 Complimenti! Hai completato il Memory Game Scheletrico in ${attempts} tentativi e in ${finalTime}! 🎉`;
            }, 500);
        }
    } else {
        playSound(failSound); // Suono di fallimento
        
        card1.classList.remove('is-flipped');
        card2.classList.remove('is-flipped');
        statusMessage.textContent = `Riprova... Coppie trovate: ${matchedPairs}`;
    }
    flippedCards = [];
}

// Avvio immediato
initializeGame();