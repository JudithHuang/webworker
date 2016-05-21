var waitPrint = function (str, time) {
    setTimeout(function () {
        console.log(str);
    }, time);
};

waitPrint('A', 0);
console.log('B');
waitPrint('C', 2000);
waitPrint('D', 1000);
waitPrint('E', 3000);

// Event Loop: [B]
// timer: [A, C, D, E]