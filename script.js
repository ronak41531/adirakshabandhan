/* =========================================
   AADI RAKSHA BANDHAN WEBSITE
   EXACT MP3 VOICE SYSTEM
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
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================================
   EXACT MP3 VOICE SYSTEM
========================================= */

let voiceEnabled = true;
let currentAudio = null;

const voiceButton = document.getElementById("voiceButton");


/*
   Play one of YOUR uploaded MP3 files.
*/

function playVoice(filename) {

    if (!voiceEnabled) return;

    // Stop previous voice
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }

    currentAudio = new Audio("./" + filename);

    currentAudio.volume = 1;

    currentAudio.play().catch(error => {
        console.log("Audio could not play:", filename, error);
    });
}


/*
   Stop voice.
*/

function stopVoice() {

    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }
}


/*
   Voice button
*/

if (voiceButton) {

    voiceButton.addEventListener("click", () => {

        voiceEnabled = !voiceEnabled;

        voiceButton.textContent =
            voiceEnabled ? "🔊" : "🔇";

        if (!voiceEnabled) {
            stopVoice();
        }

    });

}


/* =========================================
   START SCREEN
========================================= */

const startButton = document.getElementById("startButton");

if (startButton) {

    startButton.addEventListener("click", () => {

        /*
           This click gives the browser permission
           to play audio.
        */

        playVoice("welcome.mp3");

        showScreen("welcomeScreen");

    });

}


/* =========================================
   WELCOME SCREEN
========================================= */

function goToGame() {

    playVoice("quiz-intro.mp3");

    showScreen("gameScreen");

}


/* =========================================
   QUIZ GAME
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

    /*
       No wrong-answer MP3 exists,
       so don't create a fake browser voice.
    */

}


function correctAnswer() {

    const message =
        document.getElementById("gameMessage");

    if (message) {

        message.textContent =
            "Yayyyy! Bilkul sahi! 🎉👑❤️";

    }

    playVoice("quiz-correct.mp3");

    setTimeout(() => {

        showScreen("heartGameScreen");

        startHeartGame();

    }, 1800);

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
       Play heart-game introduction.
    */

    playVoice("heart-game.mp3");

    /*
       Wait a little so the introduction
       can start before the first heart appears.
    */

    setTimeout(() => {

        if (heartGameStarted) {
            createHeart();
        }

    }, 700);

}


/* =========================================
   CREATE HEART
========================================= */

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

        if (!heartGameStarted) return;

        heartScore++;

        const score =
            document.getElementById("heartScore");

        if (score) {
            score.textContent = heartScore;
        }

        heart.remove();


        /*
           Final heart
        */

        if (heartScore >= 7) {

            heartGameStarted = false;

            const message =
                document.getElementById("heartMessage");

            if (message) {

                message.textContent =
                    "Wowww! Aadi ne saare hearts pakad liye! 🎉❤️";

            }

            playVoice("heart-caught.mp3");


            setTimeout(() => {

                showScreen("memoryScreen");

                /*
                   Memory Garden voice
                */

                setTimeout(() => {
                    playVoice("memories.mp3");
                }, 400);

            }, 2200);

        }

        else {

            /*
               There is no separate voice for every heart.
               We simply create the next heart.
            */

            setTimeout(() => {

                if (heartGameStarted) {
                    createHeart();
                }

            }, 350);

        }

    });


    area.appendChild(heart);

}


/* =========================================
   MEMORY GARDEN
========================================= */

function goToMessage() {

    stopVoice();

    showScreen("messageScreen");

    /*
       Give the screen a moment to appear,
       then play YOUR message.mp3.
    */

    setTimeout(() => {

        playVoice("message.mp3");

    }, 500);

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

    stopVoice();

    showScreen("giftScreen");

    setTimeout(() => {

        playVoice("gift.mp3");

    }, 500);

}


/* =========================================
   OPEN GIFT
========================================= */

function openGift() {

    const gift =
        document.getElementById("giftBox");

    if (!gift) return;

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
       Gift voice has already played
       when entering this page.

       Stop it before final voice.
    */

    stopVoice();

    createConfetti();

    setTimeout(() => {

        showScreen("finalScreen");

        createConfetti();

        /*
           Final exact MP3
        */

        setTimeout(() => {

            playVoice("final.mp3");

        }, 500);

    }, 1800);

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

        piece.className = "confetti";

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
                transform: "scale(1.12) rotate(0deg)"
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

        const now = Date.now();

        if (now - lastTouchEnd <= 300) {

            event.preventDefault();

        }

        lastTouchEnd = now;

    },
    false
);
