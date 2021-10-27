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

function displayCount(): string {
    /**
     * Updates the text on clock DOM to match the
     * seconds of the countdown object
     */
    const clockObject = countdown.formated();
    let minutes = clockObject.minutes.toString().padStart(2, "0");
    let seconds = clockObject.seconds.toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
}

function select(id: string) {
    /**
     * A function that handles which mode the pomdoro should be
     * "preset beforehand" when the type of clock is selected.
     * It is to be used as a callback function for an event
     */
    switch (id) {
        case "shortPomodoro":
            document.documentElement.className = "theme-pomodoro";
            isWork = true;
            countdown.setCount(10);
            clockP.innerHTML = displayCount();
            break;
        case "pomodoro":
            document.documentElement.className = "theme-pomodoro";
            isWork = true;
            countdown.setCount(25);
            clockP.innerHTML = displayCount();
            break;
        case "shortBreak":
            document.documentElement.className = "theme-break";
            isWork = false;
            countdown.setCount(5);
            clockP.innerHTML = displayCount();
            break;
        case "longBreak":
            document.documentElement.className = "theme-break";
            isWork = false;
            countdown.setCount(15);
            clockP.innerHTML = displayCount();
            break;
        default:
            console.log("Error in select");
    }
}

// Main
const clockP = document.getElementById("clock");

const navShortPomo = document.getElementById("shortPomodoro");
const navPomo = document.getElementById("pomodoro");
const navShortBreak = document.getElementById("shortBreak");
const navLongBreak = document.getElementById("longBreak");

navShortPomo.addEventListener("click", (event) => {
    select((event.target as Element).id);
});
navPomo.addEventListener("click", (event) => {
    select((event.target as Element).id);
});
navShortBreak.addEventListener("click", (event) => {
    select((event.target as Element).id);
});
navLongBreak.addEventListener("click", (event) => {
    select((event.target as Element).id);
});

let isRun: boolean = false; // Determines if clock should be running
let isWork: boolean = true; // Determines if time spent should be increasing
const timeSpent = new Time();
const countdown = new Time();

// test
isRun = true;
countdown.setCount(1 / 6);
