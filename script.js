/* =========================================
   AADI RAKSHA BANDHAN WEBSITE
   AUDIO VERSION
========================================= */


/* =========================================
   SCREEN CONTROL
========================================= */

const screens = [
    "startScreen",
    "welcomeScreen",
    "gameScreen",
    "heartGameScreen",
    "memoryScreen",
    "messageScreen",
    "giftScreen",
    "finalScreen"
];

function showScreen(id) {

    screens.forEach(screen => {

        const element = document.getElementById(screen);

        if (element) {
            element.classList.add("hidden");
        }

    });

    const selected = document.getElementById(id);

    if (selected) {

        selected.classList.remove("hidden");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }
}


/* =========================================
   AUDIO SYSTEM
========================================= */

let voiceEnabled = true;
let currentAudio = null;


/*
   Stop whatever audio is currently playing.
*/
function stopAudio() {

    if (currentAudio) {

        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio = null;

    }

}


/*
   Play one of your downloaded MP3 files.
*/
function playVoice(fileName) {

    if (!voiceEnabled) return;

    stopAudio();

    currentAudio = new Audio(fileName);

    currentAudio.preload = "auto";

    currentAudio.volume = 1;

    currentAudio.play().catch(error => {

        console.log("Audio could not play:", fileName, error);

    });

}


/*
   Voice ON/OFF button
*/
const voiceButton = document.getElementById("voiceButton");

if (voiceButton) {

    voiceButton.addEventListener("click", () => {

        voiceEnabled = !voiceEnabled;

        voiceButton.textContent =
            voiceEnabled ? "🔊" : "🔇";

        if (!voiceEnabled) {
            stopAudio();
        }

    });

}


/* =========================================
   START SCREEN
========================================= */

const startButton =
    document.getElementById("startButton");

if (startButton) {

    startButton.addEventListener("click", () => {

        /*
           IMPORTANT:
           Start button plays WELCOME voice
           BEFORE changing to the next page.
        */

        playVoice("welcome.mp3");

        showScreen("welcomeScreen");

    });

}


/* =========================================
   WELCOME → QUIZ
========================================= */

function goToGame() {

    stopAudio();

    showScreen("gameScreen");

    /*
       Play quiz introduction only after
       entering the quiz page.
    */

    setTimeout(() => {

        playVoice("quiz-intro.mp3");

    }, 300);

}


/* =========================================
   QUIZ
========================================= */

function wrongAnswer(button) {

    button.classList.remove("shake");

    void button.offsetWidth;

    button.classList.add("shake");

    const message =
        document.getElementById("gameMessage");

    if (message) {

        message.textContent =
            "Oops! Dobara try karo Aadi! 😜💖";

    }

}


function correctAnswer() {

    const message =
        document.getElementById("gameMessage");

    if (message) {

        message.textContent =
            "Yayyyy! Bilkul sahi! 🎉👑❤️";

    }

    /*
       Play downloaded correct-answer voice.
    */

    playVoice("quiz-correct.mp3");


    /*
       Wait before moving to heart game.
    */

    setTimeout(() => {

        showScreen("heartGameScreen");

        startHeartGame();

    }, 3500);

}


/* =========================================
   HEART GAME
========================================= */

let heartScore = 0;
let heartGameStarted = false;


function startHeartGame() {

    heartScore = 0;

    heartGameStarted = true;

    const score =
        document.getElementById("heartScore");

    if (score) {
        score.textContent = "0";
    }


    const message =
        document.getElementById("heartMessage");

    if (message) {

        message.textContent =
            "Tap the hearts! 👆❤️";

    }


    const area =
        document.getElementById("heartArea");

    if (!area) return;

    area.innerHTML = "";


    /*
       Play heart-game introduction
       when heart game opens.
    */

    setTimeout(() => {

        playVoice("heart-game.mp3");

    }, 300);


    /*
       Create first heart after a short delay.
    */

    setTimeout(() => {

        createHeart();

    }, 1200);

}


