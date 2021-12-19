/* callum fisher - corbex11@gmail.com
last updated: 19/12/21 */

const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
];

const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

function suffix_of(i) {
    var j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return i + "st";
    }
    if (j == 2 && k != 12) {
        return i + "nd";
    }
    if (j == 3 && k != 13) {
        return i + "rd";
    }
    return i + "th";
}

window.onload = function() {
    var date = new Date();
    var hour = date.getHours();
    // <marquee width="100%" direction="left">
    var infoboard = document.getElementById("infoboard");
    infoboard.style.display = "block";
    infoboard.innerHTML = `<center>(i) Information Board (i)</center><hr><li>Today is ${days[date.getDay()]}, ${suffix_of(date.getDate())} of ${months[date.getMonth()]} ${date.getFullYear()}</li>`;
    document.getElementById("welcome").innerHTML = `Good ${hour >= 12 ? hour >= 17 && hour < 20 ? "evening <img src=\"media/lobby.png\">" : "afternoon" : "morning"}`;
    fetch(`${location.href}/../infoboard.txt`).then(function(data) {
        data.text().then((txt) => {
            txt.split("\n").forEach((line) => {
                infoboard.innerHTML += `<li>${line}</li>`;
            });
        });
    });
    fetchEvents(date.getDate(), date.getMonth() + 1).forEach((msg) => {
        infoboard.innerHTML += `<li>${msg}</li>`;
    });
}