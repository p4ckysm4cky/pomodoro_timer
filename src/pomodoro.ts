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

function runCount(isWork: boolean, callback?) {
    /**
     * Updates the countdown to decrement every second
     * isWork when True increments timeSpent
     */
    const oneSecTimer = setInterval(() => {
        if (isRun) {
            countdown.seconds--;
            console.log(countdown.formated());
            if (isWork) timeSpent.seconds++;
            if (countdown.seconds === 0) {
                if (callback) callback();
                clearInterval(oneSecTimer);
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
runCount(true);
