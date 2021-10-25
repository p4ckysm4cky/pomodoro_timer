// Time Class
function Time(seconds: number = 0) {
    this.seconds = seconds;
}

Time.prototype.formated = function () {
    /**
     * Returns an object which contains
     * hours, minutes, seconds
     */
    const original_seconds = this.seconds;
    let return_time = {
        hours: Math.floor(original_seconds / 3600),
        minutes: Math.floor(original_seconds / 60) % 60,
        seconds: Math.round(original_seconds % 60),
    };
    return return_time;
};

Time.prototype.setCount = function (minutes: number) {
    /**
     * Sets the countdown using minutes
     */
    this.seconds = minutes * 60;
};

// Normal Functions
function playAlarm() {
    const audio = new Audio("../audio/alarm.flac");
    audio.play();
}

function runCount(callback?) {
    /**
     * Updates the countdown to decrement every second
     * isWork when True increments timeSpent
     */
    let intervalTimer = setInterval(() => {
        if (isRun && countdown.seconds !== 0) {
            countdown.seconds--;
            console.log(countdown.formated());
            console.log(countdown.seconds);
            if (isWork) timeSpent.seconds++;
            // This basically only runs on the transition from 1 -> 0
            if (countdown.seconds === 0) {
                if (callback) callback();
                // <include some reset timer here>
                clearInterval(intervalTimer);
                return;
                // Clear the timer when paused
            } else if (!isRun) {
                clearInterval(intervalTimer);
                return;
            }
        }
    }, 1000);
}

// Main
const navShortPomo = document.getElementById("shortPomodoro");
const navPomo = document.getElementById("pomodoro");
const navShortBreak = document.getElementById("shortBreak");
const navLongBreak = document.getElementById("longBreak");

let isRun: boolean = false; // Determines if clock should be running
let isWork: boolean = true; // Determines if time spent should be increasing
const timeSpent = new Time();
const countdown = new Time();

// test
isRun = true;
countdown.setCount(1 / 6);
