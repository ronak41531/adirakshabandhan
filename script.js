/* =========================================
   AADI RAKSHA BANDHAN WEBSITE
   VERSION 30
   REAL MP3 AUDIO
========================================= */


/* =========================================
   SCREEN LIST
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


/* =========================================
   AUDIO
========================================= */

const voicePlayer =
    document.getElementById("voicePlayer");

const voiceButton =
    document.getElementById("voiceButton");

let voiceEnabled = true;

let currentFile = "";


/* =========================================
   STOP AUDIO
========================================= */

function stopVoice() {

    if (!voicePlayer) {
        return;
    }

    voicePlayer.pause();

    try {
        voicePlayer.currentTime = 0;
    } catch (error) {
        console.log(error);
    }

    currentFile = "";
}


/* =========================================
   PLAY MP3
========================================= */

function playVoice(filename) {

    if (!voiceEnabled) {
        return Promise.resolve(false);
    }

    if (!voicePlayer) {
        return Promise.resolve(false);
    }


    stopVoice();


    currentFile = filename;

    voicePlayer.src = "./" + filename;

    voicePlayer.preload = "auto";

    voicePlayer.volume = 1;


    const playPromise =
        voicePlayer.play();


    if (playPromise) {

        return playPromise
            .then(() => {

                console.log(
                    "Playing:",
                    filename
                );

                return true;

            })
            .catch(error => {

                console.error(
                    "Audio playback failed:",
                    filename,
                    error
                );

                return false;

            });

    }

    return Promise.resolve(true);
}


/* =========================================
   PLAY MP3 AND WAIT FOR IT TO FINISH
========================================= */

function playVoiceAndWait(
    filename,
    onFinish
) {

    if (!voiceEnabled) {

        onFinish();

        return;

    }


    if (!voicePlayer) {

        onFinish();

        return;

    }


    stopVoice();


    currentFile = filename;

    voicePlayer.src = "./" + filename;

    voicePlayer.preload = "auto";

    voicePlayer.volume = 1;


    let finished = false;


    function finish() {

        if (finished) {
            return;
        }

        finished = true;


        voicePlayer.removeEventListener(
            "ended",
            finish
        );


        voicePlayer.removeEventListener(
            "error",
            finish
        );


        currentFile = "";


        onFinish();

    }


    voicePlayer.addEventListener(
        "ended",
        finish
    );


    voicePlayer.addEventListener(
        "error",
        finish
    );


    voicePlayer.play()
        .then(() => {

            console.log(
                "Playing:",
                filename
            );

        })
        .catch(error => {

            console.error(
                "Could not play:",
                filename,
                error
            );

            /*
               IMPORTANT:
               Do NOT automatically change
               the screen on play failure.

               This prevents the old problem
               where Page 2 appeared while the
               Page 1 voice was still being heard.
            */

        });

}


/* =========================================
   VOICE ON/OFF
========================================= */

if (voiceButton) {

    voiceButton.addEventListener(
        "click",
        () => {

            voiceEnabled =
                !voiceEnabled;


            voiceButton.textContent =
                voiceEnabled
                    ? "🔊"
                    : "🔇";


            if (!voiceEnabled) {

                stopVoice();

            }

        }
    );

}


/* =========================================
   START
========================================= */

const startButton =
    document.getElementById(
        "startButton"
    );


if (startButton) {

    startButton.addEventListener(
        "click",
        () => {

            /*
               IMPORTANT:

               Page 1 stays visible.

               welcome.mp3 starts here.

               Page 2 appears ONLY after
               welcome.mp3 actually ends.
            */

            if (!voiceEnabled) {

                showScreen(
                    "welcomeScreen"
                );

                return;

            }


            stopVoice();


            if (!voicePlayer) {

                showScreen(
                    "welcomeScreen"
                );

                return;

            }


            const audio = voicePlayer;


            audio.src =
                "./welcome.mp3";


            audio.preload =
                "auto";


            audio.volume = 1;


            currentFile =
                "welcome.mp3";


            let moved =
                false;


            function moveToNextPage() {

                if (moved) {
                    return;
                }


                moved = true;


                audio.removeEventListener(
                    "ended",
                    moveToNextPage
                );


                audio.removeEventListener(
                    "error",
                    audioError
                );


                if (
                    currentFile ===
                    "welcome.mp3"
                ) {

                    currentFile = "";

                }


                showScreen(
                    "welcomeScreen"
                );

            }


            function audioError() {

                /*
                   DO NOT change the screen.

                   Keep Page 1 visible.

                   This is better than switching
                   pages while audio is unresolved.
                */

                console.error(
                    "welcome.mp3 could not be loaded."
                );

            }


            audio.addEventListener(
                "ended",
                moveToNextPage,
                { once: true }
            );


            audio.addEventListener(
                "error",
                audioError,
                { once: true }
            );


            audio.play()
                .then(() => {

                    console.log(
                        "welcome.mp3 playing"
                    );

                })
                .catch(error => {

                    console.error(
                        "welcome.mp3 playback blocked:",
                        error
                    );

                });

        }
    );

}


/* =========================================
   SHOW SCREEN
========================================= */

