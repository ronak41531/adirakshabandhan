/* =========================================
   AADI RAKSHA BANDHAN WEBSITE
========================================= */


/* =========================================
   SCREEN CONTROL
========================================= */

const screens = [/* =========================================
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


/*
    All audio files are in the GitHub
    repository ROOT folder.
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


/*
    Play one of the real MP3 files.
*/

function playVoice(name) {

    if (!voiceEnabled) {
        return;
    }

    const file = audioFiles[name];

    if (!file) {
        console.error("Audio file not found in audioFiles:", name);
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
       Create the actual MP3 player.
    */

    currentAudio = new Audio(file);

    currentAudio.preload = "auto";

    currentAudio.volume = 1.0;


    /*
       Play the downloaded recording.
    */

    const playPromise = currentAudio.play();

    if (playPromise !== undefined) {

        playPromise.catch(error => {

            console.log(
                "Audio playback was blocked or unavailable:",
                error
            );

        });

    }

}


/*
    Stop current voice.
*/

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


    if (voiceEnabled) {

        voiceButton.textContent = "🔊";

    } else {

        voiceButton.textContent = "🔇";

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
           This click comes directly from
           the user, so mobile browsers are
           much more likely to allow audio.
        */

        playVoice("welcome");


        setTimeout(() => {

            showScreen("welcomeScreen");

        }, 500);

    });


/* =========================================
   WELCOME → QUIZ
========================================= */

function goToGame() {

    showScreen("gameScreen");


    /*
       Play the exact downloaded
       quiz-intro.mp3 file.
    */

    setTimeout(() => {

        playVoice("quizIntro");

    }, 300);

}


/* =========================================
   QUIZ GAME
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


/*
   Correct answer.
*/

function correctAnswer() {

    document
        .getElementById("gameMessage")
        .textContent =
        "Yayyyy! Bilkul sahi! 🎉👑❤️";


    /*
       Use downloaded quiz-correct.mp3.
    */

    playVoice("quizCorrect");


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


    /*
       Play the exact heart-game.mp3.
    */

    setTimeout(() => {

        playVoice("heartGame");

    }, 200);


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
            .textContent = heartScore;


        heart.remove();


        /*
           If all 7 hearts are collected.
        */

        if (heartScore >= 7) {

            heartGameStarted = false;


            document
                .getElementById("heartMessage")
                .textContent =
                "Wowww! Aadi ne saare hearts pakad liye! 🎉❤️";


            /*
               We already used heart-game.mp3
               for the introduction.

               The final heart can also use
               heart-caught.mp3.
            */

            playVoice("heartCaught");


            setTimeout(() => {

                showScreen("memoryScreen");

                /*
                   Play memory voice when the
                   Memory Garden opens.
                */

                setTimeout(() => {

                    playVoice("memories");

                }, 400);

            }, 1800);


        } else {

            /*
               Exact downloaded
               heart-caught.mp3
            */

            playVoice("heartCaught");


            setTimeout(() => {

                createHeart();

            }, 300);

        }

    });


    area.appendChild(heart);

}


/* =========================================
   MESSAGE SCREEN
========================================= */

function goToMessage() {

    showScreen("messageScreen");


    setTimeout(() => {

        playVoice("message");

    }, 400);

}


/*
   Message replay button.
*/

document
    .getElementById("messageVoiceButton")
    .addEventListener("click", () => {

        playVoice("message");

    });


/* =========================================
   GIFT SCREEN
========================================= */

function goToGift() {

    showScreen("giftScreen");


    /*
       Don't play gift.mp3 yet.

       It will play when Aadi actually
       taps the gift.
    */

}


/* =========================================
   OPEN GIFT
========================================= */

