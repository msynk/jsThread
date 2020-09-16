var th = new Thread(processHeavyFunction);
th.addHandler(console.log.bind(console));
th.addListener(function (result) {
    console.log('result:', result);
});

function startSync(i, j) {
    console.log('start');
    console.log(processHeavyFunction(i, j));
    for (var i = 1; i <= 10; i++) {
        +function () {
            setTimeout(console.log.bind(console, 'this is a test' + i), 300 * i);
        }(i);
    }
    console.log('end');
}

function startAsync(i, j) {
    console.log('start');
    th.start(i, j);
    for (var i = 1; i <= 10; i++) {
        +function () {
            setTimeout(console.log.bind(console, 'this is a test' + i), 300 * i);
        }(i);
    }
    console.log('end');
}

function processHeavyFunction(i, j) {
    var i = i || 30000,
        j = j || 20000,
        result = 0;

    for (var x = 1; x <= i; x++) {
        for (var y = 1; y <= j; y++) {
            if (i % 2 === 0) {
                result += i * j - i * i;
            } else if (j % 2 === 0) {
                result += i * j - j * j;
            }
        }
    }
    return result;
}
