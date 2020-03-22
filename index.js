(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['exports'], factory);
    } else if (typeof exports === 'object' && typeof exports.nodeName !== 'string') {
        // CommonJS
        factory(exports);
    } else {
        // Browser globals
        factory((root.nightmare = {}));
    }
}(typeof self !== 'undefined' ? self : this, function (exports) {
    var _console = Object.assign({}, console);
    var mute = {
        start: function() {
            for (var func in console) {
                console[func] = function(){};
            }
        },
        end: function() {
            for (var func in console) {
                console[func] = _console[func];
            }
        }
    };

    var _setTimeout = setTimeout;
    var timeout = {
        start: function() {
            if (setTimeout) {
                setTimeout = function(callback) {_setTimeout(callback, 0)}
            }
        },
        end: function() {
            setTimeout = _setTimeout;
        }
    };

    var _Math = Math;
    var fakeMath = {
        start: function() {
            Math = { };
            var names = Object.getOwnPropertyNames(_Math);
            for (var i = 0; i < names.length; i ++) {
                var name = names[i];
                Math[name] = _Math[name];
            }

            Math.PI = 4;
            Math.cos = _Math.sin;
            Math.sin = _Math.cos;
            Math.LOG2 = _Math.LOG10E;
            Math.ceil = _Math.floor;
            Math.floor = _Math.ceil;
            Math.random = function() { return 1; };
        },
        end: function() {
            Math = _Math;
        }
    }

    var allTricks = [mute, timeout, fakeMath];
    exports.start = function() {
        allTricks[_Math.floor(_Math.random() * allTricks.length)].start();
    };
    exports.end = function() {
        for (var i = 0; i < allTricks.length; i ++) {
            allTricks[i].end();
        }
    };
}));