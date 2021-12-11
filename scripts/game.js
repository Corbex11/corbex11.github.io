/* callum fisher - corbex11@gmail.com
last updated 30/11/2021 */

var buttons = [];
var data = {};
var audio = new Audio();

function hideElement (element) {
    var element = document.getElementById(element);
    if (element.style.display == "block" || element.style.display == '') {
        element.style.animation = "fadeOut 0.5s linear infinite"
        setTimeout(() => {
            element.style.display = "none";
            element.style.animation = "";
        }, 400);
    }
}

function showElement (element) {
    var element = document.getElementById(element);
    if (window.getComputedStyle(element).display == "none") {
        element.style.display = "block";
        element.style.animation = "fadeIn 0.5s linear infinite";
        setTimeout(() => {
            element.style.animation = "";
        }, 400);
    }
}

function restoreBackgroundColours () {
    fadeInBackground(5, 5, 5, document.body);
    fadeInBackground(10, 10, 10, document.getElementById("content"));
}

backgroundChangeInProgress = false;
function fadeInBackground(R, G, B, element) {
    var waitForBackgroundChange = setInterval(() => {
        if (!backgroundChangeInProgress) {
            clearInterval(waitForBackgroundChange);
            backgroundChangeInProgress = true;
            if (!element) element = document.body;
            if (!element.style.background) element.style.background = window.getComputedStyle(document.getElementById("content")).backgroundColor;
            var rgb = element.style.background.split("rgb(")[1].split(")")[0].replace(/ /g,"").split(",");
            var r = Number(rgb[0]); // current red
            var g = Number(rgb[1]); // current green
            var b = Number(rgb[2]); // current blue
            var int = setInterval(function() {
                if (R > r) r++; // if desired red is higher than current red, make current red higher
                if (G > g) g++;
                if (B > b) b++;
                if (R < r) r--; // if desired red is lower than current red, make current red lower
                if (G < g) g--;
                if (B < b) b--;
                element.style.background = `rgb(${r},${g},${b})`;
                if (r == R && g == G && b == B) {
                    clearInterval(int);
                    backgroundChangeInProgress = false;
                }
            }, 20);
        }
    }, 500);
}

function sleep (ms) { // https://stackoverflow.com/questions/14249506/
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
}

function rando (r) {
    return Array.isArray(r)||(r=Array.from(arguments)),r[Math.floor(Math.random()*r.length)];
} 

function newButton (label, onclick) { // https://sebhastian.com/javascript-create-button/
    return new Promise (function(resolve, reject) {
        var btn = document.createElement("a");
        btn.innerHTML = label || buttons.length;
        btn.addEventListener("click", onclick);
        document.getElementById("navbar").appendChild(btn);
        resolve(buttons.length);
        buttons.push(btn);
    });
}

function delButton (id) {
    document.getElementById("navbar").removeChild(buttons[id]);
    buttons.splice(id, 1);
}

function hideAllButtons () {
    var goal = buttons.length
    for (var i = 0; i < goal; i++) {
        delButton(0);
    }
}

function addQuitButton () {
    newButton("Go Back to Lobby", function() {
        showMenu();
    }).then(function(id) {
        buttons[id].style.backgroundImage = "linear-gradient(to right, rgb(100,0,0), rgb(0,0,100))";
        buttons[id].style.color = "white";
        buttons[id].style.float = "right";
    });
}

