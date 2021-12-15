/* callum fisher - corbex11@gmail.com
last updated: 4/7/21 */

var lightOn = true;


function getUrlVars () {
	var vars = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
		vars[key] = value;
	});
	return vars;
}


function updateContent () { // Update what's displayed in the Content Window:
	if (!getUrlVars().f) {
		location.href = `${location.href}?f=welcome.html`;
	} else {
		fetch(`${location.origin}/articles/${getUrlVars().f}`).then(function(data) {
			data.text().then(function (article) {
				document.getElementById("content").innerHTML = article;
			});
		});
	}
}


// Lighting:
function toggleLight (save) {
	if (lightOn) {
		if (save) localStorage.light = "off";
		/* document.body.style.backgroundColor = "rgb(20,20,20)"
		document.body.style.backgroundImage = "url('/media/background_dark.jpg')" */
		document.getElementById("content").style = "color:rgb(205,205,205);background-color:rgb(50,50,50);padding:10px;font-family:verdana";
		document.getElementById("lightswitch").innerHTML = "Enable Light Mode";
		document.getElementById("lightswitch").src = "media/freepik_switch_off.png";
	} else {
		if (save) localStorage.light = "on";
		/* document.body.style.backgroundColor = "rgb(180,180,180)"
		document.body.style.backgroundImage = "url('/media/background_light.jpg')" */
		document.getElementById("content").style="color:rgb(50,50,50);background-color:rgb(205,205,205);padding:10px;font-family:verdana";
		document.getElementById("lightswitch").innerHTML = "Enable Dark Mode";
		document.getElementById("lightswitch").src = "media/freepik_switch_on.png";
	}
	lightOn = !lightOn;
}


// Initialize:
window.onload = function() {
	updateContent(); // update the content window with this content
	// check for saved data:
	if (!localStorage.light) {
		localStorage.light = "on";
	} else if (localStorage.light !== "on") {
		toggleLight(true);
	}
	// check for url lighting override:
	if (getUrlVars().dark) {
		if (getUrlVars().dark == 1) {
			if (lightOn) {
				toggleLight(false);
			}
		} else if (getUrlVars().dark == 0) {
			if (!lightOn) {
				toggleLight(false);
			}
		}
	}
}