/* =========================================
   AADI RAKSHA BANDHAN WEBSITE
   FINAL AUDIO + PAGE FLOW
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
   AUDIO SYSTEM
========================================= */

let voiceEnabled = true;
let currentAudio = null;


/* Stop current audio */

function stopAudio() {

    if (currentAudio) {

        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio = null;

    }

}


/*
   Play an MP3 normally.
*/

function playVoice(filename) {

    if (!voiceEnabled) {
        return null;
    }

    stopAudio();

    currentAudio = new Audio("./" + filename);

    currentAudio.preload = "auto";
    currentAudio.volume = 1;

    currentAudio.play().catch(error => {

        console.error(
            "Could not play:",
            filename,
            error
        );

    });

    return currentAudio;
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
   START BUTTON
========================================= */

const startButton =
    document.getElementById("startButton");


if (startButton) {

    startButton.addEventListener("click", function () {

        /*
           IMPORTANT:
           DO NOT CHANGE PAGE HERE.

           Page 1 remains visible while
           welcome.mp3 is playing.
        */

        if (!voiceEnabled) {

            showScreen("welcomeScreen");

            return;

        }


        stopAudio();


        const audio =
            new Audio("./welcome.mp3");


        currentAudio = audio;


        audio.preload = "auto";
        audio.volume = 1;


        /*
           ONLY after welcome.mp3 finishes
           do we open Page 2.
        */

        audio.addEventListener(
            "ended",
            function () {

                showScreen("welcomeScreen");

            },
            { once: true }
        );


        /*
           If the MP3 fails, continue anyway.
        */

        audio.addEventListener(
            "error",
            function () {

                console.error(
                    "welcome.mp3 could not be loaded."
                );

                showScreen("welcomeScreen");

            },
            { once: true }
        );


        /*
           User clicked the button,
           so mobile browsers normally
           allow this audio to play.
        */

        audio.play().catch(error => {

            console.error(
                "welcome.mp3 playback failed:",
                error
            );

            showScreen("welcomeScreen");

        });

    });

}


/* =========================================
   WELCOME → QUIZ
========================================= */

function goToGame() {

    stopAudio();

    showScreen("gameScreen");


    /*
       Quiz voice plays AFTER
       quiz screen appears.
    */

    setTimeout(() => {

        playVoice("quiz-intro.mp3");

    }, 300);

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

function correctAnswer() {

    const message =
        document.getElementById("gameMessage");


    if (message) {

        message.textContent =
            "Yayyyy! Bilkul sahi! 🎉👑❤️";

    }


    /*
       Play exact downloaded voice.
    */

    playVoice("quiz-correct.mp3");


    /*
       Wait for the correct-answer
       voice to finish.
    */

    if (currentAudio) {

        currentAudio.addEventListener(
            "ended",
            () => {

                showScreen("heartGameScreen");

                startHeartGame();

            },
            { once: true }
        );

    } else {

        showScreen("heartGameScreen");

        startHeartGame();

    }

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


    if (!area) {
        return;
    }


    area.innerHTML = "";


    /*
       Heart game introduction.
    */

    playVoice("heart-game.mp3");


    /*
       Wait for heart-game voice to finish
       before showing the first heart.
    */

    if (currentAudio) {

        currentAudio.addEventListener(
            "ended",
            () => {

                if (heartGameStarted) {
                    createHeart();
                }

            },
            { once: true }
        );

    } else {

        createHeart();

    }

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
        function () {

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
               Play short heart-caught.mp3
            */

            playVoice("heart-caught.mp3");


            /*
               If 7 hearts are completed.
            */

            if (heartScore >= 7) {

                heartGameStarted = false;


                const message =
                    document.getElementById(
                        "heartMessage"
                    );


                if (message) {

                    message.textContent =
                        "Wowww! Aadi ne saare hearts pakad liye! 🎉❤️";

                }


                /*
                   Wait for heart-caught sound
                   to finish before Memory Garden.
                */

                if (currentAudio) {

                    currentAudio.addEventListener(
                        "ended",
                        goToMemories,
                        { once: true }
                    );

                } else {

                    goToMemories();

                }


            } else {

                /*
                   Create the next heart
                   after the short voice finishes.
                */

                if (currentAudio) {

                    currentAudio.addEventListener(
                        "ended",
                        () => {

                            if (heartGameStarted) {
                                createHeart();
                            }

                        },
                        { once: true }
                    );

                } else {

                    setTimeout(
                        createHeart,
                        500
                    );

                }

            }

        }
    );


    area.appendChild(heart);

}


/* =========================================
   GO TO MEMORY GARDEN
========================================= */

function goToMemories() {

    showScreen("memoryScreen");


    /*
       Play memories.mp3 when
       the photos appear.
    */

    setTimeout(() => {

        playVoice("memories.mp3");

    }, 300);

}


/* =========================================
   MEMORY → MESSAGE
========================================= */

function goToMessage() {

    stopAudio();

    showScreen("messageScreen");


    setTimeout(() => {

        playVoice("message.mp3");

    }, 300);

}


/* =========================================
   MESSAGE REPLAY BUTTON
========================================= */

const messageVoiceButton =
    document.getElementById(
        "messageVoiceButton"
    );


if (messageVoiceButton) {

    messageVoiceButton.addEventListener(
        "click",
        () => {

            playVoice("message.mp3");

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

        playVoice("gift.mp3");

    }, 300);

}


/* =========================================
   OPEN GIFT
========================================= */

function openGift() {

    const gift =
        document.getElementById("giftBox");


    if (!gift) {
        return;
    }


    if (
        gift.classList.contains("opened")
    ) {

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

            playVoice("final.mp3");

        }, 400);

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


    for (
        let i = 0;
        i < 70;
        i++
    ) {

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


        container.appendChild(
            piece
        );


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
