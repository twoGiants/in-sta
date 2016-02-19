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


function getDistinctYearsMonths() {
    db.instagram.aggregate([
        {
            $match: {
                'ig_user': { $exists: true }
            }
        },
        {
            $unwind: '$ig_user_statistics'
        },
        {
            $project: {
                'ig_user': 1,
                'year': {
                    $year: '$ig_user_statistics.date'
                },
                'month': {
                    $month: '$ig_user_statistics.date'
                }
            }
        },
        {
            $group: {
                '_id': {
                    'year': '$year',
                    'ig_user': '$ig_user'
                },
                'ig_user': {
                    $first: '$ig_user'
                },
                'year': {
                    $first: '$year'
                },
                'months': {
                    $addToSet: '$month'
                }
            }
        },
        {
            $group: {
                '_id': '$ig_user',
                'ig_user': {
                    $first: '$ig_user'
                },
                'years_months': {
                    $push: {
                        'year': '$year',
                        'months': '$months'
                    }
                }
            }
        }
    ], function (err, docs) {
        if (err) {
            error(err.message);
        } else {
            jlog(docs);
        }
    });
}

//query string must be: 'username-month-year'
function getDataForMonthAggregate(navItem) {
    var errorHappened = false;
    
    /*
        Cases:
            + navItem === string?
            + string consists of three parts?
            + is first part a a valid username? /^[a-zA-Z0-9_.]*$/
            + is the second part a month?
            + is third part a number and a valid year?
    */ 
    try {
        //Error case
        if (typeof navItem != 'string') {
            throw new Error('Query string must be a string, not -> ' + typeof navItem);
        }
        
        //Error case
        var navItemArr = navItem.split('-');
        if (navItemArr.length != 3) {
            throw new Error('Query string length must be 3, not -> ' + navItemArr.length);
        }
        
        //Error case
        if (!(/^[a-zA-Z0-9_.]+$/.test(navItemArr[0]))) {
            throw new Error('First query value must be a valid username -> ' + navItemArr[0]);
        }
        
        //Error case
        navItemArr[1] = parseInt(navItemArr[1]);
        if (isNaN(navItemArr[1])) {
            throw new Error('Second query value is not a number -> ' + navItemArr[1]);
        }
        
        //Error case
        if (navItemArr[1] < 1 || navItemArr[1] > 12){
            throw new Error('Second query value is not a month -> ' + navItemArr[1]);
        }
        
        //Error case
        if (!(/^[0-9]{4}/.test(navItemArr[2]))) {
            throw new Error('Third query value is not a 4 digit number -> ' + navItemArr[2]);
        }
    
        //Error case
        navItemArr[2] = parseInt(navItemArr[2]);
        var today = new Date();
        if (navItemArr[2] < 2010 || navItemArr[2] > today.getFullYear()) {
            throw new Error('Third query value is not a valid year -> ' + navItemArr[2]);
        }   
    } catch (err) {
        error(err.name + ': ' + err.message);
        errorHappened = true;
    }
    
    if(!errorHappened) {
        var start = new Date(navItemArr[2], navItemArr[1] - 1);
        var end = new Date(start);
        end.setMonth(end.getMonth() + 1);
        
        db.instagram.aggregate([
            {
                $match: {
                    'ig_user': navItemArr[0]
                }
            },
            {
                $unwind: '$ig_user_statistics'
            },
            {
                $match: {
                    'ig_user_statistics.date': { 
                        $gte: start,
                        $lt: end
                    }
                }
            },
            {
                $group: {
                    '_id': '$_id',
                    'ig_user': {
                        '$first': '$ig_user'
                    },
                    'ig_user_id': {
                        '$first': '$ig_user_id'
                    },
                    'ig_user_statistics': { 
                        '$push': {
                            'date': '$ig_user_statistics.date',
                            'followers': '$ig_user_statistics.followers',
                            'followings': '$ig_user_statistics.followings'
                        }
                    }
                }
            }
        ], function (err, docs) {
            if (err) {
                error(err.message);
            } else {
                jlog(docs);
            }
        });
    }
}

function test_getDataForMonthAggregate() {
    //Test cases
    // - navItem === string?
    getDataForMonthAggregate(1);
    getDataForMonthAggregate({ test: 1 });
    getDataForMonthAggregate(new Date());
    getDataForMonthAggregate(function () { var i = 'blub'; });
    getDataForMonthAggregate([1, 2, 3]);
    // - string consists of three parts?
    getDataForMonthAggregate('');
    getDataForMonthAggregate('asd-asd');
    getDataForMonthAggregate('asd-asd-asd-asd');
    getDataForMonthAggregate('asd-asd-asd');
    getDataForMonthAggregate('--');
    // - is first part a valid username?
    getDataForMonthAggregate('121a-asd-asd');
    getDataForMonthAggregate('-asd-asd');
    getDataForMonthAggregate(':-June-2011');
    // - is the second part a month?
    getDataForMonthAggregate('asd-12-asd');
    getDataForMonthAggregate('asd--asd');
    // - is third part a number and a valid year?
    getDataForMonthAggregate('asd-2-2s15');
    getDataForMonthAggregate('asd-asd-9');
    getDataForMonthAggregate('asd-1-2010');
    // - random
    getDataForMonthAggregate('zarputin-2014-December');
    getDataForMonthAggregate('zarputin-3-2009');
    getDataForMonthAggregate('zarputin-03-2009');
    getDataForMonthAggregate('sdsa.aee');
    getDataForMonthAggregate(1);
    getDataForMonthAggregate(new Date());
    getDataForMonthAggregate('12.2009');
    getDataForMonthAggregate('2009.December');
    getDataForMonthAggregate('zarputin-12-2014');
    getDataForMonthAggregate('zarputin-1-2014');
}

function main() {
    setTimeout(function(){
        deleteDoc('obamasan');
    }, 500);
    
    setTimeout(function(){
        deleteDoc('zarputin');
    }, 1000);
    
    setTimeout(function(){
        createDoc('obamasan', 5);
    }, 1500);

    setTimeout(function(){
        createDoc('zarputin', 30);
    }, 2000);
    
    setTimeout(function(){
        createDoc('stazzmatazz', 1);
    }, 2500);
}

function deleteDoc(username) {
    db.instagram.remove({ 'ig_user' : username}, function (err, doc) {
        if (err) {
            error(err.message);
        }
        log(JSON.stringify(doc, null, '\t'));
    });
}

function deleteDocByObjectId(objectId) {
    db.instagram.remove({
        '_id': mongojs.ObjectId(objectId)
    }, function (err, doc) {
        if (err) {
            error(err.message);
        }
        log(JSON.stringify(doc, null, '\t'));
    });
}

// creates documents with the date object, instead of a timestamp string
function createDoc(username, n) {
    var igUserId = new Date();
    var startDate = new Date(2014, 11, 15, 13, 45, 26);
    var newDoc = {
        'ig_user': username,
        'ig_user_id': igUserId.getTime().toString(),
        'ig_user_statistics': []
    };
    
    for (var i = 0; i < n; i++) {
        var newDate = startDate.setDate(startDate.getDate() + 1);
        newDoc.ig_user_statistics.push({
            'date': new Date(newDate),
            'followers': (i + 1) * 10,
            'followings': i + 10
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

function jlog(docs) {
    log(JSON.stringify(docs, 'null', '\t'));
}



