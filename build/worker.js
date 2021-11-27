var myObj = this; // strat to ignore typescript
onmessage = function (e) {
    setInterval(function () {
        myObj.postMessage(' ');
    }, 1000);
};
//# sourceMappingURL=worker.js.map