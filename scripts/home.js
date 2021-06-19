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

function toggleinfoboard() {
    var infoboard = document.getElementById("infoboard")
    if (window.getComputedStyle(infoboard).display == "none") {
        infoboard.style.display = "block"
    } else {
         infoboard.style.animation = "fadeOut 0.5s linear infinite"
         setTimeout(function() {
            infoboard.style.display = "none"
            infoboard.style.animation = ""
        }, 400)
    }
}

window.onload = function() {
    // Fade-in to the colour specified in the stylesheet ++
    /* var rgb = window.getComputedStyle(document.body).backgroundColor.split("rgb(")[1].split(")")[0].replace(/ /g,"").split(",")
    document.body.style.backgroundColor = "rgb(0,0,0)"
    setTimeout(function() {
        var r = 0
        var g = 0
        var b = 0
        var int = setInterval(function() {
            if (rgb[0] >= r) {r += 1}
            if (rgb[1] >= g) {g += 1}
            if (rgb[2] >= b) {b += 1}
            document.body.style.backgroundColor = `rgb(${r},${g},${b})`
            if (r >= rgb[0] && g >= rgb[1] && b >= rgb[2]) {
                clearInterval(int)
            }
        }, 50)
    }, 2000) */
    // Fade-in to the colour specified in the stylesheet --
    
    // Manage information board ++
    var date = new Date()
    var infoboard = document.getElementById("welcome");
    infoboard.innerHTML = `<marquee width="100%" direction="left">Information Board <a style="color:red">| <i>welcome</i></a></marquee><hr><li>${days[date.getDay()]}, ${suffix_of(date.getDate())} of ${months[date.getMonth()]} ${date.getFullYear()}</li>`
    eventsOnDay(date.getMonth(), date.getDate()).forEach((msg) => {
        infoboard.innerHTML += `<li>${msg}</li>`;
    })
    // infoboard.innerHTML += "<li>test</li>"
    // Manage information board ++
}