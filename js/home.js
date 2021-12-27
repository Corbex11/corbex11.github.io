/* callum fisher - corbex11@gmail.com
last updated: 27/12/21 */

const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
];

const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];


function suffix_of (i) {

    var j = i % 10, k = i % 100;

    if (j == 1 && k != 11) return i + 'st';
    if (j == 2 && k != 12) return i + 'nd';
    if (j == 3 && k != 13) return i + 'rd';

    return i + 'th';

}


window.onload = () => {

    var date = new Date();
    var hour = date.getHours();

    document.getElementById('welcome').innerHTML = `Good ${hour >= 12 ? hour >= 17 && hour < 20 ? 'evening' : 'afternoon' : 'morning'}!`;

    var infoboard = document.getElementById('infoboard');
    infoboard.style.display = 'block';
    infoboard.innerHTML = `<center>(i) Information Board (i)</center><hr><ul><li>Today is ${days[date.getDay()]}, ${suffix_of(date.getDate())} of ${months[date.getMonth()]} ${date.getFullYear()}</li></ul>`;

    document.getElementById('infoboardbr').style.display = 'block';
    
    var stringToAdd = infoboard.innerHTML + '<ul>';

    var fetchNews = () => {
        fetch(`${location.href}/../infoboard.txt`).then((data) => {
            data.text().then((txt) => {
                stringToAdd += '<ul>';
                txt.split('\n').forEach((item, index, array) => {
                    stringToAdd += '<li>' + item + '</li>';
                    if (index == array.length) infoboard.innerHTML = stringToAdd + '</ul>';
                });
            });
        });
    }
    
    fetchEvents(date.getDate(), date.getMonth() + 1).forEach((item, index, array) => {
        stringToAdd += '<li>' + item + '</li>';
        if (index == array.length - 1) {
            infoboard.innerHTML = stringToAdd += '</ul>';
            stringToAdd = '';
            fetchNews();
        }
    });

    // Thanks: https://stackoverflow.com/questions/18983138/

    if (hour < 7) document.getElementById('intro').innerHTML += '<br><br>Anyway, I won\'t bore you with any more of that. It is ' + hour + ' AM after all.';

}