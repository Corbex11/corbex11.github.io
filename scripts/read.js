/* callum fisher - corbex11@gmail.com
last updated: 19/6/21 */

// Main functions ++
function getUrlVars () {
	var vars = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
		vars[key] = value;
	});
	return vars;
}

function updatetxt () {
	if (!getUrlVars().f) {
		location.href = `${location.origin}/read.html?f=welcome.txt`;
	} else {
		fetch(`${location.origin}/articles/${getUrlVars().f}`).then(function(data) {
			data.text().then(function (txt) {
				document.getElementById("txt").innerHTML = txt;
			});
		});
	}
}
// Main functions --

// Notifications ++
var navbar_notifs = []
setInterval(function() {
	if (navbar_notifs.length > 0) {
		document.getElementById("notification").innerHTML = navbar_notifs[0];
		setTimeout(function() {
			navbar_notifs.shift();
		}, 4000);
	} else {
		document.getElementById("notification").innerHTML = "";
	}
}, 1000);
// Notifications --

// Lighting ++
var lighton = true
function togglelight (save) {
	if (lighton) {
		lighton = false;
		if (save) {
			localStorage.light = "off";
		}
		// document.body.style.backgroundColor = "rgb(20,20,20)"
		// document.body.style.backgroundImage = "url('/media/background_dark.jpg')"
		document.getElementById("txt").style = "color:rgb(205,205,205);background-color:rgb(50,50,50);padding:10px;font-family:verdana";
		document.getElementById("lightswitch").innerHTML = "Enable Light Mode";
		document.getElementById("lightswitch").src = "media/freepik_switch_off.png";
	} else {
		lighton = true;
		if (save) {
			localStorage.light = "on";
		}
		// document.body.style.backgroundColor = "rgb(180,180,180)"
		// document.body.style.backgroundImage = "url('/media/background_light.jpg')"
		document.getElementById("txt").style="color:rgb(50,50,50);background-color:rgb(205,205,205);padding:10px;font-family:verdana";
		document.getElementById("lightswitch").innerHTML = "Enable Dark Mode";
		document.getElementById("lightswitch").src = "media/freepik_switch_on.png";
	}
}
// Lighting --

// Initialize:
window.onload = function() {
	updatetxt(); // update the content window with this content
	// Manage Lighting ++
	// check for saved data:
	if (!localStorage.light) {
		localStorage.light = "on";
	} else if (localStorage.light !== "on") {
		togglelight(true);
	}
	// check for url lighting override:
	if (getUrlVars().dark) {
		if (getUrlVars().dark == 1) {
			if (lighton) {
				togglelight(false);
				navbar_notifs.push("Light disabled by URL");
			}
		} else if (getUrlVars().dark == 0) {
			if (!lighton) {
				togglelight(false);
				navbar_notifs.push("Light enabled by URL");
			}
		}
	}
	// Manage Lighting --
}