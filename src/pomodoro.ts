// Time Class
function Time(seconds: number = 0) {
    this.seconds = seconds;
}

Time.prototype.formated = function () {
    const original_seconds = this.seconds;
    let return_time = {
        hours: Math.floor(original_seconds / 3600),
        minutes: Math.floor(original_seconds / 60) % 60,
        seconds: Math.round(original_seconds % 60),
    };
    return return_time;
};

// Test
let test = new Time();
let test1 = new Time(1);
let test2 = new Time(599);
let test3 = new Time(600);
let test4 = new Time(3600);
let test5 = new Time(360009);
let test6 = new Time(0.2);
