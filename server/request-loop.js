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

module.exports.gogogo = function (conf, db) {
    var iterations = 1;

    // LOOP: grab data from source
    async.forever(function (outerCb) {
        var count = 0;
        log('Loop running the ' + iterations++ + ' time.');
        log('Delay: ' + t.delayInMs(conf.desiredTime) + 'ms.');

        setTimeout(function () {
            log('...grabbing data for ' + conf.usernames.length + ' users.');

            async.whilst(
                function () {
                    return count < conf.usernames.length;
                },
                function (innerCb) {
                    setTimeout(function () {
                        getRemoteData(conf.source, conf.usernames[count++], conf.selector, innerCb, db);
                    }, 2000);
                },
                function (err) {
                    if (err) {
                        error(err);
                    }
                    count = 0;
                    outerCb();
                }
            );
            //            getRemoteData(conf.source, conf.usernames[0], conf.selector, next, db);

        }, t.delayInMs(conf.desiredTime)); // 5000 t.delayInMs(conf.desiredTime)
    }, function (err) {
        // error handling
        error(err.message);
    });
};

function getRemoteData(source, username, selector, callback, db) {
    var userUrl = source + username;
    request(userUrl, {
            timeout: 10000
        },
        function (err, res, body) {
            if (err) {
                error(err.message);
                callback(err);
            } else {
                if (res.statusCode === 200) {
                    var $ = cheerio.load(body);
                    var timestamp = new Date();
                    var newData = {
                        igUser: username,
                        igUserId: $(selector[2]).attr('class').match(/\d/g).join(""),
                        date: new Date(),
                        followers: parseInt($(selector[0]).html()),
                        followings: parseInt($(selector[1]).html())
                    };

                    dbTools.saveDataNew(newData, db);
                    callback();
                } else {
                    callback(res.statusCode);
                }
            }
        }
    );
}