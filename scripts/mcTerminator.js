/* callum fisher - corbex11@gmail.com
last updated: 4/11/2021 */

window.onload = function() {
    var homessi = 0
    setInterval(function() {
        console.log("test")
    	homessi++
	    document.getElementById("slideshow").src = `media/homess${homessi}.png`
	    if (homessi == 2) {
	    	homessi = 0
	    }
    }, 4000)
}