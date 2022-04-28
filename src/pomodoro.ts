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
    audio.play();
}

function runCount(callback?) {
    /**
     * Updates the countdown to decrement every second
     * isWork when True increments timeSpent
     */
    const startTime = Date.now();
    const startSeconds = countdown.seconds;
    const startSpent = timeSpent.seconds;
    let timeWorker = new Worker("./build/worker.js");
    timeWorker.postMessage(" ");
    timeWorker.onmessage = () => {
        if (isRun && countdown.seconds > 0) {
            // This strat is used, so we can accurately calculate time
            countdown.seconds = Math.round(
                startSeconds - (Date.now() - startTime) / 1000
            );
            clockP.innerHTML = displayCount();
            if (isWork) {
                timeSpent.seconds = Math.round(
                    (timeSpent.seconds =
                        startSpent + (Date.now() - startTime) / 1000)
                );
                updateTimeSpent();
                timeSpentSpan.innerHTML = displaySpent();
            }
            // This basically only runs on the transition from 1 -> 0
            if (countdown.seconds === 0) {
                console.log("Exited on 0");
                if (callback) callback();
                isRun = false;
                select(currentSelection);
                timeWorker.terminate();
                return;
            }
            // Worse case scenario the thread is inactive, and our timer goes to negative
        } else if (countdown.seconds <= 0) {
            console.log("Exited on -number");
            if (callback) callback();
            isRun = false;
            select(currentSelection);
            timeWorker.terminate();
            return;
        } else {
            // Clear the timer when paused
            timeWorker.terminate();
            return;
        }
    };
}

function displaySpent(): string {
    /**
     * Returns a properly formated string to match the
     * seconds of the timeSpent object
     */
    const clockObject = timeSpent.formated();
    let hours = clockObject.hours.toString().padStart(2, "0");
    let minutes = clockObject.minutes.toString().padStart(2, "0");
    let seconds = clockObject.seconds.toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
}

function displayCount(): string {
    /**
     * Returns a properly formated string to match the
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
    let do_switch: boolean = true;
    if (isRun) {
        let confirmation: boolean = confirm(
            "Switching will cause your timer to stop.\nAre you sure you want to change timer?"
        );
        if (!confirmation) do_switch = false;
    }

    if (do_switch) {
        isRun = false;
        startBtn.innerText = "Start";
        switch (id) {
            case "shortPomodoro":
                currentSelection = id;
                document.documentElement.className = "theme-pomodoro";
                isWork = true;
                countdown.setCount(25);
                clockP.innerHTML = displayCount();
                break;
            case "pomodoro":
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
                countdown.setCount(15);
                clockP.innerHTML = displayCount();
                break;
            case "longBreak":
                currentSelection = id;
                document.documentElement.className = "theme-break";
                isWork = false;
                countdown.setCount(30);
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
    let stringifySeconds = JSON.stringify(timeSpent.seconds);
    localStorage.setItem("timeSpent", stringifySeconds);
}

function loadTimeSpent() {
    /**
     * If timeSpent is stored in localStorage
     * it is added updated back as the value
     */
    if (localStorage.timeSpent) {
        const timeSpentSeconds = JSON.parse(localStorage.timeSpent);
        timeSpent.seconds = timeSpentSeconds;
    }
}
// Main
const clockP = document.getElementById("clock");
const startBtn = document.getElementById("start");
const resetBtn = document.getElementById("reset");

const navShortPomo = document.getElementById("shortPomodoro");
const navPomo = document.getElementById("pomodoro");
const navShortBreak = document.getElementById("shortBreak");
const navLongBreak = document.getElementById("longBreak");

const timeSpentP = document.getElementById("timeSpent");
const timeSpentSpan = document.getElementById("timeSpentValue");

startBtn.addEventListener("click", () => {
    if (startBtn.innerText.toLowerCase() === "start") {
        isRun = true;
        startBtn.innerText = "Stop";
        runCount(playAlarm);
    } else {
        isRun = false;
        startBtn.innerText = "Start";
    }
});

resetBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to reset?")) {
        isRun = false;
        select(currentSelection);
    }
});

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

timeSpentP.addEventListener("click", () => {
    /**
     * Resets the time spent on click
     */
    if (timeSpent.seconds === 0) {
        return;
    } else {
        let confirmation: boolean = confirm("Do you want to reset time spent?");
        if (confirmation) {
            timeSpent.seconds = 0;
            timeSpentSpan.innerHTML = displaySpent()
            updateTimeSpent()
        }
    }
});

let isRun: boolean = false; // Determines if clock should be running
let isWork: boolean = true; // Determines if time spent should be increasing
let currentSelection: string; // Stores the ID of the clock that is currently selected
const timeSpent = new Time();
const countdown = new Time();
loadTimeSpent(); // load timeSpent from localstorage
timeSpentSpan.innerHTML = displaySpent(); // Displays timeSpent to DOM
const audio = new Audio("./audio/alarm.flac");

select("shortPomodoro");
