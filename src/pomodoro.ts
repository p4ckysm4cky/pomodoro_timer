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

// Normal Functions
function presetCount(minutes: number) {
    countdown.seconds = minutes * 60;
}

function playAlarm() {
    const audio = new Audio("../audio/alarm.flac");
    console.log(audio.volume)
    audio.play()
}

function runCount(isWork: boolean, callback?) {
    /**
     * Updates the countdown to decrement every second
     * isWork when True increments timeSpent
     */
    let intervalTimer = setInterval(() => {
        if (isRun && countdown.seconds !== 0) {
            countdown.seconds--;
            console.log(countdown.formated());
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
let isRun: boolean = false;
const timeSpent = new Time();
const countdown = new Time();
// test
isRun = true;
presetCount(1 / 6);
// runCount(() => console.log("finished"));
