require('use-strict');

// DEBUG -----------------------------
var debug = require("debug");
var log = debug("main:log");
var info = debug("main:info");
var error = debug("main:error");
//------------------------------------

var async = require("async");
var cheerio = require("cheerio");
var fs = require("fs");
var request = require("request");

// todo save incoming data in mongoDB: check if the documents exists, if(true) save the data in the existing document, else create a new entry in the document and save data
// todo problem: setIntervall doesn't wait until getRemoteDataWhilst finishes, it waits until the timer finishes and executes it again, creating parallel running functions SOLUTION in the note
// note better: use the server responses to react accordingly
// note consider using async.forever with a setTimer inside, instead of setInterval
// todo use the userIDs instead of usernames
// note first time run, get the data at [hh, mm] and starting from the second time in 24h delays
// note s: last update on 4 dec  4:33; cc: 4:27


//main();

function main() {
    var settings = {
        desiredTime: [4, 30],
        usernames: ['instagram', 'taylorswift', 'selenagomez', 'kimkardashian'],
        //usernames: ['modelsdot', 'lovingmalemodels', 'levistocke', 'clickmodelny'],
        source: "http://iconosquare.com/",
        path: "../app/statistics/",
        selector: [
            'a[class="followers user-action-btn"] span[class=chiffre]',
            'a[class="followings user-action-btn"] span[class=chiffre]'
        ]
    };

    startInterval(settings);
}

function startInterval(settings) {
    var timeoutDelay = 1000; // delayInMs(desiredTime);
    var intervalDelayDebug = 10000; // 86400000 => 24h in ms

    getRemoteDataWhilst(settings.source, settings.usernames, settings.selector, settings.path);

    setTimeout(function () {
        //        getRemoteDataWhilst(settings.source, settings.usernames, settings.selector, settings.path);
        setInterval(function () {
            //            getRemoteDataWhilst(settings.source, settings.usernames, settings.selector, settings.path);
        }, intervalDelayDebug);
    }, timeoutDelay);
}

// getRemoteDataWhilst sends a new request only after 5 seconds past the previous one 
function getRemoteDataWhilst(source, usernames, selector, path) {
    var count = 0;

    async.whilst(
        function () {
            return count < usernames.length;
        },
        function (callback) {
            var username = usernames[count];
            var userUrl = source + username;
            info(usernames[count]);

            request({
                    uri: userUrl
                },
                //---------------------
                function (err, response, body) {
                    //                    if (!err && response.statusCode === 200) {
                    //                        // magic
                    //                    } else {
                    //                        // something went wrong
                    //                        error(err.message);
                    //                        info("Server response: " + response.statusCode);
                    //                    }

                    if (err) {
                        error(err.message);
                    } else {
                        try {
                            var $ = cheerio.load(body);
                            var timestamp = new Date();
                            var newData = {
                                timestamp: timestamp.getTime().toString(),
                                followers: $(selector[0]).html().toString(),
                                followings: $(selector[1]).html().toString()
                            };

                            // log to console
                            info(userUrl);
                            info(newData);

                            // save data
                            saveData(newData, path + username + ".json");
                        } catch (e) {
                            error(e.message);
                            info("Check the username, it may have changed -> " + userUrl);
                        }
                    }
                    setTimeout(function () {
                        callback(null, count++);
                    }, 5000);
                }

                //-------------------
            );
        },
        function (err) {
            if (err) {
                error(err.message);
            } else {
                info('Done.');
            }
        }
    );
}

// expects object in JSON and a path
// if path doesn't exist, saves newData to a new file in this path
// else saves newData into existing file
function saveData(newData, path) {
    fs.readFile(path, function (errorRead, data) {
        var tempData = {};

        if (errorRead) {
            error(errorRead.message + ", saving to a new file."); // path doesn't exist

            // save newData to a new file
            tempData.statistics = [];
            saveNewData(newData, tempData, path);
        } else {
            try {
                // parse data from read file
                tempData = JSON.parse(data);

                // append newData to existing data
                saveNewData(newData, tempData, path);
            } catch (errorParse) {
                // Parse error
                error(errorParse.message);

                // Save newData to a new file, keep the old file for investigation 
                newPath = path.replace(".json", "_" + newData.timestamp + ".json");
                tempData = {
                    statistics: []
                };
                saveNewData(newData, tempData, newPath);

                info("Parse error. Check data in '" + path + "'. Saving new data to '" + newPath);
            }
        }

        function saveNewData(newData, tempData, path) {
            // magic
            tempData.statistics.push(newData);

            fs.writeFile(path, JSON.stringify(tempData), function (errorWrite) {
                if (errorWrite) {
                    error(errorWrite.message);
                } else {
                    info("Saved to " + path);
                }
            });
        }
    });
}

// expects an array desiredTime = [hh, mm]
// returns the delay neccessary in ms till the desiredTime
// Formula: 
// x: current time in ms
// y: desired time in ms
// x >= y: (24 - x) + y
// x <  y: y - x
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