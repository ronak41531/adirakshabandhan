/* =========================================
   AADI RAKSHA BANDHAN WEBSITE
   COMPLETE MP3 VOICE SYSTEM
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

        const element =
            document.getElementById(screen);

        if (element) {
            element.classList.add("hidden");
        }

    });


    const selected =
        document.getElementById(id);

    if (selected) {

        selected.classList.remove("hidden");

    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =========================================
   VOICE SYSTEM
========================================= */

let voiceEnabled = true;

let currentAudio = null;


/* =========================================
   VOICE BUTTON
========================================= */

const voiceButton =
    document.getElementById("voiceButton");


if (voiceButton) {

    voiceButton.addEventListener("click", () => {

        voiceEnabled = !voiceEnabled;


        voiceButton.textContent =
            voiceEnabled
                ? "🔊"
                : "🔇";


        if (!voiceEnabled) {

            stopVoice();

        }

    });

}


/* =========================================
   STOP CURRENT AUDIO
========================================= */

function stopVoice() {

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
        return;
    }


    stopVoice();


    currentAudio =
        new Audio("./" + filename);


    currentAudio.volume = 1;


    currentAudio.play().catch(error => {

        console.log(
            "Audio playback failed:",
            filename,
            error
        );

    });

}


/* =========================================
   START BUTTON
========================================= */

const startButton =
    document.getElementById("startButton");


if (startButton) {

    startButton.addEventListener("click", () => {

        /*
           IMPORTANT:

           The first page MUST remain visible
           while welcome.mp3 is playing.

           We DO NOT change the screen here.
        */


        if (!voiceEnabled) {

            showScreen("welcomeScreen");

            return;

        }


        stopVoice();


        currentAudio =
            new Audio("./welcome.mp3");


        currentAudio.volume = 1;


        /*
           When the welcome voice FINISHES,
           THEN move to the next page.
        */

        currentAudio.addEventListener(
            "ended",
            () => {

                showScreen("welcomeScreen");

            },
            { once: true }
        );


        /*
           If audio fails, don't leave
           the child stuck on the first page.
        */

        currentAudio.addEventListener(
            "error",
            () => {

                console.log(
                    "welcome.mp3 could not be played."
                );


                showScreen("welcomeScreen");

            },
            { once: true }
        );


        currentAudio.play().catch(error => {

            console.log(
                "Welcome audio error:",
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

    showScreen("gameScreen");


    /*
       Play quiz introduction
       after the quiz screen appears.
    */

    setTimeout(() => {

        playVoice("quiz-intro.mp3");

    }, 300);

}


/* =========================================
   QUIZ - WRONG ANSWER
========================================= */

function wrongAnswer(button) {

    if (!button) return;


    button.classList.remove("shake");


    /*
       Force animation restart
    */

    void button.offsetWidth;


    button.classList.add("shake");


    const gameMessage =
        document.getElementById("gameMessage");


    if (gameMessage) {

        gameMessage.textContent =
            "Oops! Dobara try karo Aadi! 😜💖";

    }

}


/* =========================================
   QUIZ - CORRECT ANSWER
========================================= */

function correctAnswer() {

    const gameMessage =
        document.getElementById("gameMessage");


    if (gameMessage) {

        gameMessage.textContent =
            "Yayyyyy! Bilkul sahi! 🎉👑❤️";

    }


    /*
       Play exact uploaded voice.
    */

    playVoice("quiz-correct.mp3");


    /*
       Wait before moving to next game.
    */

    setTimeout(() => {

        showScreen("heartGameScreen");

        startHeartGame();

    }, 3000);

}


/* =========================================
   HEART GAME VARIABLES
========================================= */

let heartScore = 0;

let heartGameStarted = false;


/* =========================================
   START HEART GAME
========================================= */

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
       Play heart game introduction.
    */

    playVoice("heart-game.mp3");


    /*
       Wait a little before first heart.
    */

    setTimeout(() => {

        if (heartGameStarted) {

            createHeart();

        }

    }, 1200);

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


    /*
       Random position
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
       Heart click
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
               Play short heart-caught
               every time.
            */

            playVoice(
                "heart-caught.mp3"
            );


            /*
               Seven hearts complete
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
                   Wait for the final
                   heart sound.
                */

                setTimeout(() => {

                    showScreen(
                        "memoryScreen"
                    );


                    /*
                       Play Memory Garden voice
                    */

                    setTimeout(() => {

                        playVoice(
                            "memories.mp3"
                        );

                    }, 500);


                }, 2200);


            }

            else {

                /*
                   Create another heart.
                */

                setTimeout(() => {

                    if (heartGameStarted) {

                        createHeart();

                    }

                }, 700);

            }

        }
    );


    area.appendChild(heart);

}


/* =========================================
   MEMORY → MESSAGE
========================================= */

function goToMessage() {

    stopVoice();


    showScreen("messageScreen");


    /*
       Play exact message.mp3
    */

    setTimeout(() => {

        playVoice(
            "message.mp3"
        );

    }, 500);

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

    stopVoice();


    showScreen("giftScreen");


    /*
       Play gift introduction.
    */

    setTimeout(() => {

        playVoice(
            "gift.mp3"
        );

    }, 500);

}


/* =========================================
   OPEN GIFT
========================================= */

function openGift() {

    const gift =
        document.getElementById(
            "giftBox"
        );


    if (!gift) return;


    /*
       Prevent double opening.
    */

    if (
        gift.classList.contains(
            "opened"
        )
    ) {

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


    /*
       Stop gift voice.
    */

    stopVoice();


    /*
       Confetti before final.
    */

    createConfetti();


    /*
       Open final screen.
    */

    setTimeout(() => {

        showScreen(
            "finalScreen"
        );


        createConfetti();


        /*
           Play final.mp3.
        */

        setTimeout(() => {

            playVoice(
                "final.mp3"
            );

        }, 600);


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
   PHOTO CLICK ANIMATION
========================================= */

document.addEventListener(
    "click",
    event => {

        const card =
            event.target.closest(
                ".photo-card"
            );


        if (!card) return;


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
   PREVENT DOUBLE-TAP ZOOM
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
