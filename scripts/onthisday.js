/* callum fisher - corbex11@gmail.com
last updated: 4/7/21 */

var events = [
    {month:12,date:25,msg:"Merry Christmas!"},
    {month:10,date:31,msg:"Happy Halloween!"},
    {month:11,date:11,msg:"Remembrance Day"}
]

function eventsOnDay(month, date) {
    var results = [];
    events.forEach((event) => {
        if (event.month == month+1 && event.date == date) {
            results.push(event.msg);
        }
    });
    return results;
}

function eventOnDay(month, date) {
    var results = [];
    events.forEach((event) => {
        if (event.month == month+1 && event.date == date) {
            results.push(event.msg);
        }
    });
    return results[results.length * Math.random() | 0] || "Enjoy today.";
 }