function toggleoptions() {
    var options = document.getElementById("options")
    if (window.getComputedStyle(options).display == "none") {
        options.style.display = "block"
    } else {
         options.style.animation = "fadeOut 0.5s linear infinite"
         setTimeout(function() {
            options.style.display = "none"
            options.style.animation = ""
        }, 400)
    }
}

function fadeandgo(page) {
    options.style.animation = "fadeOut 0.5s linear infinite"
    setTimeout(function() {
       options.style.display = "none"
       options.style.animation = ""
       location.href = `${location.origin}/${page}`
   }, 400)
}