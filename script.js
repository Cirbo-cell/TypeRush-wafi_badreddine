/* =====================================================
   TYPERUSH - PART 1
   =============================================== */

// ===========================
// HTML ELEMENTS
// ===========================

const difficultySelect = document.getElementById("difficulty");

const textDisplay = document.getElementById("textDisplay");

const textInput = document.getElementById("textInput");

const startBtn = document.getElementById("startBtn");

const restartBtn = document.getElementById("restartBtn");

const resetStatsBtn = document.getElementById("resetStatsBtn");

const playAgainBtn = document.getElementById("playAgain");

const timerDisplay = document.getElementById("timer");

const wpmDisplay = document.getElementById("wpm");

const accuracyDisplay = document.getElementById("accuracy");

const progressBar = document.getElementById("progressBar");

const resultModal = document.getElementById("resultModal");

const finalDifficulty = document.getElementById("finalDifficulty");

const finalWPM = document.getElementById("finalWPM");

const finalAccuracy = document.getElementById("finalAccuracy");

const finalTime = document.getElementById("finalTime");

const performanceTitle = document.getElementById("performanceTitle");

const easyScores = document.getElementById("easyScores");

const mediumScores = document.getElementById("mediumScores");

const hardScores = document.getElementById("hardScores");


// ===========================
// GAME VARIABLES
// ===========================

let currentText = "";

let timer = 0;

let interval = null;

let gameStarted = false;

let correctCharacters = 0;

let typedCharacters = 0;

let currentIndex = 0;


// ===========================
// TEXT DATABASE
// ===========================

const texts = {

easy: [

`Typing every day helps improve speed accuracy and confidence.
The more you practice the easier it becomes to write quickly.
Stay focused and try not to look at the keyboard while typing.`,

`Small habits repeated every day create impressive results over time.
Learning keyboard skills can help students developers writers and anyone
who spends time using a computer.`

],


medium: [

`Programming is a valuable skill that encourages logical thinking and
creative problem solving. Building projects is one of the fastest ways
to improve because each challenge teaches something new about coding and
software development.`,

`Technology changes rapidly and learning never truly stops. Every new
project provides opportunities to understand better algorithms design
patterns optimization debugging and user experience while developing
confidence as a programmer.`

],


hard: [

`Success in software development comes from consistent practice patience
and curiosity. Developers often spend many hours reading documentation
testing different approaches fixing unexpected bugs and refining their
applications until every feature performs smoothly. Strong communication
teamwork and attention to detail are equally important because creating
quality software is almost always a collaborative effort involving many
people with different skills and perspectives.`,

`Typing quickly without sacrificing precision requires concentration and
discipline. Professional typists programmers journalists and authors
benefit greatly from developing muscle memory because it allows them to
focus on ideas rather than individual keystrokes. Continuous practice
combined with proper posture comfortable hand positioning and regular
breaks leads to noticeable improvements over weeks and months.`

]

};


// ===========================
// START GAME
// ===========================

startBtn.addEventListener("click", startGame);

playAgainBtn.addEventListener("click", () => {

    resultModal.style.display = "none";

    resetGame();

    startGame();

});


// ===========================
// RESTART
// ===========================

restartBtn.addEventListener("click", () => {

    resetGame();

});


// ===========================
// RESET LOCAL STORAGE
// ===========================

resetStatsBtn.addEventListener("click", () => {

    if(confirm("Delete every saved score?")){

        localStorage.removeItem("typeRushScores");

        loadScores();

    }

});


// ===========================
// START GAME FUNCTION
// ===========================

function startGame(){

    resetGame();

    const difficulty = difficultySelect.value;

    const list = texts[difficulty];

    currentText = list[Math.floor(Math.random()*list.length)];

    renderText(currentText);

    textInput.disabled = false;

    textInput.focus();

    gameStarted = true;

}


// ===========================
// RENDER TEXT
// ===========================

function renderText(text){

    textDisplay.innerHTML = "";

    text.split("").forEach(character=>{

        const span = document.createElement("span");

        span.innerText = character;

        textDisplay.appendChild(span);

    });

}


// ===========================
// RESET GAME
// ===========================

function resetGame(){

    clearInterval(interval);

    interval = null;

    timer = 0;

    gameStarted = false;

    currentIndex = 0;

    typedCharacters = 0;

    correctCharacters = 0;

    progressBar.style.width = "0%";

    timerDisplay.innerText = "00:00";

    wpmDisplay.innerText = "0";

    accuracyDisplay.innerText = "100%";

    textInput.value = "";

    textInput.disabled = true;

    textDisplay.innerHTML = "Press Start to begin...";

}


// ===========================
// START TIMER
// ===========================

function startTimer(){

    interval = setInterval(()=>{

        timer++;

        const minutes = Math.floor(timer/60);

        const seconds = timer%60;

        timerDisplay.innerText =
            `${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`;

    },1000);

}


// ===========================
// LOAD SCORES
// ===========================

function loadScores(){

    let scores = JSON.parse(localStorage.getItem("typeRushScores"));

    if(!scores){

        scores = {

            easy:[],

            medium:[],

            hard:[]

        };

    }

    displayDifficultyScores(easyScores,scores.easy);

    displayDifficultyScores(mediumScores,scores.medium);

    displayDifficultyScores(hardScores,scores.hard);

}


// ===========================
// DISPLAY SCORES
// ===========================

function displayDifficultyScores(container,list){

    container.innerHTML="";

    if(list.length===0){

        container.innerHTML="<li>No scores yet</li>";

        return;

    }

    list.forEach(score=>{

        const li=document.createElement("li");

        li.innerHTML=

        `
        <strong>${score.wpm} WPM</strong>

        | ${score.accuracy}%

        | ${score.time}s
        `;

        container.appendChild(li);

    });

}


