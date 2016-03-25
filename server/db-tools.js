"use strict";
// set up ======================================================================
// DEBUG
var debug = require("debug");
var log   = debug("server:log");
var info  = debug("server:info");
var error = debug("server:error");

// DB
var mongojs    = require("mongojs");
var bodyParser = require("body-parser");

// OTHER
var t = require("./tools");

// configuration ===============================================================
var connectionString = process.env.OPENSHIFT_MONGODB_DB_PASSWORD ? (
        process.env.OPENSHIFT_MONGODB_DB_USERNAME + ':' +
        process.env.OPENSHIFT_MONGODB_DB_PASSWORD + '@' +
        process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
        process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
        process.env.OPENSHIFT_APP_NAME
    ) :
    '127.0.0.1:27017/nodejs';
var db = mongojs(connectionString, ['instagram']);

// db functions ================================================================
module.exports = {
    getNav: function (responseCallback, usernames) {
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
                // for nav order
                docs.push(usernames);
                responseCallback.json(docs);
            }
        });
    },
    getUserStatsTimeframe: function (responseCallback, username, start, end) {
        db.instagram.aggregate([
            {
                $match: {
                    'ig_user': username
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
                responseCallback.json(docs);
            }
        });
    },
    updateData: function (data) {
        db.instagram.findAndModify({
            query: {
                ig_user: data.username,
                ig_user_id: data.userId
            },
            update: {
                $push: {
                    ig_user_statistics: {
                        "date": data.date,
                        "followers": data.followers,
                        "followings": data.followings
                    }
                }
            },
            upsert: true
        }, function (err, doc) {
            if (err) {
                error(err.message);
            } else {
                log('Data saved for: ' + data.username + '\n\n');
            }
        });
    }
};