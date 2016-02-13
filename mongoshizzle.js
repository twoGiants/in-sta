require("use-strict");

// OPENSHIFT-SERVER-DB-CONFIG -------------------------------------
var ipaddress = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var connection_string = '127.0.0.1:27017/nodejs';

if (process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
    connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ':' +
        process.env.OPENSHIFT_MONGODB_DB_PASSWORD + '@' +
        process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
        process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
        process.env.OPENSHIFT_APP_NAME;
}

var debug = require("debug");
var log = debug("server:log");
var info = debug("server:info");
var error = debug("server:error");

var mongojs = require("mongojs");
var bodyParser = require("body-parser");

var db = mongojs(connection_string, ['instagram']);

//deleteDoc('dummy');
//deleteDoc('stazzmatazz');
function deleteDoc(username) {
    db.instagram.remove({ 'ig_user' : username}, function (err, doc) {
        if (err) {
            error(err.message);
        }
        log(JSON.stringify(doc, null, '\t'));
    });
}

createDoc('dummy', 30);
//createDoc('stazzmatazz', 7);
// n > 0 !
function createDoc(username, n) {
    var igUserId = new Date();
    var newDoc = {
        "ig_user": username,
        "ig_user_id": igUserId.getTime().toString(),
        "ig_user_statistics": []
    };
    
    for (var i = 0; i < n; i++) {
        newDoc.ig_user_statistics.push({
            "followers": (i + 1) * 10,
            "followings": i + 10,
            "timestamp": String(1452624753720 - (86400000 * (n - i)))
        });
    }
    
    db.instagram.insert(newDoc, function (err, doc) {
        if (err) {
            error(err.message);
        }
        log(JSON.stringify(doc, null, '\t'));
    });
}

// n > 0 !
//pushNdummyEntries(30);
function pushNdummyEntries(n) {
    var dummyDoc = {
        "ig_user": 'dummy',
        "ig_user_id": "111222333",
        "ig_user_statistics": []
    };

    for (var i = 0; i < n; i++) {
        dummyDoc.ig_user_statistics.push({
            "followers": (i + 1) * 10,
            "followings": i + 10,
            "timestamp": String(1452624753720 - (86400000 * (n - i)))
        });
    }

    db.instagram.insert(dummyDoc, function (err, doc) {
        if (err) {
            error(err.message);
        }
        log(JSON.stringify(doc, null, '\t'));
    });
}

// SERVER 5698ac26e96b1cb1bd43027d
function removeSpecificElementsFromArray(index) {
    var myKey = 'ig_user_statistics.' + index;
    var myObj = {};
    myObj[myKey] = 1;
    log(myObj);
    db.instagram.update({
            _id: mongojs.ObjectId('5698a70eaf3d30b021b81eb5') // SERVER 5698ac26e96b1cb1bd43027d
        }, {
            $unset: myObj
        },
        function (err, doc) {
            if (err) {
                error(err.message);
            } else {
                log('$unset');
                db.instagram.update({
                        _id: mongojs.ObjectId('5698a70eaf3d30b021b81eb5')
                    }, {
                        $pull: {
                            'ig_user_statistics': null
                        }
                    },
                    function (err, doc) {
                        if (err) {
                            error(err.message);
                        } else {
                            log('$pull');
                        }
                        //                        db.close();
                    });
            }
        });
}

function popLastElementFromArray() {
    db.instagram.update({
            _id: mongojs.ObjectId('5698a70eaf3d30b021b81eb5')
        }, {
            $pop: {
                'ig_user_statistics': 1
            }
        },
        function (err, doc) {
            if (err) {
                error(err.message);
            } else {
                log('$pop last element from the "ig_user_statistics" array.');
            }
            db.close();
        });
}

