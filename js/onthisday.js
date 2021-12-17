/* callum fisher - corbex11@gmail.com
last updated: 3/11/21 */

var events = [ // to-do: implement "start" and "end" dates for events to avoid repetition
    {month:12,date:24,msg:"Merry Christmas!"},
    {month:12,date:25,msg:"Merry Christmas!"},
    {month:12,date:26,msg:"Merry Christmas!"},
    {month:10,date:30,msg:"Happy Halloween!"},
    {month:10,date:31,msg:"Happy Halloween!"},
    {month:11,date:1,msg:"Happy Halloween!"},
    {month:11,date:2,msg:"Bonfire night!"},
    {month:11,date:11,msg:"Remembrance Day"},

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