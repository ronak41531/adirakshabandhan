/* =========================================
   AADI RAKSHA BANDHAN WEBSITE
   FINAL AUDIO FLOW
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

    screens.forEach((screenId) => {

        const screen =
            document.getElementById(screenId);

        if (screen) {
            screen.classList.add("hidden");
        }

    });


    const selected =
        document.getElementById(id);

    if (selected) {

        selected.classList.remove("hidden");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }

}


/* =========================================
   AUDIO VARIABLES
========================================= */

let voiceEnabled = true;

let currentAudio = null;


/* =========================================
   STOP CURRENT AUDIO
========================================= */

function stopAudio() {

    if (currentAudio) {

        currentAudio.pause();

        currentAudio.currentTime = 0;

        currentAudio = null;

    }

}


/* =========================================
   PLAY MP3
========================================= */

function playVoice(filename) {

    if (!voiceEnabled) {

        return null;

    }


    stopAudio();


    const audio =
        new Audio("./" + filename);


    audio.preload = "auto";

    audio.volume = 1;


    currentAudio = audio;


    audio.play().catch((error) => {

        console.error(
            "Could not play audio:",
            filename,
            error
        );

    });


    return audio;

}


/* =========================================
   VOICE BUTTON
========================================= */

const voiceButton =
    document.getElementById("voiceButton");


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
   START BUTTON
========================================= */

const startButton =
    document.getElementById("startButton");


if (startButton) {

    startButton.addEventListener(
        "click",
        () => {

            /*
               IMPORTANT:

               We DO NOT change to the next
               screen immediately.

               Page 1 remains visible.

               welcome.mp3 plays.

               Only after welcome.mp3 finishes
               does Page 2 appear.
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


            /*
               Move to next page ONLY when
               the actual MP3 has finished.
            */

            audio.addEventListener(
                "ended",
                () => {

                    /*
                       Make sure Start audio is
                       still the active audio.
                    */

                    if (currentAudio === audio) {

                        currentAudio = null;

                        showScreen(
                            "welcomeScreen"
                        );

                    }

                },
                { once: true }
            );


            /*
               If welcome.mp3 cannot load,
               don't leave Aadi stuck.
            */

            audio.addEventListener(
                "error",
                (error) => {

                    console.error(
                        "welcome.mp3 error:",
                        error
                    );


                    if (currentAudio === audio) {

                        currentAudio = null;

                        showScreen(
                            "welcomeScreen"
                        );

                    }

                },
                { once: true }
            );


            /*
               Start the actual uploaded MP3.
            */

            audio.play().catch((error) => {

                console.error(
                    "welcome.mp3 play error:",
                    error
                );


                /*
                   If browser refuses playback,
                   continue to the next screen.
                */

                if (currentAudio === audio) {

                    currentAudio = null;

                    showScreen(
                        "welcomeScreen"
                    );

                }

            });

        }
    );

}


/* =========================================
   WELCOME → QUIZ
========================================= */

function goToGame() {

    stopAudio();

    showScreen("gameScreen");


    /*
       Quiz introduction plays AFTER
       the quiz page appears.
    */

    setTimeout(() => {

        playVoice("quiz-intro.mp3");

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


    /*
       Restart CSS animation.
    */

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

function correctAnswer() {

    const message =
        document.getElementById(
            "gameMessage"
        );


    if (message) {

        message.textContent =
            "Yayyyy! Bilkul sahi! 🎉👑❤️";

    }


    /*
       Play exact downloaded MP3.
    */

    const audio =
        playVoice("quiz-correct.mp3");


    /*
       Move to heart game ONLY after
       quiz-correct.mp3 finishes.
    */

    if (audio) {

        audio.addEventListener(
            "ended",
            () => {

                if (currentAudio === audio) {

                    currentAudio = null;

                }

                showScreen(
                    "heartGameScreen"
                );

                startHeartGame();

            },
            { once: true }
        );

    } else {

        showScreen(
            "heartGameScreen"
        );

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
       Play heart game intro.
    */

    const audio =
        playVoice("heart-game.mp3");


    /*
       First heart appears AFTER
       heart-game.mp3 finishes.
    */

    if (audio) {

        audio.addEventListener(
            "ended",
            () => {

                if (heartGameStarted) {

                    if (currentAudio === audio) {

                        currentAudio = null;

                    }

                    const newMessage =
                        document.getElementById(
                            "heartMessage"
                        );

                    if (newMessage) {

                        newMessage.textContent =
                            "Tap the hearts! 👆❤️";

                    }

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
        document.getElementById(
            "heartArea"
        );


    if (!area) {
        return;
    }


    const heart =
        document.createElement("button");


    heart.className = "heart";

    heart.type = "button";

    heart.innerHTML = "❤️";

    heart.setAttribute(
        "aria-label",
        "Catch heart"
    );


    /*
       Random position.
    */

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


    /*
       Heart click.
    */

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
               Play exact short
               heart-caught.mp3.
            */

            const caughtAudio =
                playVoice(
                    "heart-caught.mp3"
                );


            /*
               Seven hearts complete.
            */

            if (heartScore >= 7) {

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
                   Wait until the caught-heart
                   sound finishes.
                */

                if (caughtAudio) {

                    caughtAudio.addEventListener(
                        "ended",
                        () => {

                            if (
                                currentAudio ===
                                caughtAudio
                            ) {

                                currentAudio =
                                    null;

                            }

                            goToMemories();

                        },
                        { once: true }
                    );

                } else {

                    goToMemories();

                }

            }

            else {

                /*
                   Create the next heart AFTER
                   the short voice ends.
                */

                if (caughtAudio) {

                    caughtAudio.addEventListener(
                        "ended",
                        () => {

                            if (
                                heartGameStarted
                            ) {

                                if (
                                    currentAudio ===
                                    caughtAudio
                                ) {

                                    currentAudio =
                                        null;

                                }

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
   MEMORY GARDEN
========================================= */

function goToMemories() {

    showScreen("memoryScreen");


    /*
       Photos are already visible
       when this screen opens.

       Then memories.mp3 plays.
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

            playVoice("message.mp3");

        }
    );

}


/* =========================================
   MESSAGE → GIFT
========================================= */

function goToGift() {

    /*
       Stop the message voice.
    */

    stopAudio();


    showScreen("giftScreen");


    /*
       Start gift voice when gift page
       appears.
    */

    setTimeout(() => {

        playVoice("gift.mp3");

    }, 300);

}


/* =========================================
   OPEN GIFT
========================================= */

function openGift() {

    const gift =
        document.getElementById(
            "giftBox"
        );


    if (!gift) {
        return;
    }


    /*
       Don't open twice.
    */

    if (
        gift.classList.contains(
            "opened"
        )
    ) {

        return;

    }


    gift.classList.add("opened");


    const hint =
        document.getElementById(
            "giftHint"
        );


    if (hint) {

        hint.textContent =
            "Yayyyy! Surpriseee! 🎉🎁❤️";

    }


    /*
       Stop the gift introduction
       when the box is opened.
    */

    stopAudio();


    createConfetti();


    /*
       Show final screen.
    */

    setTimeout(() => {

        showScreen("finalScreen");


        createConfetti();


        /*
           Final MP3.
        */

        setTimeout(() => {

            playVoice("final.mp3");

        }, 400);

    }, 1800);

}


/* =========================================
   KEYBOARD SUPPORT FOR GIFT
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
   PHOTO CLICK EFFECT
========================================= */

document.addEventListener(
    "click",
    (event) => {

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