function rollDice() {
    hideElement("credits");
    showElement("box1");
    document.getElementById("box1").innerHTML = "Let's get started, then! Will you be placing a bet on this roll?";
    hideAllButtons();
    fadeInBackground(0, 0, 40, document.body);
    document.getElementById("logo").src = "media/dice.png";
    var betAmount = 0;
    var confirmBetAmount = function () {
        document.getElementById("box1").innerHTML = "How much are you going to bet?";
        hideAllButtons();
        newButton("I've changed my mind.", function() {
            rollDice();
        }).then(function(id) {
            buttons[id].style.float = "right";
        });
        newButton().then(function(id) {
            buttons[id].innerHTML = `<form><label for="betAmount"></label><input type="number" autocomplete="off" min="1" placeholder="Enter bet amount" id="betAmount" name="betAmount"></form>`;
        });
        newButton("Confirm Bet!", function() {
            betAmount = document.getElementById("betAmount").value;
            if (betAmount > 0) {
                rollBuildUp();
            } else {
                confirmBetAmount();
            }
        });
    }
    var rollBuildUp = function () {
        hideAllButtons();
        hideElement("navbar");
        document.getElementById("box1").innerHTML = "Okay. Let's roll the dice...";
        if (Math.random() > 0.8) { // We don't always want a drumroll, it'll get annoying hearing it every time, so let's give it a 20% chance of happening instead.
            document.getElementById("logo").src = "media/drumroll.gif";
            new Audio("media/drumroll.mp3").play();
        } else {
            document.getElementById("logo").src = "media/dice.gif";
        }
        setTimeout(() => { // Suspense!
            roll();
        }, 2000);
    }
    var roll = function () {
        document.getElementById("logo").src = "media/rolldice.png";
        var interrupt = Math.random() > 0.8;
        var res = Math.floor(Math.random()*6) + 1;
		var win = res == 6;
        if (interrupt && betAmount == 0) {
            var interruptions = ["Wait - where are they?", "Did it fall off of the table?", "Please, stop throwing the die onto the floor.", "Actually, your concentration was thrown off. Let's try again later.", "Oh no! A die fell off of the table! Where did it go...?", "Despite your best efforts, you managed to drop a die.. Where did it go?", "Where did the dice go?"]
            document.getElementById("box1").innerHTML = rando(interruptions);
        } else {
            new Audio("media/rollDice.mp3").play();
            var wins = ["Lucky! You're a winner!", "It's a winner!", "Nice.", "Great!", "Finally!", "Yes!", "Brilliant!", "Perfect roll!", "Perfect!", "That's great!", "Unbelievable!"];
		    var losses = ["Unlucky!", "Unfortunate!", "Nope.", "What if you placed down a higher bet?", "Not quite.", "Not quite!", "Nah.", "Nope!", "No!", "Not quite!", "Tough luck.", "Maybe next time.", "Typical.", "Typical!", "How unlucky!", "Most unfortunate!", "Oh!"];
			var message = `${res == 6 ? rando(wins) : rando(losses)} You rolled ${res > 10 && res !== 12 ? "an" : "a"} ${res} out of 6${betAmount !== 0 ? " " : "!"}`;
			if (betAmount !== 0) message += win ? " and won a bet of C$" + betAmount + "! (not really, bets haven't been enabled yet)":" and lost a bet of C$" + betAmount + "! (not really, bets haven't been enabled yet)";
			document.getElementById("box1").innerHTML = message;
            if (res == 6) document.getElementById("logo").src = "media/rolldice.gif";
            /* if (betAmount !== 0) {
                if (win) {
                    giveItem("coin", betAmount);
                } else {
                    takeItem("coin", betAmount);
                }
            } */
            betAmount = 0;
        }
        showElement("navbar");
        hideAllButtons();
        newButton("Try again.", rollBuildUp).then(function(id) {
            var message = buttons[id].innerHTML;
            if (win) message = "Roll again.";
            if (message) buttons[id].innerHTML = message; 
        });
        newButton("Make a bet.", confirmBetAmount);
        addQuitButton();
    }
    newButton("Yes.", confirmBetAmount);
    newButton("No, thanks.", rollBuildUp);
    addQuitButton();
}


function saveData () {
    hideAllButtons();
    fadeInBackground(0, 0, 100, document.body);
    newButton("Record my Current Progress", () => {
        
    });
    newButton("Continue from a Previous Save", () => {
        hideAllButtons();
        newButton(null).then(function(id) {
            buttons[id].innerHTML = `<input type="file" id="filePicker"/>`;
            var input = document.getElementById("filePicker"); // https://www.fwait.com/how-to-read-text-file-in-javascript-line-by-line/
            input.addEventListener("change", () => {
            let files = input.files;
            if(files.length == 0) return;
            const file = files[0];
            let reader = new FileReader();
            reader.onload = (e) => {
                const file = e.target.result;
                const lines = file.split(/\r\n|\n/);
                showElement("box2");
                document.getElementById("box2").innerHTML = lines.join("<br>");
            };
            reader.onerror = (e) => alert(e.target.error.name);
            reader.readAsText(file);   
            });
        });
        newButton("Go Back", () => {
            saveData();
        }).then(function(id) {
            buttons[id].style.float = "right";
        });
    });
    addQuitButton();
    document.getElementById("logo").src = "media/save.png";
    showElement("box1");
    revealText("Welcome to the Save Data menu. You can record all of your progress across the game here, and pick up from where you left off whenever you want to.", document.getElementById("box1"));
}

