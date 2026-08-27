/* =========================================
   AADI RAKSHA BANDHAN WEBSITE
   EXACT DOWNLOADED MP3 VOICE SYSTEM
   VERSION 3
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
   EXACT MP3 VOICE SYSTEM
========================================= */

let voiceEnabled = true;
let currentAudio = null;


/*
   IMPORTANT:
   All audio files are in the ROOT
   of the GitHub repository.

   ?v=3 forces the browser to get
   the newest version instead of an
   old cached file.
*/

const audioFiles = {

    welcome:
        "./welcome.mp3?v=3",

    quizIntro:
        "./quiz-intro.mp3?v=3",

    quizCorrect:
        "./quiz-correct.mp3?v=3",

    heartGame:
        "./heart-game.mp3?v=3",

    heartCaught:
        "./heart-caught.mp3?v=3",

    memories:
        "./memories.mp3?v=3",

    message:
        "./message.mp3?v=3",

    gift:
        "./gift.mp3?v=3",

    final:
        "./final.mp3?v=3"
};


/* =========================================
   PRELOAD AUDIO
========================================= */

const preloadedAudio = {};

Object.keys(audioFiles).forEach(name => {

    const audio = new Audio();

    audio.preload = "auto";

    audio.src = audioFiles[name];

    preloadedAudio[name] = audio;

});


/* =========================================
   PLAY EXACT MP3
========================================= */

function playVoice(name) {

    if (!voiceEnabled) {
        return;
    }

    if (!audioFiles[name]) {
        console.error("Audio file does not exist:", name);
        return;
    }


    /* Stop previous audio */

    if (currentAudio) {

        currentAudio.pause();

        currentAudio.currentTime = 0;
    }


    /*
       Create a completely fresh Audio object.
       This prevents old browser audio from being reused.
    */

    currentAudio = new Audio(audioFiles[name]);

    currentAudio.preload = "auto";

    currentAudio.volume = 1.0;


    /*
       IMPORTANT:
       Play the EXACT MP3 uploaded to GitHub.
    */

    currentAudio.play()
        .then(() => {

            console.log(
                "Playing exact MP3:",
                audioFiles[name]
            );

        })
        .catch(error => {

            console.error(
                "Could not play MP3:",
                audioFiles[name],
                error
            );

        });
}


/* =========================================
   STOP VOICE
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

const voiceButton =
    document.getElementById("voiceButton");


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
           This click gives the browser
           permission to play audio.
        */

        playVoice("welcome");


        setTimeout(() => {

            showScreen("welcomeScreen");

        }, 800);

    });


/* =========================================
   WELCOME → QUIZ
========================================= */

function goToGame() {

    playVoice("quizIntro");

    showScreen("gameScreen");
}


/* =========================================
   QUIZ WRONG ANSWER
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
   QUIZ CORRECT ANSWER
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
           EXACT downloaded heart sound
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
   MEMORY → MESSAGE
========================================= */

function goToMessage() {

    showScreen("messageScreen");


    setTimeout(() => {

        playVoice("message");

    }, 500);

}


/* =========================================
   MESSAGE VOICE BUTTON
========================================= */

document
    .getElementById("messageVoiceButton")
    .addEventListener("click", () => {

        playVoice("message");

    });


/* =========================================
   MESSAGE → GIFT
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


    /*
       Play exact downloaded gift MP3
    */

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
   PHOTO CLICK EFFECT
========================================= */

document.addEventListener(
    "click",
    event => {

        const card =
            event.target.closest(
                ".photo-card"
            );


        if (!card) {
            return;
        }


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


/* =========================================
   DEBUG MESSAGE
========================================= */

console.log(
    "Aadi Raksha Bandhan Website - Version 3 loaded"
);

console.log(
    "Exact MP3 voice system active"
);

console.log(
    "Photos expected in repository root"
);
