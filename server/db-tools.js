"use strict";

// DEBUG
var debug = require("debug");
var log = debug("server:log");
var info = debug("server:info");
var error = debug("server:error");

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
    }
};