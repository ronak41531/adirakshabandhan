/* =========================================
   AADI RAKSHA BANDHAN
   FINAL VERSION 20
   REAL MP3 + COMPLETE FLOW
========================================= */


/* =========================================
   SCREENS
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
   SHOW SCREEN
========================================= */

function showScreen(id) {

    screens.forEach(screenId => {

        const screen =
            document.getElementById(screenId);

        if (screen) {
            screen.classList.add("hidden");
        }

    });


    const selected =
        document.getElementById(id);

    if (!selected) {
        console.error("Screen not found:", id);
        return;
    }


    selected.classList.remove("hidden");


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


/*
   Version number prevents cached audio/JS
   from causing old files to load.
*/

const AUDIO_VERSION = "20";


/*
   Create the exact GitHub audio URL.
*/

function audioPath(filename) {

    return "./" +
        filename +
        "?v=" +
        AUDIO_VERSION;

}


/* =========================================
   STOP AUDIO
========================================= */

function stopAudio() {

    if (!currentAudio) {
        return;
    }


    currentAudio.pause();

    try {
        currentAudio.currentTime = 0;
    } catch (error) {
        console.log(error);
    }


    currentAudio = null;

}


/* =========================================
   PLAY AUDIO
   RETURNS THE AUDIO OBJECT
========================================= */

function playVoice(filename) {

    if (!voiceEnabled) {
        return null;
    }


    stopAudio();


    const audio =
        new Audio(audioPath(filename));


    audio.preload = "auto";

    audio.volume = 1;


    currentAudio = audio;


    audio.addEventListener(
        "error",
        () => {

            console.error(
                "Could not load audio:",
                filename
            );

        },
        { once: true }
    );


    const promise =
        audio.play();


    if (promise) {

        promise.catch(error => {

            console.error(
                "Could not play:",
                filename,
                error
            );

        });

    }


    return audio;

}


/* =========================================
   PLAY AUDIO AND WAIT UNTIL FINISHED
========================================= */

function playVoiceAndWait(
    filename,
    onFinished
) {

    if (!voiceEnabled) {

        onFinished();

        return;

    }


    const audio =
        playVoice(filename);


    if (!audio) {

        onFinished();

        return;

    }


    let finished = false;


    function finish() {

        if (finished) {
            return;
        }

        finished = true;


        if (currentAudio === audio) {
            currentAudio = null;
        }


        onFinished();

    }


    audio.addEventListener(
        "ended",
        finish,
        { once: true }
    );


    audio.addEventListener(
        "error",
        finish,
        { once: true }
    );

}


/* =========================================
   VOICE BUTTON
========================================= */

const voiceButton =
    document.getElementById(
        "voiceButton"
    );


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

                stopAudio();

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
               PAGE 1 STAYS VISIBLE.

               The next page is NOT opened here.

               welcome.mp3 plays first.
            */

            if (!voiceEnabled) {

                showScreen(
                    "welcomeScreen"
                );

                return;

            }


            stopAudio();


            const audio =
                new Audio(
                    audioPath(
                        "welcome.mp3"
                    )
                );


            currentAudio = audio;

            audio.preload = "auto";

            audio.volume = 1;


            let moved = false;


            function moveToWelcome() {

                if (moved) {
                    return;
                }

                moved = true;


                if (currentAudio === audio) {
                    currentAudio = null;
                }


                showScreen(
                    "welcomeScreen"
                );

            }


            /*
               ONLY AFTER welcome.mp3 FINISHES
               will Page 2 appear.
            */

            audio.addEventListener(
                "ended",
                moveToWelcome,
                { once: true }
            );


            /*
               If the file genuinely cannot play,
               continue rather than getting stuck.
            */

            audio.addEventListener(
                "error",
                () => {

                    console.error(
                        "welcome.mp3 failed to load"
                    );

                    moveToWelcome();

                },
                { once: true }
            );


            audio.play().catch(error => {

                console.error(
                    "welcome.mp3 playback failed:",
                    error
                );

                /*
                   Only use this fallback
                   when the browser actually
                   refuses the audio.
                */

                moveToWelcome();

            });

        }
    );

}


/* =========================================
   WELCOME → QUIZ
========================================= */

function goToGame() {

    stopAudio();


    showScreen(
        "gameScreen"
    );


    /*
       This happens after the user
       presses the button.
    */

    setTimeout(() => {

        playVoice(
            "quiz-intro.mp3"
        );

    }, 150);

}


/* =========================================
   WRONG ANSWER
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
   CORRECT ANSWER
========================================= */

let quizCompleted = false;


function correctAnswer() {

    if (quizCompleted) {
        return;
    }


    quizCompleted = true;


    const message =
        document.getElementById(
            "gameMessage"
        );


    if (message) {

        message.textContent =
            "Yayyyy! Bilkul sahi! 🎉👑❤️";

    }


    /*
       Wait for the REAL MP3 to finish.
    */

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
   HEART GAME VARIABLES
========================================= */

let heartScore = 0;

let heartGameStarted = false;

let heartTransitioning = false;


/* =========================================
   START HEART GAME
========================================= */

function startHeartGame() {

    heartScore = 0;

    heartGameStarted = true;

    heartTransitioning = false;


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


    /*
       Play heart-game.mp3.

       Hearts appear only after the
       introduction finishes.
    */

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


            if (heartTransitioning) {
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
               Play heart-caught.mp3.
            */

            playVoiceAndWait(
                "heart-caught.mp3",
                () => {

                    /*
                       All 7 hearts caught.
                    */

                    if (heartScore >= 7) {

                        heartTransitioning =
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
                           Go to Memory Garden.
                        */

                        showScreen(
                            "memoryScreen"
                        );


                        /*
                           Photos are now visible.
                           Play memories.mp3.
                        */

                        playVoiceAndWait(
                            "memories.mp3",
                            () => {

                                /*
                                   THIS FIXES THE
                                   MEMORY GARDEN GETTING
                                   STUCK.

                                   After memories.mp3,
                                   automatically go
                                   to the message page.
                                */

                                goToMessage();

                            }
                        );

                    }

                    else {

                        /*
                           Next heart.
                        */

                        if (
                            heartGameStarted
                        ) {

                            createHeart();

                        }

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

let messageStarted = false;


function goToMessage() {

    if (messageStarted) {
        return;
    }


    messageStarted = true;


    stopAudio();


    showScreen(
        "messageScreen"
    );


    /*
       Play exact message.mp3
    */

    setTimeout(() => {

        playVoice(
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

            playVoice(
                "message.mp3"
            );

        }
    );

}


/* =========================================
   MESSAGE → GIFT
========================================= */

let giftPageStarted = false;


function goToGift() {

    giftPageStarted = false;


    stopAudio();


    showScreen(
        "giftScreen"
    );


    /*
       Play gift.mp3 once when
       the gift page appears.
    */

    setTimeout(() => {

        playVoice(
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


    stopAudio();


    createConfetti();


    /*
       Go to final screen.
    */

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
   GIFT KEYBOARD SUPPORT
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
   PAGE LOAD DEBUG
========================================= */

console.log(
    "Aadi website version 20 loaded"
);

console.log(
    "Real MP3 voice system active"
);

console.log(
    "Automatic Memory → Message flow active"
);
