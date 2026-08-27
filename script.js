/* =========================================
   AADI RAKSHA BANDHAN WEBSITE
   REAL MP3 VOICE SYSTEM
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
   REAL MP3 VOICE SYSTEM
========================================= */

let voiceEnabled = true;

let currentAudio = null;


const voiceButton =
    document.getElementById("voiceButton");


/*
   All MP3 files are in the ROOT
   of your GitHub repository.
*/

const audioFiles = {

    welcome: "welcome.mp3",

    quizIntro: "quiz-intro.mp3",

    quizCorrect: "quiz-correct.mp3",

    heartGame: "heart-game.mp3",

    heartCaught: "heart-caught.mp3",

    memories: "memories.mp3",

    message: "message.mp3",

    gift: "gift.mp3",

    final: "final.mp3"

};


/* =========================================
   PLAY AUDIO
========================================= */

function playVoice(name) {

    if (!voiceEnabled) {
        return;
    }

    const file = audioFiles[name];

    if (!file) {
        console.log("Audio file not found:", name);
        return;
    }


    /*
       Stop previous audio.
    */

    if (currentAudio) {

        currentAudio.pause();

        currentAudio.currentTime = 0;

    }


    /*
       Create audio from MP3.
    */

    currentAudio = new Audio(file);

    currentAudio.volume = 1;


    /*
       Play exact downloaded MP3.
    */

    const playPromise = currentAudio.play();

    if (playPromise !== undefined) {

        playPromise.catch(error => {

            console.log(
                "Audio could not play:",
                error
            );

        });

    }

}


/* =========================================
   STOP AUDIO
========================================= */

function stopVoice() {

    if (currentAudio) {

        currentAudio.pause();

        currentAudio.currentTime = 0;

    }

}


/* =========================================
   VOICE BUTTON
========================================= */

voiceButton.addEventListener("click", () => {

    voiceEnabled = !voiceEnabled;


    voiceButton.textContent =
        voiceEnabled ? "🔊" : "🔇";


    if (!voiceEnabled) {

        stopVoice();

    }

});


/* =========================================
   START
========================================= */

document
    .getElementById("startButton")
    .addEventListener("click", () => {


        /*
           Because the user clicked this button,
           the browser allows the MP3 to play.
        */

        playVoice("welcome");


        setTimeout(() => {

            showScreen("welcomeScreen");

        }, 800);

    });


/* =========================================
   WELCOME
========================================= */

function goToGame() {

    playVoice("quizIntro");

    showScreen("gameScreen");

}


/* =========================================
   QUIZ
========================================= */

function wrongAnswer(button) {

    button.classList.remove("shake");

    void button.offsetWidth;

    button.classList.add("shake");


    document
        .getElementById("gameMessage")
        .textContent =
        "Oops! Dobara try karo Aadi! 😜💖";

}


/* =========================================
   CORRECT ANSWER
========================================= */

function correctAnswer() {

    document
        .getElementById("gameMessage")
        .textContent =
        "Yayyyy! Bilkul sahi! 🎉👑❤️";


    playVoice("quizCorrect");


    setTimeout(() => {

        showScreen("heartGameScreen");

        playVoice("heartGame");

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


    document
        .getElementById("heartScore")
        .textContent = heartScore;


    document
        .getElementById("heartMessage")
        .textContent =
        "Tap the hearts! 👆❤️";


    const area =
        document.getElementById("heartArea");


    area.innerHTML = "";


    heartGameStarted = true;


    createHeart();

}


/* =========================================
   CREATE HEART
========================================= */

function createHeart() {

    if (!heartGameStarted) {
        return;
    }


    if (heartScore >= 7) {
        return;
    }


    const area =
        document.getElementById("heartArea");


    const heart =
        document.createElement("button");


    heart.className = "heart";

    heart.innerHTML = "❤️";


    const maxX =
        Math.max(
            20,
            area.clientWidth - 65
        );


    const maxY =
        Math.max(
            20,
            area.clientHeight - 65
        );


    heart.style.left =
        Math.random() * maxX + "px";


    heart.style.top =
        Math.random() * maxY + "px";


    heart.addEventListener("click", () => {


        heartScore++;


        document
            .getElementById("heartScore")
            .textContent =
            heartScore;


        heart.remove();


        /*
           Play YOUR downloaded
           heart-caught.mp3
        */

        playVoice("heartCaught");


        if (heartScore >= 7) {


            heartGameStarted = false;


            document
                .getElementById("heartMessage")
                .textContent =
                "Wowww! Aadi ne saare hearts pakad liye! 🎉❤️";


            setTimeout(() => {

                showScreen("memoryScreen");

                playVoice("memories");

            }, 1800);


        } else {


            setTimeout(
                createHeart,
                300
            );

        }

    });


    area.appendChild(heart);

}


/* =========================================
   MESSAGE
========================================= */

function goToMessage() {

    showScreen("messageScreen");


    setTimeout(() => {

        playVoice("message");

    }, 500);

}


/* =========================================
   MESSAGE BUTTON
========================================= */

document
    .getElementById("messageVoiceButton")
    .addEventListener("click", () => {

        playVoice("message");

    });


/* =========================================
   GIFT
========================================= */

function goToGift() {

    playVoice("gift");

    showScreen("giftScreen");

}


/* =========================================
   OPEN GIFT
========================================= */

function openGift() {

    const gift =
        document.getElementById("giftBox");


    if (gift.classList.contains("opened")) {
        return;
    }


    gift.classList.add("opened");


    document
        .getElementById("giftHint")
        .textContent =
        "Yayyyy! Surpriseee! 🎉🎁❤️";


    playVoice("gift");


    createConfetti();


    setTimeout(() => {


        showScreen("finalScreen");


        createConfetti();


        setTimeout(() => {

            playVoice("final");

        }, 500);


    }, 1800);

}


/* =========================================
   CONFETTI
========================================= */

function createConfetti() {

    const container =
        document.getElementById(
            "confettiContainer"
        );


    if (!container) {
        return;
    }


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
                    Math.random() *
                    emojis.length
                )
            ];


        piece.style.left =
            Math.random() * 100 + "%";


        piece.style.animationDuration =
            (
                2.5 +
                Math.random() * 3
            ) + "s";


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

document.addEventListener(
    "click",
    event => {


        if (
            event.target.closest(
                ".photo-card"
            )
        ) {


            const card =
                event.target.closest(
                    ".photo-card"
                );


            card.animate(
                [
                    {
                        transform:
                            "scale(1)"
                    },

                    {
                        transform:
                            "scale(1.12) rotate(0deg)"
                    },

                    {
                        transform:
                            "scale(1)"
                    }
                ],

                {
                    duration: 500
                }
            );

        }

    }
);


/* =========================================
   MOBILE DOUBLE TAP
========================================= */

let lastTouchEnd = 0;


document.addEventListener(
    "touchend",
    event => {


        const now =
            Date.now();


        if (
            now - lastTouchEnd <= 300
        ) {

            event.preventDefault();

        }


        lastTouchEnd = now;

    },
    false
);