function createHeart() {

    if (!heartGameStarted) return;

    if (heartScore >= 7) return;


    const area =
        document.getElementById("heartArea");

    if (!area) return;


    const heart =
        document.createElement("button");

    heart.className = "heart";

    heart.innerHTML = "❤️";


    const maxX =
        Math.max(20, area.clientWidth - 65);

    const maxY =
        Math.max(20, area.clientHeight - 65);


    heart.style.left =
        Math.random() * maxX + "px";

    heart.style.top =
        Math.random() * maxY + "px";


    heart.addEventListener("click", () => {

        heartScore++;


        const score =
            document.getElementById("heartScore");

        if (score) {

            score.textContent =
                heartScore;

        }


        heart.remove();


        /*
           Play heart-caught.mp3
           every time a heart is caught.
        */

        playVoice("heart-caught.mp3");


        if (heartScore >= 7) {

            heartGameStarted = false;


            const message =
                document.getElementById("heartMessage");

            if (message) {

                message.textContent =
                    "Wowww! Aadi ne saare hearts pakad liye! 🎉❤️";

            }


            /*
               Go to Memory Garden.
            */

            setTimeout(() => {

                showScreen("memoryScreen");

                /*
                   THIS is the important part.
                   The memories voice plays when
                   the photos appear.
                */

                setTimeout(() => {

                    playVoice("memories.mp3");

                }, 400);

            }, 2500);


        } else {

            /*
               Give the next heart after
               the short audio clip begins.
            */

            setTimeout(() => {

                createHeart();

            }, 700);

        }

    });


    area.appendChild(heart);

}


/* =========================================
   MEMORY GARDEN
========================================= */


/*
   This function is called by the
   "Aadi Ke Liye Message" button.
*/

function goToMessage() {

    stopAudio();

    showScreen("messageScreen");


    /*
       Play the actual downloaded message.mp3.
    */

    setTimeout(() => {

        playVoice("message.mp3");

    }, 400);

}


/* =========================================
   MESSAGE VOICE BUTTON
========================================= */

const messageVoiceButton =
    document.getElementById("messageVoiceButton");


if (messageVoiceButton) {

    messageVoiceButton.addEventListener("click", () => {

        playVoice("message.mp3");

    });

}


/* =========================================
   GIFT SCREEN
========================================= */

function goToGift() {

    stopAudio();

    showScreen("giftScreen");


    /*
       Play gift.mp3 as soon as
       the gift page opens.
    */

    setTimeout(() => {

        playVoice("gift.mp3");

    }, 400);

}


/* =========================================
   OPEN GIFT
========================================= */

function openGift() {

    const gift =
        document.getElementById("giftBox");

    if (!gift) return;


    /*
       Prevent opening twice.
    */

    if (gift.classList.contains("opened")) {

        return;

    }


    gift.classList.add("opened");


    const hint =
        document.getElementById("giftHint");

    if (hint) {

        hint.textContent =
            "Yayyyy! Surpriseee! 🎉🎁❤️";

    }


    /*
       Continue the gift voice.
    */

    playVoice("gift.mp3");


    /*
       Confetti starts immediately.
    */

    createConfetti();


    /*
       After gift opens, go to final screen.
    */

    setTimeout(() => {

        showScreen("finalScreen");

        createConfetti();


        /*
           Play FINAL voice only on final page.
        */

        setTimeout(() => {

            playVoice("final.mp3");

        }, 500);

    }, 2500);

}


/* =========================================
   CONFETTI
========================================= */

function createConfetti() {

    const container =
        document.getElementById("confettiContainer");

    if (!container) return;


    const emojis = [

        "🎉",
        "❤️",
        "💖",
        "✨",
        "🌸",
        "🎀",
        "⭐",
        "🦋",
        "🌈",
        "🎊"

    ];


    for (let i = 0; i < 70; i++) {

        const piece =
            document.createElement("span");

        piece.className =
            "confetti";


        piece.textContent =
            emojis[
                Math.floor(
                    Math.random() * emojis.length
                )
            ];


        piece.style.left =
            Math.random() * 100 + "%";


        piece.style.animationDuration =
            (2.5 + Math.random() * 3) + "s";


        piece.style.animationDelay =
            Math.random() * 1.5 + "s";


        container.appendChild(piece);


        setTimeout(() => {

            piece.remove();

        }, 6500);

    }

}


/* =========================================
   PHOTO CLICK
========================================= */

document.addEventListener("click", event => {

    const card =
        event.target.closest(".photo-card");

    if (!card) return;


    card.animate(

        [

            {
                transform: "scale(1)"
            },

            {
                transform:
                    "scale(1.12) rotate(0deg)"
            },

            {
                transform: "scale(1)"
            }

        ],

        {
            duration: 500
        }

    );

});


/* =========================================
   PREVENT ACCIDENTAL DOUBLE TAP ZOOM
========================================= */

let lastTouchEnd = 0;


document.addEventListener(
    "touchend",
    event => {

        const now =
            Date.now();


        if (now - lastTouchEnd <= 300) {

            event.preventDefault();

        }


        lastTouchEnd = now;

    },
    false
);
