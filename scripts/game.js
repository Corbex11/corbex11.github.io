/* callum fisher - corbex11@gmail.com
last updated 25/11/2021 */

function hideElement (element) {
    var element = document.getElementById(element);
    if (window.getComputedStyle(element).display !== "none") {
        element.style.animation = "fadeOut 0.5s linear infinite"
        setTimeout(function() {
            element.style.display = "none";
            element.style.animation = "";
        }, 400);
    }
}

function showElement (element) {
    var element = document.getElementById(element);
    if (window.getComputedStyle(element).display == "none") {
        element.style.display = "block";
    }
}

function fadeInBackground(R, G, B) { 
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
        }
    }, 20);

}

function hideAllButtons () {
    for (var i = 0; i >= 8; i++) {
        hideElement("button" + i);
        document.getElementById("button" + i).onclick = undefined;
    }
}

function rollDice() {
    hideAllButtons();
    showElement("button1");
    fadeInBackground(10,0,0);
    document.getElementById("logo").src="media/dice.gif";
    document.getElementById("button1").innerHTML = "Back";
    document.getElementById("button1").style.float = "right";
    showElement("button2");
    document.getElementById("box1").innerHTML = "<h1>Will you place a bet?</h1>";
    document.getElementById("button2").innerHTML = "Yes.";
    showElement("button3");
    let next = false;
    document.getElementById("button3").innerHTML = "No.";
    async function waitForRes () {
        while (next === false) await timeout(50); // pause script but avoid browser to freeze ;)
        const userInputVal = next;
        next = false; // reset var
        return userInputVal;
    }
    document.getElementById("button2").onclick = function () {
        next = true;
    }
    document.getElementById("button3").onclick = function () {
        next = true;
    }
    async function next (bet) {
        if (bet) {
            hideElement("button3");
            showElement("button2");
            document.getElementById("button2").onclick = undefined;
            document.getElementById("box1").innerHTML = "<h1>How much will you bet?</h1>";
            document.getElementById("button2").innerHTML = `<form><label for="betAmount">Amount: </label><input type="text" id="betAmount" name="betAmount"></form>`;
        }
    }
}

window.onload = function() {
    showElement("button1");
    document.getElementById("button1").innerHTML = "Roll the Dice!";
    document.getElementById("button1").onclick = rollDice;
}