// DEBUG -----------------------------
var debug = require("debug");
var log = debug("server:log");
var info = debug("server:info");
var error = debug("server:error");
//------------------------------------

var MongoClient = require("mongodb").MongoClient;
var assert = require("assert");
var ObjectId = require("mongodb").ObjectID;
var url = "mongodb://localhost:27017/instagram";


// Insert a document
var insertDocument = function (db, callback) {
    db.collection("statistics").insertOne({
        "ig_user": "selenagomez",
        "ig_user_id": "460563723",
        "ig_user_statistics": [
            {
                "timestamp": "1449584660039",
                "followers": "54647290",
                "followings": "196"
            },
            {
                "timestamp": "1449651568746",
                "followers": "54808947",
                "followings": "197"
            },
            {
                "timestamp": "1449739118331",
                "followers": "55050785",
                "followings": "198"
            }
        ]
    }, function (err, result) {
        assert.equal(err, null);
        log("Inserted a document into the instagram collection.");
        callback(result);
    });
};

// Remove all documents that match a condition
var removeDocuments = function (db, callback) {
    db.collection("statistics").deleteMany({
        "ig_user": "selenagomez"
    }, function (err, results) {
        log(results);
        log("Removed all documents that matched a condition.");
        callback();
    });
};

// Remove one document  
var removeDocument = function (db, callback) {
    db.collection('statistics').deleteOne({
        "ig_user": "selenagomez"
    }, {
        justOne: true
    }, function (err, results) {
        log(results);
        callback();
    });
};

// Connect to DB
MongoClient.connect(url, function (err, db) {
    assert.equal(null, err);
    log("Connected correctly to server.");

    //    removeDocuments(db, function () {
    //        db.close();
    //    });

    //    insertDocument(db, function () {
    //        db.close();
    //    });
    removeDocument(db, function () {
        db.close();
    });

});