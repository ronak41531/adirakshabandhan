/* =========================================
   AADI RAKSHA BANDHAN
   FINAL FIXED VERSION
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

let voiceEnabled = true;
let currentAudio = null;


/* =========================================
   SCREEN CONTROL
========================================= */

function showScreen(id) {

    screens.forEach(screenId => {

        const screen = document.getElementById(screenId);

        if (screen) {
            screen.classList.add("hidden");
        }

    });

    const target = document.getElementById(id);

    if (!target) {
        console.error("Screen not found:", id);
        return;
    }

    target.classList.remove("hidden");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================================
   AUDIO
========================================= */

function stopAudio() {

    if (!currentAudio) {
        return;
    }

    currentAudio.pause();

    try {
        currentAudio.currentTime = 0;
    } catch (e) {
        console.log(e);
    }

    currentAudio = null;
}


function playAudio(filename, callback) {

    if (!voiceEnabled) {

        if (callback) {
            callback(false);
        }

        return null;
    }

    stopAudio();

    const audio = new Audio("./" + filename);

    audio.preload = "auto";
    audio.volume = 1;

    currentAudio = audio;

    let finished = false;

    function done(success) {

        if (finished) {
            return;
        }

        finished = true;

        audio.removeEventListener("ended", onEnded);
        audio.removeEventListener("error", onError);

        if (currentAudio === audio) {
            currentAudio = null;
        }

        if (callback) {
            callback(success);
        }
    }

    function onEnded() {
        done(true);
    }

    function onError(e) {

        console.error(
            "Audio error:",
            filename,
            e
        );

        /*
           IMPORTANT:
           Do NOT automatically move to
           another page when audio fails.
        */

        done(false);
    }

    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);

    audio.play()
        .then(() => {

            console.log(
                "Playing exact file:",
                filename
            );

        })
        .catch(error => {

            console.error(
                "Play blocked:",
                filename,
                error
            );

            /*
               Keep the current page.
               Never jump ahead because of
               an autoplay/audio error.
            */

            done(false);
        });

    return audio;
}


/* =========================================
   VOICE BUTTON
========================================= */

const voiceButton =
    document.getElementById("voiceButton");

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
   START
========================================= */

const startButton =
    document.getElementById("startButton");

if (startButton) {

    startButton.addEventListener("click", () => {

        /*
           IMPORTANT:
           Page 1 stays visible.

           welcome.mp3 must finish before
           Page 2 appears.
        */

        if (!voiceEnabled) {

            showScreen("welcomeScreen");

            return;
        }

        stopAudio();

        const audio =
            new Audio("./welcome.mp3");

        audio.preload = "auto";
        audio.volume = 1;

        currentAudio = audio;

        let moved = false;

        function goNext() {

            if (moved) {
                return;
            }

            moved = true;

            if (currentAudio === audio) {
                currentAudio = null;
            }

            showScreen("welcomeScreen");
        }

        audio.addEventListener(
            "ended",
            goNext,
            { once: true }
        );

        /*
           IMPORTANT:
           On error we DO NOT change page.
           This prevents your exact problem.
        */

        audio.addEventListener(
            "error",
            () => {

                console.error(
                    "welcome.mp3 could not be loaded."
                );

            },
            { once: true }
        );

        audio.play()
            .then(() => {

                console.log(
                    "welcome.mp3 started"
                );

            })
            .catch(error => {

                console.error(
                    "welcome.mp3 playback failed:",
                    error
                );

            });

    });

}


/* =========================================
   WELCOME → QUIZ
========================================= */

function goToGame() {

    stopAudio();

    showScreen("gameScreen");

    setTimeout(() => {

        playAudio("quiz-intro.mp3");

    }, 200);

}


/* =========================================
   WRONG ANSWER
========================================= */