function showScreen(id) {

    screens.forEach(screenId => {

        const screen =
            document.getElementById(
                screenId
            );


        if (screen) {

            screen.classList.add(
                "hidden"
            );

        }

    });


    const selected =
        document.getElementById(id);


    if (!selected) {

        console.error(
            "Screen not found:",
            id
        );

        return;

    }


    selected.classList.remove(
        "hidden"
    );


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =========================================
   WELCOME → QUIZ
========================================= */

function goToGame() {

    stopVoice();

    showScreen(
        "gameScreen"
    );


    setTimeout(() => {

        playVoice(
            "quiz-intro.mp3"
        );

    }, 250);

}


/* =========================================
   WRONG QUIZ ANSWER
========================================= */

function wrongAnswer(button) {

    if (!button) {
        return;
    }


    button.classList.remove(
        "shake"
    );


    void button.offsetWidth;


    button.classList.add(
        "shake"
    );


    const message =
        document.getElementById(
            "gameMessage"
        );


    if (message) {

        message.textContent =
            "Oops! Dobara try karo Aadi! 😜💖";

    }

}


/* =========================================
   CORRECT QUIZ ANSWER
========================================= */

let quizDone = false;


function correctAnswer() {

    if (quizDone) {
        return;
    }


    quizDone = true;


    const message =
        document.getElementById(
            "gameMessage"
        );


    if (message) {

        message.textContent =
            "Yayyyy! Bilkul sahi! 🎉👑❤️";

    }


    playVoiceAndWait(
        "quiz-correct.mp3",
        () => {

            showScreen(
                "heartGameScreen"
            );


            startHeartGame();

        }
    );

}


/* =========================================
   HEART GAME
========================================= */

let heartScore = 0;

let heartGameStarted = false;

let heartFinishing = false;


function startHeartGame() {

    heartScore = 0;

    heartGameStarted = true;

    heartFinishing = false;


    const score =
        document.getElementById(
            "heartScore"
        );


    if (score) {

        score.textContent = "0";

    }


    const message =
        document.getElementById(
            "heartMessage"
        );


    if (message) {

        message.textContent =
            "Listen carefully... ❤️";

    }


    const area =
        document.getElementById(
            "heartArea"
        );


    if (!area) {
        return;
    }


    area.innerHTML = "";


    playVoiceAndWait(
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
        document.getElementById(
            "heartArea"
        );


    if (!area) {
        return;
    }


    const heart =
        document.createElement(
            "button"
        );


    heart.className =
        "heart";


    heart.type =
        "button";


    heart.innerHTML =
        "❤️";


    heart.setAttribute(
        "aria-label",
        "Catch heart"
    );


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
        Math.random() *
            maxX +
        "px";


    heart.style.top =
        Math.random() *
            maxY +
        "px";


    heart.addEventListener(
        "click",
        () => {

            if (!heartGameStarted) {
                return;
            }


            if (heartFinishing) {
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
               Play short heart voice.
            */

            playVoiceAndWait(
                "heart-caught.mp3",
                () => {

                    /*
                       Last heart.
                    */

                    if (
                        heartScore >= 7
                    ) {

                        heartFinishing =
                            true;

                        heartGameStarted =
                            false;


                        const message =
                            document.getElementById(
                                "heartMessage"
                            );


                        if (message) {

                            message.textContent =
                                "Wowww! Aadi ne saare hearts pakad liye! 🎉❤️";

                        }


                        /*
                           Open Memory Garden.
                        */

                        showScreen(
                            "memoryScreen"
                        );


                        /*
                           Photos are visible.

                           Now play memories.mp3.

                           When it FINISHES, move
                           automatically to Message.
                        */

                        playVoiceAndWait(
                            "memories.mp3",
                            () => {

                                goToMessage();

                            }
                        );

                    }

                    else {

                        createHeart();

                    }

                }
            );

        }
    );


    area.appendChild(
        heart
    );

}


/* =========================================
   MEMORY → MESSAGE
========================================= */

function goToMessage() {

    stopVoice();


    showScreen(
        "messageScreen"
    );


    setTimeout(() => {

        playVoice(
            "message.mp3"
        );

    }, 250);

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

            playVoice(
                "message.mp3"
            );

        }
    );

}


/* =========================================
   MESSAGE → GIFT
========================================= */

function goToGift() {

    stopVoice();


    showScreen(
        "giftScreen"
    );


    setTimeout(() => {

        playVoice(
            "gift.mp3"
        );

    }, 250);

}


/* =========================================
   OPEN GIFT
========================================= */

let giftAlreadyOpened = false;


function openGift() {

    if (giftAlreadyOpened) {
        return;
    }


    giftAlreadyOpened = true;


    const gift =
        document.getElementById(
            "giftBox"
        );


    if (!gift) {
        return;
    }


    gift.classList.add(
        "opened"
    );


    const hint =
        document.getElementById(
            "giftHint"
        );


    if (hint) {

        hint.textContent =
            "Yayyyy! Surpriseee! 🎉🎁❤️";

    }


    stopVoice();


    createConfetti();


    setTimeout(() => {

        showScreen(
            "finalScreen"
        );


        createConfetti();


        setTimeout(() => {

            playVoice(
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
            Math.random() *
                100 +
            "%";


        piece.style.animationDuration =
            (
                2.5 +
                Math.random() *
                3
            ) +
            "s";


        piece.style.animationDelay =
            Math.random() *
                1.5 +
            "s";


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
