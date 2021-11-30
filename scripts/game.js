/* callum fisher - corbex11@gmail.com
last updated 30/11/2021 */

var buttons = [];
var data = {};
var audio = new Audio();

function hideElement (element) {
    var element = document.getElementById(element);
    if (window.getComputedStyle(element).display == "block") {
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

backgroundChangeInProgress = false;
function fadeInBackground(R, G, B) {
    var waitForBackgroundChange = setInterval(() => {
        if (!backgroundChangeInProgress) {
            clearInterval(waitForBackgroundChange);
            backgroundChangeInProgress = true;
            var rgb = window.getComputedStyle(document.body).backgroundColor.split("rgb(")[1].split(")")[0].replace(/ /g,"").split(",");
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
                document.body.style.backgroundColor = `rgb(${r},${g},${b})`;
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

function saveData () {
    hideAllButtons();
    fadeInBackground(0,100,150);
    newButton("Record my Current Progress");
    newButton("Continue from a Previous Save");
    addQuitButton();
    document.getElementById("logo").src = "media/save.png";
    showElement("box1");
    document.getElementById("box1").innerHTML = "<h1>Hello.</h1><h2>Welcome to the Save Data menu.</h2><p>You can record all of your progress across the game here, and pick up from where you left off whenever you want to.</p>";
}

function newButton (label, onclick) { // Thanks: https://sebhastian.com/javascript-create-button/
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
    audio.src = "media/Kevin MacLeod - Rollin at 5 - 210 - full.mp3";
    audio.play();
    audio.volume = 1;
    hideElement("credits");
    showElement("box1");
    document.getElementById("box1").innerHTML = "Clark: \"Let's get started, then! Will you be placing a bet on this roll?\"";
    hideAllButtons();
    fadeInBackground(0,0,40);
    document.getElementById("logo").src = "media/dice.png";
    var confirmBetAmount = function () {
        document.getElementById("box1").innerHTML = "Clark: \"How much are you going to bet?\"";
        hideAllButtons();
        newButton("I've changed my mind.", function() {
            rollDice();
        }).then(function(id) {
            buttons[id].style.float = "right";
        });
        newButton().then(function(id) {
            buttons[id].innerHTML = `<form><label for="betAmount"></label><input type="number" autocomplete="off" min="1" placeholder="Enter bet amount" id="betAmount" name="betAmount"></form>`;
        });
        var betAmount;
        newButton("Confirm Bet!", function() {
            hideElement("navbar");
            betAmount = document.getElementById("betAmount").value;
            roll();
        });
    }
    var notBetting = function () {
        hideElement("navbar");
        document.getElementById("box1").innerHTML = "Clark: \"Okay.\"";
        if (Math.random() > 0.8) { // We don't always want a drumroll, it'll get annoying hearing it every time, so let's give it a 20% chance of happening instead.
            document.getElementById("logo").src = "media/drumroll.gif";
            new Audio("media/drumroll.mp3").play();
        } else {
            document.getElementById("logo").src = "media/dice.gif";
        }
        fadeInBackground(0,0,0);
        setTimeout(() => { // Suspense!
            roll();
        }, 2000);
    }
    var roll = function () {
        fadeInBackground(0,0,40);
        document.getElementById("logo").src = "media/rolldice.png";
        new Audio("media/rollDice.mp3").play();
        var losses = ["Unlucky!", "Unfortunate!", "Nope.", "What if you placed down a higher bet?", "Not quite.", "Not quite!", "Nah.", "Nope!", "No!", "Not quite!", "Tough luck.", "Maybe next time.", "Typical.", "Typical!", "How unlucky!", "Most unfortunate!", "Oh!"];
        document.getElementById("box1").innerHTML = "Clark: \"" + rando(losses) + " You rolled a...\"<h1>"+(Math.floor(Math.random()*6)+1)+"</h1>Clark: \"Would you like to roll again?\"";
        showElement("navbar");
        hideAllButtons();
        newButton("Yes.", notBetting);
        newButton("I'll make a bet.", confirmBetAmount);
        newButton("No, thanks.", showMenu).then(function(id) {
            buttons[id].style.float = "right";
        });
    }
    newButton("Yes.", confirmBetAmount);
    newButton("No, thanks.", notBetting);
    addQuitButton();
    var next = function(bet) {
        hideAllButtons();
        if (bet) {
            showElement("button2");
            document.getElementById("button2").onclick = undefined;
            document.getElementById("box1").innerHTML = "<h1>How much will you bet on this roll?</h1>";
            document.getElementById("button2")
            next()
        }
    }
}

function showMenu() {
    audio.src = "media/Kevin MacLeod - Tranquility.mp3";
    audio.play();
    audio.volume = 0.1
    showElement("navbar");
    hideElement("box1");
    showElement("credits");
    hideAllButtons();
    document.getElementById("logo").src="media/lobby.png";
    fadeInBackground(5,5,5);
    newButton("Roll the Dice!", rollDice);
    newButton("Save Data", saveData);
}

window.onload = function() {
    showMenu();
}