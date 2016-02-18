require("use-strict");
// DEBUG
var debug = require("debug");
var log   = debug("server:log");
var info  = debug("server:info");
var error = debug("server:error");
// DB
var mongojs = require("mongojs");
// OTHER
var async = require("async");
var cheerio = require("cheerio");
var request = require("request");

module.exports.gogogo = function (settingsObj, db) {
    var iterations = 1;

    // LOOP: grab data from source
    async.forever(function (next) {
        log('Loop running the ' + iterations++ + ' time.');
        log('Delay: ' + delayInMs(settingsObj.desiredTime) + 'ms.');
        setTimeout(function() {
            log('...grabbing data.');
            getRemoteData(settingsObj.source, settingsObj.usernames[0], settingsObj.selector, next, db);
        }, delayInMs(settingsObj.desiredTime)); // 5000 delayInMs(settingsObj.desiredTime)
    }, function (err) {
        // error handling
        error(err.message);
    });
}

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
                    jlog(newData);

                    // save data
                    saveData(newData, username, db);
                } else {
                    error(res.statusCode);
                }
            }
            // continue the loop
            callback();
        }
    );
}

function saveData(newData, username, db) {
    db.instagram.findAndModify({
        query: {
            ig_user: username
        },
        update: {
            $push: {
                ig_user_statistics: {
                    "date": newData.date,
                    "followers": newData.followers,
                    "followings": newData.followings
                }
            }
        },
        new: true
    }, function (err, doc) {
        if (err) {
            error(err.message);
        } else {
            log('...data saved.\n\n');
        }
    });
}

/*
 expects an array desiredTime = [hh, mm]
 returns the delay neccessary in ms till the desiredTime
 Formula: 
 x: current time in ms
 y: desired time in ms
 x >= y: (24 - x) + y
 x <  y: y - x
 */
function delayInMs(desiredTime) {
    var currentTime = new Date();
    var x = (currentTime.getHours() * 60 + currentTime.getMinutes()) * 60 * 1000;
    var y = (desiredTime[0] * 60 + desiredTime[1]) * 60 * 1000;

    if (x >= y) {
        return (86400000 - x) + y;
    } else {
        return y - x;
    }
}

function delayInMsDEBUG(desiredTime, currentTime) {
    var x = (currentTime[0] * 60 + currentTime[1]) * 60 * 1000;
    var y = (desiredTime[0] * 60 + desiredTime[1]) * 60 * 1000;

    if (x >= y) {
        return (86400000 - x) + y;
    } else {
        return y - x;
    }
}

function jlog(docs) {
    log(JSON.stringify(docs, 'null', '\t'));
}