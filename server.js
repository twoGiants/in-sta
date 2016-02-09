/*jslint node: true */
/*
 READ THIS IF YOU HAVEN'T SEEN THIS CODE IN A WHILE
 - the webserver stuff starts from the "// SERVER" comment
 - the loop where the data is fetched from iconosquare is called after the "// OTHER" comment
   > just comment loop(); to stop fetching data, the frontend will work
 - the DB function are after the "// DB" comment
*/

require("use-strict");

// OPENSHIFT-SERVER-DB-CONFIG -------------------------------------
var ipaddress = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var connection_string = '127.0.0.1:27017/nodejs';
process.env.TZ = 'Europe/Berlin';

if (process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
    connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ':' +
        process.env.OPENSHIFT_MONGODB_DB_PASSWORD + '@' +
        process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
        process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
        process.env.OPENSHIFT_APP_NAME;
}

// DEBUG -----------------------------
var debug = require("debug");
var log = debug("server:log");
var info = debug("server:info");
var error = debug("server:error");

// SERVER ----------------------------
var express = require("express");

// DB --------------------------------
var mongojs = require("mongojs");
var bodyParser = require("body-parser");

// OTHER -----------------------------
var async = require("async");
var cheerio = require("cheerio");
var request = require("request");

var app = express();
var db = mongojs(connection_string, ['instagram']);

app.use(express.static(__dirname + '/app'));
app.use(bodyParser.json());

// start server
app.listen(port, ipaddress, function () {
    log('Server running on http://' + ipaddress + ':' + port);
});

// get all data from DB, send back to FE
app.get("/statistics", function (err, res) {
    log("I received a GET request from tableCtrl.");

    db.instagram.find(function (err, docs) {
        res.json(docs);
    });
});

app.get('/test', function (err, res) {
    log('I received a GET erquest from /test.');
});

// DB -------------------------------------------------------------
// update !existing! user, works only with existing users
function saveData(newData, username) {
    db.instagram.findAndModify({
        query: {
            ig_user: username
        },
        update: {
            $push: {
                ig_user_statistics: {
                    "timestamp": newData.timestamp,
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
            log('Saved data to DB.\n\n');
        }
    });
}

// deletes one entry every second
function deleteTestData() {
//    {"ig_user": "instagram","ig_user_id": "25025320","ig_user_statistics": [{"followers": "120319556","followings": "354","timestamp": "1449584660080"},{"followers": "120319589","followings": "353","timestamp": "1449584660238"}]}
    var count = 1;
    var intervalId = setInterval(function () {
        if (count-- <= 0) clearInterval(intervalId);
        
        db.instagram.findAndModify({
            query: {
                ig_user: 'stazzmatazz'
            },
            update: {
                $pop: {
                    ig_user_statistics: 1
                }
            },
            new: true
        }, function (err, doc) {
            if (err) error(err.message);
            log(JSON.stringify(doc, null, '\t'));
        });
    }, 1000);
}

// inserts a new document into the collectin for "stazzmatazz"
function insertData() {
    var document = {
        "ig_user": "stazzmatazz",
        "ig_user_id": "739298907",
        "ig_user_statistics": [
            {
                "followers": "31167",
                "followings": "4336",
                "timestamp": "1452624753720"
            }
        ]
    };
    
    db.instagram.insert(document, function (err, doc) {
        if (err) error(err.message);
        log(JSON.stringify(doc, null, '\t'));
    });
}

// OTHER ----------------------------------------------------------
// get data from iconosquare
loop();
function loop() {
    var settings = {
        desiredTime: [04, 05],
        usernames: ['stazzmatazz', 'instagram', 'taylorswift', 'selenagomez', 'kimkardashian'],
        source: "http://iconosquare.com/",
        selector: [
            'a[class="followers user-action-btn"] span[class=chiffre]',
            'a[class="followings user-action-btn"] span[class=chiffre]'
        ]
    };

    // LOOP: grab data from source
    async.forever(function (next) {
        log('I am in async.forever(). Waiting ' + delayInMs(settings.desiredTime) + 'ms.');
        setTimeout(function() {
            log('Timeout over. Calling getRemoteData().');
            getRemoteData(settings.source, settings.usernames[0], settings.selector, next);
        }, delayInMs(settings.desiredTime)); // 5000 delayInMs(settings.desiredTime)
    }, function (err) {
        // error handling
        error(err.message);
    });
}


// get data from source, save data to DB
function getRemoteData(source, username, selector, callback) {
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
                        timestamp: timestamp.getTime().toString(),
                        followers: $(selector[0]).html().toString(),
                        followings: $(selector[1]).html().toString()
                    };

                    // print data to console
                    log(userUrl);
                    log(JSON.stringify(newData, null, '\t'));

                    // save data
                    saveData(newData, username);
                } else {
                    error(res.statusCode);
                }
            }
            // continue the loop
            callback();
        }
    );
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














// Example code ---------------------------------------------------
var db_test = mongojs("contactlist", ["contactlist"]);
app.get("/statistics_", function (req, res) {
    log("I received a GET request");

    db_test.contactlist.find(function (err, docs) {
        //        log(docs);
        res.json(docs);
    });
});

app.post("/contactlist", function (req, res) {
    log(req.body);
    db_test.contactlist.insert(req.body, function (err, doc) {
        res.json(doc);
    });
});

app.delete("/contactlist/:id", function (req, res) {
    var id = req.params.id;
    console.log(id);
    db_test.contactlist.remove({
        _id: mongojs.ObjectId(id)
    }, function (err, doc) {
        res.json(doc);
    })
});

app.get("/contactlist/:id", function (req, res) {
    var id = req.params.id;
    console.log(id);

    db_test.contactlist.findOne({
        _id: mongojs.ObjectId(id)
    }, function (err, doc) {
        res.json(doc);
    });
});

app.put('/contactlist/:id', function (req, res) {
    var id = req.params.id;
    log(req.body.name);
    db_test.contactlist.findAndModify({
        query: {
            _id: mongojs.ObjectId(id)
        },
        update: {
            $set: {
                name: req.body.name,
                email: req.body.email,
                number: req.body.number
            }
        },
        new: true
    }, function (err, doc) {
        res.json(doc);

    });
});