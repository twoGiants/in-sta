"use strict";

// set up ======================================================================
// DEBUG
var debug = require("debug");
var log   = debug("server:log");
var info  = debug("server:info");
var error = debug("server:error");

// DB
var dbTools = require("./db-tools");

// OTHER
var async   = require("async");
var cheerio = require("cheerio");
var request = require("request");
var t       = require("./tools");
var instAPI = require("./instagram-api");

// api =========================================================================
module.exports.gogogo = function (conf) {
    var iterations = 1;

    // LOOP: grab data from source
    async.forever(function (outerCb) {
        var count = 0;
        log('Loop running the ' + iterations++ + ' time.');
        log('Delay: ' + t.delayInMs(conf.desiredTime) + 'ms.');

        setTimeout(function () {
            log('Getting data for:');
            t.jlog(conf.usernames);

            async.whilst(
                function () {
                    return count < conf.usernames.length;
                },
                function (innerCb) {
                    setTimeout(function () {
                         instAPI
                          .getAccountData(conf.usernames[count++])
                          .then(function (result) {
                              dbTools.updateData(result);
                              innerCb();
                          })
                          .catch(function (err) {
                              innerCb(err);
                          });
                    }, 2000);
                },
                function (err) {
                    if (err) {
                        error('Request failed, status code: ' + err);
                    }
                    count = 0;
                    outerCb();
                }
            );
        }, t.delayInMs(conf.desiredTime)); // 5000 t.delayInMs(conf.desiredTime)
    }, function (err) {
        // error handling
        error(err.message);
    });
};

// internal functions ==========================================================
function getRemoteData(source, username, selector, callback) {
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

                    dbTools.saveData(newData);
                    callback();
                } else {
                    callback(res.statusCode);
                }
            }
        }
    );
}