function revealText (text, element) {
    if (tempData.revealTextInt) clearInterval(tempData.revealTextInt);
    var i = -1;
    tempData.revealTextInt = setInterval(() => {
        i++;
        element.innerHTML += text.charAt(i);
        if (i == text.length) clearInterval(tempData.revealTextInt);
    }, 50);
}

function startGame () {
    playScene({
        "notes": ["Introduction"],
        "cmds": [
            { "cmd": "background", "input": { "colors": [[0, 0, 0]] }},
            { "cmd": "wait", "input": 10000 },
            { "cmd": "dialogue", "input": { "speaker": null, "speech": "..." }},
            { "cmd": "wait", "input": 5000 },
            { "cmd": "dialogue" },
            { "cmd": "dialogue", "input": { "speaker": null, "speech": "...Where am I...?" }},
            { "cmd": "options", "input": { "Stand up": "wait = false;" }},
            { "cmd": "eval", "input": "wait = true;" },
            { "cmd": "background", "input": { "colors": [[0, 0, 0]] }}
        ]
    });
}

function hideAll () {
    hideAllButtons();
    hideElement("navbar");
    hideElement("topbar");
    hideElement("content");
    hideElement("box1");
    hideElement("box2");
    document.getElementById("box1").innerHTML = "";
    document.getElementById("box2").innerHTML = "";
}

var tempData = {}

function playScene (scene) {
    hideAll();
    setTimeout(() => {
        showElement("content");
        showElement("box1");
        document.getElementById("box1").innerHTML = scene.notes.join("<br>");
        setTimeout(() => {
        hideElement("content");
        setTimeout(() => { document.getElementById("box1").innerHTML = ""; }, 500);
        var wait = false;
        var i = -1
        var scenePlayer = setInterval(() => {
            if (!wait) {
                i++;
                var cmd = scene.cmds[i].cmd.toLowerCase();
                var input = scene.cmds[i].input;
                switch (cmd) {
                    case "hideall":
                        hideAll();
                    break;
                    case "wait":
                        wait = true;
                        setTimeout(() => { wait = false }, input);
                    break;
                    case "background":
                        if (!input) {
                            if (tempData.sceneBackgroundInterval) clearInterval(tempData.sceneBackgroundInterval);
                        } else {
                            if (!input.colors) input.colors = [[0, 0, 0]];
                            if (input.colors.length == 1) { 
                                fadeInBackground(input.colors[0][0], input.colors[0][1], input.colors[0][2]);
                            } else {
                                var i2 = -1;
                                tempData.sceneBackgroundInterval = setInterval(() => {
                                    i2++;
                                    fadeInBackground(input.colors[i2][0], input.colors[i2][1], input.colors[i2][2]);
                                    if (i2 == input.colors.length - 1) i2 = -1;
                                }, input.freq || 5000);
                            }
                        }
                    break;
                    case "dialogue":
                        if (!input) {
                            document.getElementById("box1").innerHTML = "";
                        } else {
                            var txt = `"${input.speech}" `;
                            wait = true;
                            setTimeout(() => { wait = false; }, txt.length * 100);
                            showElement("content");
                            showElement("box1");
                            revealText(txt, document.getElementById("box1"));
                        }
                    break;
                    case "eval":
                        if (input) {
                            eval(input);
                        }
                    break;
                    case "options":
                        if (input) {
                            showElement("navbar");
                            for (var i3 = 0; i3 < Object.keys(input).length; i3++) {
                                console.log(Object.keys(input)[i3]);
                                console.log(input[Object.keys(input)[i3]])
                                eval(`newButton("${Object.keys(input)[i3]}", () => {
                                    eval("${input[Object.keys(input)[i3]]}");
                                })`);
                            }
                        }
                    break;
                }
            }
            if (i >= scene.cmds.length - 1) clearInterval(scenePlayer);
        }, 10);
        }, 2000);
    }, 2000);
}

function showMenu () {
    // MIDIjs.play('media/music.mid');
    restoreBackgroundColours();
    if (tempData.revealTextInt) clearInterval(tempData.revealTextInt);
    showElement("navbar");
    showElement("topbar");
    showElement("content");
    hideElement("box1");
    document.getElementById("box1").innerHTML = "";
    hideElement("box2");
    document.getElementById("box2").innerHTML = "";
    hideAllButtons();
    document.getElementById("logo").src="media/lobby.png";
    newButton("Start Game", startGame);
    newButton("Save Data", saveData);
}

window.onload = function() {
    setTimeout(() => {
        showMenu();
    }, 1000);
}