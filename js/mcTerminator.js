/* callum fisher - cf.fisher.bham@gmail.com
last updated: 27.12.2021 */

window.onload = () => {
    var count = 0;
    setInterval(() => {
    	count++;
	    document.getElementById("slideshow").src = 'media/mcTerminator' + count + '.png';
	    if (count == 2) count = 0;
    }, 4000);
}