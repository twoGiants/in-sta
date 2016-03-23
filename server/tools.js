"use strict";

// DEBUG
var debug = require("debug");
var log   = debug("server:log");
var info  = debug("server:info");
var error = debug("server:error");

module.exports = {
    /*
     expects an array desiredTime = [hh, mm]
     returns the delay neccessary in ms till the desiredTime
     Formula: 
     x: current time in ms
     y: desired time in ms
     x >= y: (24 - x) + y
     x <  y: y - x
     */
    delayInMs: function (desiredTime) {
        var currentTime = new Date();
        var x = (currentTime.getHours() * 60 + currentTime.getMinutes()) * 60 * 1000;
        var y = (desiredTime[0] * 60 + desiredTime[1]) * 60 * 1000;

        if (x >= y) {
            return (86400000 - x) + y;
        } else {
            return y - x;
        }
    },

    delayInMsDEBUG: function (desiredTime, currentTime) {
        var x = (currentTime[0] * 60 + currentTime[1]) * 60 * 1000;
        var y = (desiredTime[0] * 60 + desiredTime[1]) * 60 * 1000;

        if (x >= y) {
            return (86400000 - x) + y;
        } else {
            return y - x;
        }
    },
    
    jlog: function jlog(docs) {
        log(JSON.stringify(docs, 'null', '\t'));
    }
};