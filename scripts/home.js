/* callum fisher - corbex11@gmail.com
last updated: 3/11/21 */

var days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
]

var months = [
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
]

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
    var infoboard = document.getElementById("infoboard");
    infoboard.innerHTML = `<marquee width="100%" direction="left">(i) Information Board (i)</a></marquee><hr><li>${days[date.getDay()]}, ${suffix_of(date.getDate())} of ${months[date.getMonth()]} ${date.getFullYear()}</li>`;
    infoboard.innerHTML += `<li>No additional notices!</li>`; // ${hour >= 12 ? hour >= 17 && hour < 20 ? "evening" : "afternoon" : "morning"}
    eventsOnDay(date.getMonth(), date.getDate()).forEach((msg) => {
        infoboard.innerHTML += `<li>${msg}</li>`;
    });
}