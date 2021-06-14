// Fade-in to the colour specified in the stylesheet:
window.onload = function() {
    var rgb = window.getComputedStyle(document.body).backgroundColor.split("rgb(")[1].split(")")[0].replace(/ /g,"").split(",")
    document.body.style.backgroundColor = "rgb(0,0,0)"
    setTimeout(function() {
        var r = 0
        var g = 0
        var b = 0
        var int = setInterval(function() {
            if (rgb[0] >= r) {r += 0.1}
            if (rgb[1] >= g) {g += 0.1}
            if (rgb[2] >= b) {b += 0.1}
            document.body.style.backgroundColor = `rgb(${r},${g},${b})`
            if (r >= rgb[0] && g >= rgb[1] && b >= rgb[2]) {
                clearInterval(int)
            }
        }, 10)
    }, 1000)
}

function toggleoptions() {
    var options = document.getElementById("options")
    if (options.style.display == "none") {
        options.style.display = "block"
    } else {
         options.style.animation = "fadeOut 0.5s linear infinite"
         setTimeout(function() {
            options.style.display = "none"
            options.style.animation = ""
        }, 500)
    }
}