function openGift() {

    const gift =
        document.getElementById("giftBox");


    /*
       Don't allow opening twice.
    */

    if (gift.classList.contains("opened")) {

        return;

    }


    gift.classList.add("opened");


    document
        .getElementById("giftHint")
        .textContent =
        "Yayyyy! Surpriseee! 🎉🎁❤️";


    /*
       Play exact downloaded gift.mp3.
    */

    playVoice("gift");


    createConfetti();


    setTimeout(() => {

        showScreen("finalScreen");


        createConfetti();


        /*
           Play final.mp3.
        */

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
        document.getElementById("confettiContainer");


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
                    Math.random() * emojis.length
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

document.addEventListener("click", event => {

    if (event.target.closest(".photo-card")) {

        const card =
            event.target.closest(".photo-card");


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

});


/* =========================================
   MOBILE TOUCH
========================================= */

let lastTouchEnd = 0;


document.addEventListener(
    "touchend",
    event => {

        const now = Date.now();


        if (
            now - lastTouchEnd <= 300
        ) {

            event.preventDefault();

        }


        lastTouchEnd = now;

    },
    false
);
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
   VOICE SYSTEM
========================================= */

let voiceEnabled = true;

const voiceButton = document.getElementById("voiceButton");

voiceButton.addEventListener("click", () => {

    voiceEnabled = !voiceEnabled;

    voiceButton.textContent = voiceEnabled
        ? "🔊"
        : "🔇";

    if (!voiceEnabled && "speechSynthesis" in window) {
        speechSynthesis.cancel();
    }

});


function speak(text) {

    if (!voiceEnabled) return;

    if (!("speechSynthesis" in window)) {
        return;
    }

    speechSynthesis.cancel();

    const message = new SpeechSynthesisUtterance(text);

    message.rate = 0.9;
    message.pitch = 1.15;
    message.volume = 1;

    /*
       Try to find a Hindi/Indian voice.
    */

    const voices = speechSynthesis.getVoices();

    const preferredVoice = voices.find(voice =>
        voice.lang.toLowerCase().includes("hi")
    );

    if (preferredVoice) {
        message.voice = preferredVoice;
    }

    speechSynthesis.speak(message);
}


/*
   Some browsers load voices after page load.
*/

if ("speechSynthesis" in window) {

    speechSynthesis.onvoiceschanged = () => {
        speechSynthesis.getVoices();
    };

}


/* =========================================
   START
========================================= */

document.getElementById("startButton").addEventListener("click", () => {

    speak(
        "Hello meri chhoti si princess Aadi! " +
        "Aaj tumhare liye ek bahut hi special Raksha Bandhan surprise hai. " +
        "Chalo magical adventure shuru karte hain!"
    );

    setTimeout(() => {
        showScreen("welcomeScreen");
    }, 800);

});


/* =========================================
   WELCOME
========================================= */

function goToGame() {

    speak(
        "Chalo Aadi! Ab ek chhota sa game khelte hain!"
    );

    showScreen("gameScreen");
}


/* =========================================
   QUIZ GAME
========================================= */

function wrongAnswer(button) {

    button.classList.remove("shake");

    void button.offsetWidth;

    button.classList.add("shake");

    document.getElementById("gameMessage").textContent =
        "Oops! Dobara try karo Aadi! 😜💖";

    speak("Oops! Dobara try karo Aadi!");
}


function correctAnswer() {

    document.getElementById("gameMessage").textContent =
        "Yayyyy! Bilkul sahi! 🎉👑❤️";

    speak(
        "Yay! Bilkul sahi! " +
        "Aadi meri sabse pyaari little princess hai!"
    );

    setTimeout(() => {
        showScreen("heartGameScreen");
        startHeartGame();
    }, 1600);
}


/* =========================================
   HEART GAME
========================================= */

let heartScore = 0;
let heartGameStarted = false;

function startHeartGame() {

    heartScore = 0;

    document.getElementById("heartScore").textContent = heartScore;

    document.getElementById("heartMessage").textContent =
        "Tap the hearts! 👆❤️";

    const area = document.getElementById("heartArea");

    area.innerHTML = "";

    heartGameStarted = true;

    createHeart();
}


function createHeart() {

    if (!heartGameStarted) return;

    if (heartScore >= 7) return;

    const area = document.getElementById("heartArea");

    const heart = document.createElement("button");

    heart.className = "heart";
    heart.innerHTML = "❤️";

    const maxX = Math.max(20, area.clientWidth - 65);
    const maxY = Math.max(20, area.clientHeight - 65);

    heart.style.left =
        Math.random() * maxX + "px";

    heart.style.top =
        Math.random() * maxY + "px";

    heart.addEventListener("click", () => {

        heartScore++;

        document.getElementById("heartScore").textContent =
            heartScore;

        heart.remove();

        if (heartScore >= 7) {

            heartGameStarted = false;

            document.getElementById("heartMessage").textContent =
                "Wowww! Aadi ne saare hearts pakad liye! 🎉❤️";

            speak(
                "Wow! Aadi ne saare hearts pakad liye! " +
                "You are amazing!"
            );

            setTimeout(() => {
                showScreen("memoryScreen");
            }, 1800);

        } else {

            speak("Yay! Ek heart mil gaya!");

            setTimeout(createHeart, 300);
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

        speak(
            "Meri pyaari Aadi. " +
            "Tum abhi bahut chhoti ho, sirf chaar saal ki. " +
            "Lekin tumhari ek chhoti si smile sabka mood achha kar deti hai. " +
            "Tumhari masti, tumhari cute si baatein aur tumhari shararatein hamesha special rahengi. " +
            "Main hamesha tumhare saath rahunga, tumhe protect karunga aur tumhe bahut saara pyaar karunga. " +
            "Love you meri chhoti princess. " +
            "Happy Raksha Bandhan Aadi!"
        );

    }, 700);
}


document
    .getElementById("messageVoiceButton")
    .addEventListener("click", () => {

        speak(
            "Meri pyaari Aadi. " +
            "Tum abhi bahut chhoti ho, sirf chaar saal ki. " +
            "Lekin tumhari ek chhoti si smile sabka mood achha kar deti hai. " +
            "Tumhari masti, tumhari cute si baatein aur tumhari shararatein hamesha special rahengi. " +
            "Main hamesha tumhare saath rahunga, tumhe protect karunga aur tumhe bahut saara pyaar karunga. " +
            "Love you meri chhoti princess. " +
            "Happy Raksha Bandhan Aadi!"
        );

    });


/* =========================================
   GIFT
========================================= */

function goToGift() {

    speak(
        "Aadi, ab tumhare liye ek secret surprise hai!"
    );

    showScreen("giftScreen");
}


function openGift() {

    const gift = document.getElementById("giftBox");

    if (gift.classList.contains("opened")) {
        return;
    }

    gift.classList.add("opened");

    document.getElementById("giftHint").textContent =
        "Yayyyy! Surpriseee! 🎉🎁❤️";

    speak(
        "Yayyyy! Surprise! " +
        "Happy Raksha Bandhan meri pyaari Aadi!"
    );

    createConfetti();

    setTimeout(() => {

        showScreen("finalScreen");

        createConfetti();

        setTimeout(() => {

            speak(
                "Happy Raksha Bandhan Aadi! " +
                "I love you meri chhoti princess!"
            );

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
            emojis[Math.floor(Math.random() * emojis.length)];

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

    if (event.target.closest(".photo-card")) {

        const card =
            event.target.closest(".photo-card");

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

    }

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