function wrongAnswer(button) {

    if (!button) {
        return;
    }

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


/* =========================================
   CORRECT ANSWER
========================================= */

let quizFinished = false;

function correctAnswer() {

    if (quizFinished) {
        return;
    }

    quizFinished = true;

    const message =
        document.getElementById("gameMessage");

    if (message) {

        message.textContent =
            "Yayyyyy! Bilkul sahi! 🎉👑❤️";

    }

    playAudio(
        "quiz-correct.mp3",
        (success) => {

            /*
               Even if audio has a temporary issue,
               still allow the game to continue.
            */

            showScreen("heartGameScreen");

            startHeartGame();

        }
    );

}


/* =========================================
   HEART GAME
========================================= */

let heartScore = 0;
let heartGameStarted = false;
let memoryStarted = false;


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
            "Listen carefully... ❤️";

    }

    const area =
        document.getElementById("heartArea");

    if (!area) {
        return;
    }

    area.innerHTML = "";

    playAudio(
        "heart-game.mp3",
        () => {

            if (!heartGameStarted) {
                return;
            }

            if (message) {

                message.textContent =
                    "Tap the hearts! 👆❤️";

            }

            createHeart();

        }
    );

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

    if (!area) {
        return;
    }

    const heart =
        document.createElement("button");

    heart.className = "heart";
    heart.type = "button";
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


    heart.addEventListener(
        "click",
        () => {

            if (!heartGameStarted) {
                return;
            }

            heartScore++;

            const score =
                document.getElementById(
                    "heartScore"
                );

            if (score) {

                score.textContent =
                    heartScore;

            }

            heart.remove();


            /*
               Short downloaded MP3.
            */

            playAudio(
                "heart-caught.mp3",
                () => {

                    /*
                       Last heart
                    */

                    if (heartScore >= 7) {

                        heartGameStarted =
                            false;

                        goToMemoryGarden();

                    }

                    /*
                       More hearts
                    */

                    else {

                        createHeart();

                    }

                }
            );

        }
    );


    area.appendChild(heart);

}


/* =========================================
   MEMORY GARDEN
========================================= */

function goToMemoryGarden() {

    if (memoryStarted) {
        return;
    }

    memoryStarted = true;

    showScreen("memoryScreen");

    /*
       Photos are already visible.

       Play memories.mp3.
    */

    playAudio(
        "memories.mp3",
        () => {

            /*
               AUTOMATICALLY continue to
               the message after the memory
               recording finishes.
            */

            goToMessage();

        }
    );

}


/* =========================================
   MEMORY → MESSAGE
========================================= */

let messagePageStarted = false;


function goToMessage() {

    if (messagePageStarted) {
        return;
    }

    messagePageStarted = true;

    stopAudio();

    showScreen("messageScreen");

    setTimeout(() => {

        playAudio(
            "message.mp3"
        );

    }, 200);

}


/* =========================================
   MESSAGE REPLAY
========================================= */

const messageVoiceButton =
    document.getElementById(
        "messageVoiceButton"
    );

if (messageVoiceButton) {

    messageVoiceButton.addEventListener(
        "click",
        () => {

            playAudio(
                "message.mp3"
            );

        }
    );

}


/* =========================================
   MESSAGE → GIFT
========================================= */

function goToGift() {

    stopAudio();

    showScreen("giftScreen");

    setTimeout(() => {

        playAudio(
            "gift.mp3"
        );

    }, 200);

}


/* =========================================
   OPEN GIFT
========================================= */

let giftOpened = false;


function openGift() {

    if (giftOpened) {
        return;
    }

    giftOpened = true;

    const gift =
        document.getElementById("giftBox");

    if (!gift) {
        return;
    }

    gift.classList.add("opened");

    const hint =
        document.getElementById("giftHint");

    if (hint) {

        hint.textContent =
            "Yayyyy! Surpriseee! 🎉🎁❤️";

    }

    stopAudio();

    createConfetti();

    setTimeout(() => {

        showScreen("finalScreen");

        createConfetti();

        setTimeout(() => {

            playAudio(
                "final.mp3"
            );

        }, 300);

    }, 1800);

}


/* =========================================
   GIFT KEYBOARD
========================================= */

function handleGiftKey(event) {

    if (
        event.key === "Enter" ||
        event.key === " "
    ) {

        event.preventDefault();

        openGift();

    }

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

    for (
        let i = 0;
        i < 70;
        i++
    ) {

        const piece =
            document.createElement(
                "span"
            );

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


console.log(
    "Aadi Raksha Bandhan final script loaded."
);