// ===========================
// INITIAL LOAD
// ===========================

loadScores();

/* =====================================================
   TYPERUSH - PART 2
   Typing Engine
===================================================== */

// ===========================
// TYPING EVENT
// ===========================

textInput.addEventListener("input", handleTyping);

function handleTyping() {

    // Start timer on first key press
    if (typedCharacters === 0 && interval === null) {
        startTimer();
    }

    const typedText = textInput.value;
    const spans = textDisplay.querySelectorAll("span");

    typedCharacters = typedText.length;
    correctCharacters = 0;

    spans.forEach((span, index) => {

        span.classList.remove("correct");
        span.classList.remove("incorrect");
        span.classList.remove("current");

        const typedChar = typedText[index];

        if (typedChar == null) {

            if (index === typedText.length) {
                span.classList.add("current");
            }

            return;
        }

        if (typedChar === span.innerText) {

            span.classList.add("correct");
            correctCharacters++;

        } else {

            span.classList.add("incorrect");

        }

    });

    currentIndex = typedCharacters;

    updateProgress();

    updateAccuracy();

    updateWPM();

    checkFinish();

}



// ===========================
// PROGRESS BAR
// ===========================

function updateProgress() {

    const percentage =
        (typedCharacters / currentText.length) * 100;

    progressBar.style.width = percentage + "%";

}



// ===========================
// ACCURACY
// Formula:
// correct characters / total typed characters *100
// ===========================

function updateAccuracy() {

    if (typedCharacters === 0) {

        accuracyDisplay.innerText = "100%";
        return;

    }

    const accuracy =
        (correctCharacters / typedCharacters) * 100;

    accuracyDisplay.innerText =
        accuracy.toFixed(1) + "%";

}



// ===========================
// WPM
// Standard Formula
// (Correct Characters /5)/Minutes
// ===========================

function updateWPM() {

    if (timer === 0) {

        wpmDisplay.innerText = "0";
        return;

    }

    const minutes = timer / 60;

    const wpm = Math.round(
        (correctCharacters / 5) / minutes
    );

    wpmDisplay.innerText =
        isFinite(wpm) ? wpm : 0;

}



// ===========================
// CHECK FINISH
// ===========================

function checkFinish() {

    if (typedCharacters < currentText.length)
        return;

    if (textInput.value !== currentText)
        return;

    finishGame();

}



// ===========================
// FINISH GAME
// ===========================

function finishGame() {

    clearInterval(interval);

    interval = null;

    textInput.disabled = true;

    const accuracy =
        ((correctCharacters / typedCharacters) * 100).toFixed(1);

    const minutes = timer / 60;

    const wpm = Math.round(
        (correctCharacters / 5) / minutes
    );

    showResults(

        difficultySelect.value,

        wpm,

        accuracy,

        timer

    );

}

/* =====================================================
   TYPERUSH - PART 2
   Typing Engine
===================================================== */

// ===========================
// TYPING EVENT
// ===========================

textInput.addEventListener("input", handleTyping);

function handleTyping() {

    // Start timer on first key press
    if (typedCharacters === 0 && interval === null) {
        startTimer();
    }

    const typedText = textInput.value;
    const spans = textDisplay.querySelectorAll("span");

    typedCharacters = typedText.length;
    correctCharacters = 0;

    spans.forEach((span, index) => {

        span.classList.remove("correct");
        span.classList.remove("incorrect");
        span.classList.remove("current");

        const typedChar = typedText[index];

        if (typedChar == null) {

            if (index === typedText.length) {
                span.classList.add("current");
            }

            return;
        }

        if (typedChar === span.innerText) {

            span.classList.add("correct");
            correctCharacters++;

        } else {

            span.classList.add("incorrect");

        }

    });

    currentIndex = typedCharacters;

    updateProgress();

    updateAccuracy();

    updateWPM();

    checkFinish();

}



// ===========================
// PROGRESS BAR
// ===========================

function updateProgress() {

    const percentage =
        (typedCharacters / currentText.length) * 100;

    progressBar.style.width = percentage + "%";

}



// ===========================
// ACCURACY
// Formula:
// correct characters / total typed characters *100
// ===========================

function updateAccuracy() {

    if (typedCharacters === 0) {

        accuracyDisplay.innerText = "100%";
        return;

    }

    const accuracy =
        (correctCharacters / typedCharacters) * 100;

    accuracyDisplay.innerText =
        accuracy.toFixed(1) + "%";

}



// ===========================
// WPM
// Standard Formula
// (Correct Characters /5)/Minutes
// ===========================

function updateWPM() {

    if (timer === 0) {

        wpmDisplay.innerText = "0";
        return;

    }

    const minutes = timer / 60;

    const wpm = Math.round(
        (correctCharacters / 5) / minutes
    );

    wpmDisplay.innerText =
        isFinite(wpm) ? wpm : 0;

}



// ===========================
// CHECK FINISH
// ===========================

function checkFinish() {

    if (typedCharacters < currentText.length)
        return;

    if (textInput.value !== currentText)
        return;

    finishGame();

}



// ===========================
// FINISH GAME
// ===========================

function finishGame() {

    clearInterval(interval);

    interval = null;

    textInput.disabled = true;

    const accuracy =
        ((correctCharacters / typedCharacters) * 100).toFixed(1);

    const minutes = timer / 60;

    const wpm = Math.round(
        (correctCharacters / 5) / minutes
    );

    showResults(

        difficultySelect.value,

        wpm,

        accuracy,

        timer

    );

}