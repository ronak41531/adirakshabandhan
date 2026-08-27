/* =========================================
   AADI RAKSHA BANDHAN
   FIXED HEART GAME VERSION
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
   SCREEN CONTROL
========================================= */

function showScreen(id) {

    screens.forEach(screenId => {

        const screen =
            document.getElementById(screenId);

        if (screen) {
            screen.classList.add("hidden");
        }

    });


    const target =
        document.getElementById(id);

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
   STOP MAIN VOICE
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
   PLAY MAIN VOICE
========================================= */

function playVoice(filename) {

    if (!voiceEnabled) {
        return null;
    }

    if (!voicePlayer) {
        return null;
    }


    stopVoice();


    voicePlayer.src =
        "./" + filename;

    voicePlayer.preload = "auto";

    voicePlayer.volume = 1;

    currentFile = filename;


    voicePlayer.play().catch(error => {

        console.error(
            "Audio playback failed:",
            filename,
            error
        );

    });


    return voicePlayer;
}


/* =========================================
   PLAY MAIN VOICE AND WAIT
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


        audio.removeEventListener(
            "ended",
            finish
        );

        audio.removeEventListener(
            "error",
            finish
        );


        onFinished();

    }


    audio.addEventListener(
        "ended",
        finish
    );


    audio.addEventListener(
        "error",
        finish
    );

}


/* =========================================
   VOICE ON / OFF
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
   START BUTTON
========================================= */

const startButton =
    document.getElementById(
        "startButton"
    );


if (startButton) {

    startButton.addEventListener(
        "click",
        () => {

            if (!voiceEnabled) {

                showScreen(
                    "welcomeScreen"
                );

                return;

            }


            stopVoice();


            /*
               IMPORTANT:

               Stay on Page 1.

               Page 2 only opens after
               welcome.mp3 finishes.
            */

            const audio =
                new Audio(
                    "./welcome.mp3"
                );


            audio.preload = "auto";

            audio.volume = 1;


            currentFile =
                "welcome.mp3";


            audio.addEventListener(
                "ended",
                () => {

                    if (
                        currentFile ===
                        "welcome.mp3"
                    ) {

                        currentFile = "";

                    }

                    showScreen(
                        "welcomeScreen"
                    );

                },
                { once: true }
            );


            audio.addEventListener(
                "error",
                error => {

                    console.error(
                        "welcome.mp3 failed:",
                        error
                    );

                },
                { once: true }
            );


            audio.play().catch(error => {

                console.error(
                    "welcome.mp3 could not play:",
                    error
                );

            });


            /*
               Store this as current voice.
            */

            currentAudioObject =
                audio;

        }
    );

}


/* =========================================
   CURRENT AUDIO OBJECT
========================================= */

let currentAudioObject = null;


/* =========================================
   WELCOME → QUIZ
========================================= */

function goToGame() {

    stopAllAudio();

    showScreen("gameScreen");


    setTimeout(() => {

        playVoice(
            "quiz-intro.mp3"
        );

    }, 200);

}


/* =========================================
   STOP EVERYTHING
========================================= */

function stopAllAudio() {

    /*
       Stop player element.
    */

    stopVoice();


    /*
       Stop start-screen audio if present.
    */

    if (currentAudioObject) {

        currentAudioObject.pause();

        try {
            currentAudioObject.currentTime = 0;
        } catch (error) {
            console.log(error);
        }

        currentAudioObject = null;

    }

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

let heartsFinishing = false;


/*
   Separate audio for heart-catching.

   IMPORTANT:
   This audio does NOT control the game.
*/

let heartCaughtAudio = null;


/* =========================================
   START HEART GAME
========================================= */

function startHeartGame() {

    heartScore = 0;

    heartGameStarted = true;

    heartsFinishing = false;


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
       Stop any previous heart sound.
    */

    if (heartCaughtAudio) {

        heartCaughtAudio.pause();

        heartCaughtAudio.currentTime = 0;

    }


    /*
       Play the game introduction.

       Hearts appear after it finishes.
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
   HEART CATCH SOUND
========================================= */

function playHeartCaughtSound() {

    if (!voiceEnabled) {
        return;
    }


    /*
       IMPORTANT:

       This is a separate audio object.

       It does NOT use voicePlayer.

       It does NOT block the game.
    */

    if (heartCaughtAudio) {

        heartCaughtAudio.pause();

        heartCaughtAudio.currentTime = 0;

    }


    heartCaughtAudio =
        new Audio(
            "./heart-caught.mp3"
        );


    heartCaughtAudio.preload =
        "auto";


    heartCaughtAudio.volume =
        1;


    heartCaughtAudio.play().catch(error => {

        console.log(
            "Heart sound could not play:",
            error
        );

    });

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


    /*
       IMPORTANT:
       Prevent double activation.
    */

    let caught = false;


    heart.addEventListener(
        "click",
        () => {

            if (caught) {
                return;
            }


            if (!heartGameStarted) {
                return;
            }


            if (heartsFinishing) {
                return;
            }


            caught = true;


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
               Play the short voice.

               IMPORTANT:
               We DO NOT WAIT for it.
            */

            playHeartCaughtSound();


            /* =============================
               LAST HEART
            ============================= */

            if (heartScore >= 7) {

                heartsFinishing = true;

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
                   Let the last heart sound
                   play briefly, then move on.
                */

                setTimeout(() => {

                    goToMemoryGarden();

                }, 1200);


                return;

            }


            /* =============================
               NEXT HEART
            ============================= */

            /*
               New heart appears quickly.

               It does NOT wait for
               heart-caught.mp3.
            */

            setTimeout(() => {

                if (
                    heartGameStarted &&
                    !heartsFinishing
                ) {

                    createHeart();

                }

            }, 250);

        }
    );


    area.appendChild(
        heart
    );

}


/* =========================================
   MEMORY GARDEN
========================================= */

function goToMemoryGarden() {

    showScreen(
        "memoryScreen"
    );


    /*
       Photos are visible immediately.
    */


    setTimeout(() => {

        playVoice(
            "memories.mp3"
        );

    }, 300);

}


/* =========================================
   MEMORY → MESSAGE
========================================= */

let messageStarted = false;


function goToMessage() {

    /*
       Allow the user to continue manually.
       This is also useful in case the
       memory audio gets interrupted.
    */

    messageStarted = true;


    stopAllAudio();


    showScreen(
        "messageScreen"
    );


    setTimeout(() => {

        playVoice(
            "message.mp3"
        );

    }, 300);

}


/* =========================================
   MESSAGE VOICE BUTTON
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

    stopAllAudio();


    showScreen(
        "giftScreen"
    );


    setTimeout(() => {

        playVoice(
            "gift.mp3"
        );

    }, 300);

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


    stopAllAudio();


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
            Math.random() * 100 +
            "%";


        piece.style.animationDuration =
            (
                2.5 +
                Math.random() * 3
            ) +
            "s";


        piece.style.animationDelay =
            Math.random() * 1.5 +
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
   DEBUG
========================================= */

console.log(
    "Aadi Raksha Bandhan - fixed heart game loaded"
);

console.log(
    "Heart audio does not block heart creation"
);

console.log(
    "Real MP3 system active"
);
