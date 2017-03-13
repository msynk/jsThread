var Thread = function () {

    function Thread(func) {
        var body = extractBody(workerCode),
            url = createUrl(body),
            me = this;

        me.worker = new Worker(url);
        me.function = func;
        me.listeners = [];
        me.handlers = [];

        me.worker.onerror = function (err) {
            me.handlers.forEach(function (handler) {
                handler.call(null, err);
            });
        }

        me.worker.onmessage = function (e) {
            me.listeners.forEach(function (listener) {
                listener.call(null, e.data);
            });
        }
    }

    Thread.prototype.addHandler = function (handler) {
        this.handlers.push(handler);
    }
    Thread.prototype.addListener = function (listener) {
        this.listeners.push(listener);
    }

    Thread.prototype.start = function () {
        var args = [].slice.call(arguments, 0),
            runner = 'function __runner() { return ' + this.function.toString() + '; }',
            url = createUrl(runner),
            data = JSON.stringify({ url: url, args: args });

        this.worker.postMessage(data);
    }

    // --------------------------------------------------------------------------------------

    function workerCode() {
        onmessage = function (e) {
            var data = JSON.parse(e.data);
            importScripts(data.url);
            var result = __runner().apply(null, data.args);
            postMessage(result);
        }
    }

    function extractBody(func) {
        //return func.toString().match(/^\s*function\s*\(\s*\)\s*\{(([\s\S](?!\}$))*[\s\S])/)[1];
        var string = func.toString();
        return string.substring(string.indexOf("{") + 1, string.lastIndexOf("}")).trim();
    }

    function createUrl(script) {
        var blob = new Blob([script], { type: 'text/javascript' });
        return window.URL.createObjectURL(blob);
    }

    return Thread;
}();