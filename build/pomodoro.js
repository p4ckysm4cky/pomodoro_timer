// Time Class
function Time(seconds) {
    if (seconds === void 0) { seconds = 0; }
    this.seconds = seconds;
}
Time.prototype.formated = function () {
    /**
     * Returns an object which contains
     * hours, minutes, seconds
     */
    var original_seconds = this.seconds;
    var return_time = {
        hours: Math.floor(original_seconds / 3600),
        minutes: Math.floor(original_seconds / 60) % 60,
        seconds: Math.round(original_seconds % 60),
    };
    return return_time;
};
Time.prototype.setCount = function (minutes) {
    /**
     * Sets the countdown using minutes
     */
    this.seconds = minutes * 60;
};
// Normal Functions
function playAlarm() {
    audio.play();
}
function runCount(callback) {
    /**
     * Updates the countdown to decrement every second
     * isWork when True increments timeSpent
     */
    var startTime = Date.now();
    var startSeconds = countdown.seconds;
    var startSpent = timeSpent.seconds;
    var startBreakSpent = breakSpent.seconds;
    var timeWorker = new Worker("./build/worker.js");
    timeWorker.postMessage(" ");
    timeWorker.onmessage = function () {
        if (isRun && countdown.seconds > 0) {
            // This strat is used, so we can accurately calculate time
            countdown.seconds = Math.round(startSeconds - (Date.now() - startTime) / 1000);
            clockP.innerHTML = displayCount();
            if (isWork) {
                timeSpent.seconds = Math.round((timeSpent.seconds =
                    startSpent + (Date.now() - startTime) / 1000));
                updateTimeSpent();
                timeSpentSpan.innerHTML = displaySpent();
            }
            else {
                breakSpent.seconds = Math.round((breakSpent.seconds =
                    startBreakSpent + (Date.now() - startTime) / 1000));
                updateTimeSpent();
                breakSpentSpan.innerHTML = displayBreakSpent();
            }
            // This basically only runs on the transition from 1 -> 0
            if (countdown.seconds === 0) {
                console.log("Exited on 0");
                if (callback)
                    callback();
                isRun = false;
                select(currentSelection);
                timeWorker.terminate();
                return;
            }
            // Worse case scenario the thread is inactive, and our timer goes to negative
        }
        else if (countdown.seconds <= 0) {
            console.log("Exited on -number");
            if (callback)
                callback();
            isRun = false;
            select(currentSelection);
            timeWorker.terminate();
            return;
        }
        else {
            // Clear the timer when paused
            timeWorker.terminate();
            return;
        }
    };
}
function displaySpent() {
    /**
     * Returns a properly formated string to match the
     * seconds of the timeSpent object
     */
    var clockObject = timeSpent.formated();
    var hours = clockObject.hours.toString().padStart(2, "0");
    var minutes = clockObject.minutes.toString().padStart(2, "0");
    var seconds = clockObject.seconds.toString().padStart(2, "0");
    return "".concat(hours, ":").concat(minutes, ":").concat(seconds);
}
function displayBreakSpent() {
    /**
     * Returns a properly formated string to match the
     * seconds of the breakSpent object
     */
    var clockObject = breakSpent.formated();
    var hours = clockObject.hours.toString().padStart(2, "0");
    var minutes = clockObject.minutes.toString().padStart(2, "0");
    var seconds = clockObject.seconds.toString().padStart(2, "0");
    return "".concat(hours, ":").concat(minutes, ":").concat(seconds);
}
function displayCount() {
    /**
     * Returns a properly formated string to match the
     * seconds of the countdown object
     */
    var clockObject = countdown.formated();
    var minutes = (clockObject.hours * 60 + clockObject.minutes)
        .toString()
        .padStart(2, "0");
    var seconds = clockObject.seconds.toString().padStart(2, "0");
    return "".concat(minutes, ":").concat(seconds);
}
function select(id) {
    /**
     * A function that handles which mode the pomdoro should be
     * "preset beforehand" when the type of clock is selected.
     * It is to be used as a callback function for an event
     */
    var do_switch = true;
    if (isRun) {
        var confirmation = confirm("Switching will cause your timer to stop.\nAre you sure you want to change timer?");
        if (!confirmation)
            do_switch = false;
    }
    if (do_switch) {
        isRun = false;
        startBtn.innerText = "Start";
        switch (id) {
            case "shortPomodoro":
                currentSelection = id;
                document.documentElement.className = "theme-pomodoro";
                isWork = true;
                countdown.setCount(10);
                clockP.innerHTML = displayCount();
                break;
            case "pomodoro":
                currentSelection = id;
                document.documentElement.className = "theme-pomodoro";
                isWork = true;
                countdown.setCount(25);
                clockP.innerHTML = displayCount();
                break;
            case "longPomodoro":
                currentSelection = id;
                document.documentElement.className = "theme-pomodoro";
                isWork = true;
                countdown.setCount(45);
                clockP.innerHTML = displayCount();
                break;
            case "shortBreak":
                currentSelection = id;
                document.documentElement.className = "theme-break";
                isWork = false;
                countdown.setCount(10);
                clockP.innerHTML = displayCount();
                break;
            case "mediumBreak":
                currentSelection = id;
                document.documentElement.className = "theme-break";
                isWork = false;
                countdown.setCount(25);
                clockP.innerHTML = displayCount();
                break;
            case "longBreak":
                currentSelection = id;
                document.documentElement.className = "theme-break";
                isWork = false;
                countdown.setCount(45);
                clockP.innerHTML = displayCount();
                break;
            default:
                console.log("Error in select");
        }
    }
}
function updateTimeSpent() {
    /**
     * This function needs to run everytime we make changes to
     * the timeSpent seconds, so we store it in localstorage
     */
    var stringifySeconds = JSON.stringify(timeSpent.seconds);
    localStorage.setItem("timeSpent", stringifySeconds);
    var stringifyBreakSeconds = JSON.stringify(breakSpent.seconds);
    localStorage.setItem("breakSpent", stringifyBreakSeconds);
}
function loadTimeSpent() {
    /**
     * If timeSpent is stored in localStorage
     * it is added updated back as the value
     */
    if (localStorage.timeSpent) {
        var timeSpentSeconds = JSON.parse(localStorage.timeSpent);
        timeSpent.seconds = timeSpentSeconds;
    }
    if (localStorage.breakSpent) {
        var breakSpentSeconds = JSON.parse(localStorage.breakSpent);
        breakSpent.seconds = breakSpentSeconds;
    }
}
// Main
var clockP = document.getElementById("clock");
var startBtn = document.getElementById("start");
var resetBtn = document.getElementById("reset");
var navShortPomo = document.getElementById("shortPomodoro");
var navPomo = document.getElementById("pomodoro");
var navLongPomo = document.getElementById("longPomodoro");
var navShortBreak = document.getElementById("shortBreak");
var navMediumBreak = document.getElementById("mediumBreak");
var navLongBreak = document.getElementById("longBreak");
var timeSpentP = document.getElementById("timeSpent");
var timeSpentSpan = document.getElementById("timeSpentValue");
var breakSpentSpan = document.getElementById("breakSpentValue");
startBtn.addEventListener("click", function () {
    if (startBtn.innerText.toLowerCase() === "start") {
        isRun = true;
        startBtn.innerText = "Stop";
        runCount(playAlarm);
    }
    else {
        isRun = false;
        startBtn.innerText = "Start";
    }
});
resetBtn.addEventListener("click", function () {
    if (confirm("Are you sure you want to reset?")) {
        isRun = false;
        select(currentSelection);
    }
});
navShortPomo.addEventListener("click", function (event) {
    select(event.target.id);
});
navPomo.addEventListener("click", function (event) {
    select(event.target.id);
});
navLongPomo.addEventListener("click", function (event) {
    select(event.target.id);
});
navShortBreak.addEventListener("click", function (event) {
    select(event.target.id);
});
navMediumBreak.addEventListener("click", function (event) {
    select(event.target.id);
});
navLongBreak.addEventListener("click", function (event) {
    select(event.target.id);
});
timeSpentP.addEventListener("click", function () {
    /**
     * Resets the time spent on click
     */
    if (timeSpent.seconds === 0 && breakSpent.seconds === 0) {
        return;
    }
    else {
        var confirmation = confirm("Do you want to reset time spent?");
        if (confirmation) {
            timeSpent.seconds = 0;
            timeSpentSpan.innerHTML = displaySpent();
            breakSpent.seconds = 0;
            breakSpentSpan.innerHTML = displayBreakSpent();
            updateTimeSpent();
        }
    }
});
//FIXME: This is really bad from a UX perspective
// Display prompt to add time to timeSpent in minutes
document.addEventListener("keydown", function (event) {
    if (event.altKey && event.key === "t") {
        var minutes = parseInt(prompt("Add time in minutes:"));
        if (isNaN(minutes)) {
            alert("Invalid input");
        }
        else {
            timeSpent.seconds += minutes * 60;
            timeSpentSpan.innerHTML = displaySpent();
            updateTimeSpent();
        }
    }
});
// Display prompt to add time to breakSpent in minutes
document.addEventListener("keydown", function (event) {
    if (event.altKey && event.key === "b") {
        var minutes = parseInt(prompt("Add time in minutes:"));
        if (isNaN(minutes)) {
            alert("Invalid input");
        }
        else {
            breakSpent.seconds += minutes * 60;
            breakSpentSpan.innerHTML = displayBreakSpent();
            updateTimeSpent();
        }
    }
});
var isRun = false; // Determines if clock should be running
var isWork = true; // Determines if time spent should be increasing
var currentSelection; // Stores the ID of the clock that is currently selected
var timeSpent = new Time();
var breakSpent = new Time();
var countdown = new Time();
loadTimeSpent(); // load timeSpent from localstorage
timeSpentSpan.innerHTML = displaySpent(); // Displays timeSpent to DOM
breakSpentSpan.innerHTML = displayBreakSpent();
var audio = new Audio("./audio/alarm.flac");
select("shortPomodoro");
//# sourceMappingURL=pomodoro.js.map