/* callum fisher - corbex11@gmail.com
last updated: 27/12/21 */

const events = [
    { 'start': '12 10', 'end': '12 30', 'msg': 'Merry Christmas!' },
    { 'start': '10 31', 'end': '11 1', 'msg': 'Happy Halloween!'},
    { 'start': '11 5', 'end': '11 6', 'msg': 'Happy bonfire night!' },
    { 'start': '11 11', 'end': '11 11', 'msg': 'Remembrance Day' }
]

// to-do: combine these two functions:

function fetchEvents (date, month) {

    var results = [];

    events.forEach((event) => {
        var today = new Date(month + ' ' + date + ' ' + new Date().getFullYear()).setMonth(month-1);
        var eventStart = new Date(event.start + ' ' + new Date().getFullYear());
        var eventEnd = new Date(event.end + ' ' + new Date().getFullYear());
        if (eventEnd > today && today >= eventStart) results.push(event.msg);
    });

    return results;

}


function fetchEvent (date, month) {

    var results = [];

    events.forEach((event) => {
        var today = new Date(month + ' ' + date + ' ' + new Date().getFullYear()).setMonth(month-1);
        var eventStart = new Date(event.start + ' ' + new Date().getFullYear());
        var eventEnd = new Date(event.end + ' ' + new Date().getFullYear());
        if (eventEnd > today && today >= eventStart) results.push(event.msg);
    });

    return results[results.length * Math.random() | 0] || 'Enjoy today.';

}