"use strict";

// DEBUG
var debug = require("debug");
var log   = debug("server:log");
var info  = debug("server:info");
var error = debug("server:error");

// OTHER
var t = require("./tools");

module.exports = {
    saveData: function (newData, username, db) {
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
    },
    saveDataNew: function (data, db) {
        db.instagram.findAndModify({
            query: {
                ig_user: data.igUser,
                ig_user_id: data.igUserId
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
            upsert: true,
            new: true
        }, function (err, doc) {
            if (err) {
                error(err.message);
            } else {
                log('...data saved.\n\n');
            }
        });
    }
};