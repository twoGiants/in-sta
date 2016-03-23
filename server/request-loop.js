"use strict";
require("use-strict");

// DEBUG
var debug = require("debug");
var log   = debug("server:log");
var info  = debug("server:info");
var error = debug("server:error");
// DB
var mongojs = require("mongojs");
// OTHER
var async   = require("async");
var cheerio = require("cheerio");
var request = require("request");
var t       = require("./tools");
var dbTools = require("./db-tools");

module.exports.gogogo = function (settingsObj, db) {
    var iterations = 1;

    // LOOP: grab data from source
    async.forever(function (next) {
        log('Loop running the ' + iterations++ + ' time.');
        log('Delay: ' + t.delayInMs(settingsObj.desiredTime) + 'ms.');
        setTimeout(function() {
            log('...grabbing data.');
            getRemoteData(settingsObj.source, settingsObj.usernames[0], settingsObj.selector, next, db);
        }, t.delayInMs(settingsObj.desiredTime)); // 5000 t.delayInMs(settingsObj.desiredTime)
    }, function (err) {
        // error handling
        error(err.message);
    });
};

// get data from source, save data to DB
function getRemoteData(source, username, selector, callback, db) {
    var userUrl = source + username;
    // send request
    request(userUrl, {
            timeout: 10000
        },
        function (err, res, body) {
            if (err) {
                error(err.message);
            } else {
                if (res.statusCode === 200) {
                    var $ = cheerio.load(body);
                    var timestamp = new Date();
                    var newData = {
                        date: new Date(),
                        followers: parseInt($(selector[0]).html()),
                        followings: parseInt($(selector[1]).html())
                    };

                    // print data to console
                    log('Source: ' + userUrl);
                    t.jlog(newData);

                    // save data
                    dbTools.saveData(newData, username, db);
                } else {
                    error(res.statusCode);
                }
            }
            // continue the loop
            callback();
        }
    );
}