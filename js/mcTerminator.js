/* callum fisher - corbex11@gmail.com
last updated: 20/11/2021 */

window.onload = function() {
    var count = 0;
    setInterval(function() {
    	count++
	    document.getElementById("slideshow").src = `media/mcTerminator${ssi}.png`;
	    if (count == 2) {
	    	count = 0;
	    }
    }, 4000);
}