/* callum fisher - corbex11@gmail.com
last updated 14/12/2021 */

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
        document.getElementById("box1").innerHTML = "";
        revealText("Select a previously saved file.", document.getElementById("box1"));
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
    document.getElementById("box1").innerHTML = "";
    revealText("Welcome to the Save Data menu. You can record all of your progress across the game here, and pick up from where you left off whenever you want to.", document.getElementById("box1"));
}

function revealText (text, element) {
    if (tempData.revealTextInt) clearInterval(tempData.revealTextInt);
    var i = -1;
    tempData.revealTextInt = setInterval(() => {
        i++;
        element.innerHTML += text.charAt(i);
        if (i == text.length) clearInterval(tempData.revealTextInt);
    }, 20);
}

function startGame () {
    playScene({
        "notes": ["Introduction"],
        "cmds": [
            { "cmd": "background", "input": { "colors": [[0, 0, 0]] }},
            { "cmd": "wait", "input": 7000 },
            { "cmd": "dialogue", "input": { "speaker": null, "speech": "..." }},
            { "cmd": "wait", "input": 3000 },
            { "cmd": "dialogue" },
            { "cmd": "dialogue", "input": { "speaker": null, "speech": "...Where am I...?" }},
            { "cmd": "options", "input": { "Stand up": "wait = false;" }},
            { "cmd": "wait" },
            { "cmd": "options" },
            { "cmd": "dialogue", "input": { "speaker": null, "speech": "Wow..!" }},
            { "cmd": "background", "input": { "colors": [[0, 160, 80], [0, 200, 200]] }}
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
                        if (input) setTimeout(() => { wait = false }, input);
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
                            setTimeout(() => { wait = false; }, txt.length * 20);
                            showElement("content");
                            showElement("box1");
                            revealText(txt, document.getElementById("box1"));
                        }
                    break;
                    case "eval":
                        console.log(input);
                        console.log(wait);
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
                        } else {
                            hideAllButtons();
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
    audio.src = "media/introduction.mp3";
    audio.play();
    restoreBackgroundColours();
    if (tempData.revealTextInt) clearInterval(tempData.revealTextInt);
    showElement("navbar");
    showElement("topbar");
    showElement("content");
    showElement("box1");
    document.getElementById("box1").innerHTML = "";
    revealText(`The FitnessGram PACER Test is a multistage aerobic capacity test that progressively gets more difficult as it continues.

    The test is used to measure a student's aerobic capacity as part of the FitnessGram assessment. Students run back and forth as many times as they can, each lap signaled by a beep sound. The test get progressively faster as it continues until the student reaches their max lap score.
    
    The PACER Test score is combined in the FitnessGram software with scores for muscular strength, endurance, flexibility and body composition to determine whether a student is in the Healthy Fitness Zone™ or the Needs Improvement Zone™.
    This isn't a paywall.
    We'll cut to the chase: 98% of Wikipedia's readers don't give; they simply look away. All we ask is £2, or whatever seems right to you this Tuesday, before you get back to your article.
    DONATE MAYBE LATER
    Jean Edward Smith
    From Wikipedia, the free encyclopedia
    Jump to navigationJump to search
    Jean Edward Smith
    Born	October 13, 1932
    Washington, D.C., U.S.
    Died	September 1, 2019 (aged 86)
    Huntington, West Virginia, U.S.
    Alma mater	Princeton University (A.B., 1954) Columbia University (Ph.D., 1964)
    Occupation	Biographer, academic
    We ask you, humbly: don't scroll away.
     Hi reader. This is the 9th time we’ve interrupted your reading recently, but 98% of our readers don't give. Many think they’ll give later, but then forget. This Tuesday we ask you to protect Wikipedia. All we ask is £2, or what you can afford, to secure our future. We ask you, humbly: Please don't scroll away. If you are one of our rare donors, we warmly thank you.
    Please select a payment method
    
    MAYBE LATER  CLOSE 
    Jean Edward Smith (October 13, 1932 – September 1, 2019) was a biographer and the John Marshall Professor of Political Science at Marshall University.[1] He was also professor emeritus at the University of Toronto after having served as professor of political economy there for thirty-five years. Smith was also on the faculty of the Master of American History and Government program at Ashland University.[2]
    
    The winner of the 2008 Francis Parkman Prize and the 2002 finalist for the Pulitzer Prize for Biography or Autobiography, Smith was called "today’s foremost biographer of formidable figures in American history."[1][3]
    
    
    Contents
    1	Education and military service
    2	Career
    3	Bibliography
    4	References
    5	External links
    Education and military service
    
    This section does not cite any sources. Please help improve this section by adding citations to reliable sources. Unsourced material may be challenged and removed. (January 2013) (Learn how and when to remove this template message)
    A graduate of McKinley High School in Washington, D.C., Smith received an A.B. from Princeton University in 1954. While attending Princeton, Smith was mentored under law professor and political scientist William M. Beaney. Serving in the military from 1954 to 1961, he rose to the rank of Captain (RA) US Army (Artillery). Smith served in West Berlin and Dachau, Germany. In 1964, he obtained a Ph.D. from the Department of Public Law and Government of Columbia University.
    
    Career
    Smith began his teaching career as assistant professor of government at Dartmouth College, a post he held from 1963 until 1965. He then became a professor of political economy at the University of Toronto in 1965 until his retirement in 1999. Smith also served as visiting professor at several universities during his tenure at the University of Toronto and after his retirement including the Freie Universität in Berlin, Georgetown University,[4] the University of Virginia’s Woodrow Wilson Department of Government and Foreign Affairs, the University of California at San Diego, and Marshall University in Huntington, West Virginia. He died on September 1, 2019, from complications of Parkinson's disease with his family by his side.[5][6]
    
    Bibliography
    Smith won the 2008 Francis Parkman Prize for FDR, his 2007 biography. He was the 2002 finalist for the Pulitzer Prize for Biography or Autobiography for Grant, his 2001 biography.
    
    The Defense of Berlin. Baltimore: Johns Hopkins University Press, 1963. (LCCN 63-17670)
    The Wall as Watershed. Arlington, Virginia: Institute for Defense Analyses, 1966.
    Germany Beyond the Wall: People, Politics, and Prosperity. Boston: Little, Brown, 1969.
    The Papers of Lucius D. Clay: Germany, 1945-1949. (ed.) Bloomington, Ind.: Indiana University Press, 1974.
    The Evolution of NATO with Four Plausible Threat Scenarios. (with Steven L. Canby), Ottawa, Canada: Canada Department of National Defence, 1987.
    The Conduct of American Foreign Policy Debated. (with Herbert Levine) New York: McGraw-Hill, 1990.
    Civil Rights and Civil Liberties Debated. (with Herbert Levine) 1988. (ISBN 013134966X)
    The Constitution and American Foreign Policy.
    Lucius D. Clay: An American Life. New York: Henry Holt and Company, 1990. (ISBN 080500999X)
    George Bush's War. New York: Henry Holt and Company, 1992. (ISBN 0805013881)
    John Marshall: Definer of a Nation. New York: Henry, Holt & Company, 1996. (ISBN 080501389X)
    The Face of Justice: Portraits of John Marshall. (with William H. Gerdts, Wendell D. Garrett, Frederick S. Voss, and David B. Dearinger), Huntington, West Virginia: Huntington Museum of Art, 2001. (ISBN 0965388816)
    Grant. New York: Simon and Schuster, 2001. (ISBN 0684849267)
    FDR. New York: Random House, 2007. (ISBN 9781400061211)
    Eisenhower in War and Peace. New York: Random House, 2012. (ISBN 9781400066933)
    Bush. New York: Simon & Schuster, 2016. (ISBN 9781476741192)[7]
    The Liberation of Paris: How Eisenhower, de Gaulle, and von Choltitz Saved the City of Light. New York: Simon and Schuster, 2019. (ISBN 9781501164927)
    References
     "Jean Edward Smith". Marshall University. Retrieved 2012-01-05.
     "Jean Edward Smith". Ashland University. Archived from the original on 2012-02-06. Retrieved 2012-01-05.
     "Biography or Autobiography". The Pulitzer Prizes. Columbia University. Retrieved 2012-01-05.
     "Jean Edward Smith Papers". Georgetown University. Archived from the original on 2012-02-04.
     Seelye, Katherine Q. (September 13, 2019). "Jean Edward Smith, Biographer of the Underrated, Dies at 86". The New York Times. Retrieved 2019-12-25.
     Ingram, Sarah (September 10, 2019). "Nationally recognized author with Marshall connections dies". The Parthenon. Retrieved 2019-12-25.
     Baker, Peter (July 3, 2016). "Review: 'Bush,' a Biography as Scathing Indictment". The New York Times. Retrieved July 5, 2016.
    External links
    Appearances on C-SPAN
    Authority control Edit this at Wikidata
    General	
    Integrated Authority File (Germany)ISNI 1VIAF 1WorldCat
    National libraries	
    NorwayFrance (data)United StatesNetherlandsPolandSweden
    Other	
    Faceted Application of Subject TerminologySocial Networks and Archival ContextSUDOC (France) 1
    Categories: 1932 births2019 deaths21st-century American historians21st-century American male writersAshland University facultyColumbia University alumniDartmouth College facultyGeorgetown University facultyLegal historiansMarshall University facultyMilitary personnel from Washington, D.C.Official biographers to the presidents of the United StatesPrinceton University alumniUnited States Army officersUniversity of California, San Diego facultyUniversity of Toronto facultyUniversity of Virginia facultyWriters from Washington, D.C.American male non-fiction writers
    Navigation menu
    Not logged in
    Talk
    Contributions
    Create account
    Log in
    ArticleTalk
    ReadEditView history
    Search
    Search Wikipedia
    Main page
    Contents
    Current events
    Random article
    About Wikipedia
    Contact us
    Donate
    Contribute
    Help
    Learn to edit
    Community portal
    Recent changes
    Upload file
    Tools
    What links here
    Related changes
    Special pages
    Permanent link
    Page information
    Cite this page
    Wikidata item
    Print/export
    Download as PDF
    Printable version
    
    Languages
    العربية
    مصرى
    Edit links
    This page was last edited on 4 November 2021, at 12:33 (UTC).
    Text is available under the Creative Commons Attribution-ShareAlike License; additional terms may apply. By using this site, you agree to the Terms of Use and Privacy Policy. Wikipedia® is a registered trademark of the Wikimedia Foundation, Inc., a non-profit organization.
    Privacy policyAbout WikipediaDisclaimersContact WikipediaMobile viewDevelopersStatisticsCookie statementWikimedia FoundationPowered by MediaWiki`, document.getElementById("box1"));
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