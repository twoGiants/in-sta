"use strict";
var request = require("request");
var Promise = require('promise');
var debug = require("debug");
var log   = debug("server:log");
var info  = debug("server:info");
var error = debug("server:error");

module.exports.getAccountData = function (username) {
    if (!username) {
        return new Error('A valid username must be passed.');
    }
    var uri = 'https://www.instagram.com/' + username + '/?__a=1';
    
    return new Promise(function(resolve, reject) {
        request(uri, {
            timeout: 10000
        }, function(err, res, body) {
            if (err) {
                return reject(err);
            } else {
                try {
                    var data = JSON.parse(body).user;
                    var ts = new Date();
                    
                    return resolve({
                        username: data.username,
                        userId: data.id,
                        followers: data.followed_by.count,
                        followings: data.follows.count,
                        profilePicUrlHD: data.profile_pic_url_hd,
                        profilePicUrl: data.profile_pic_url,
                        date: ts
                    });
                } catch (parseError) {
                    return reject(parseError);
                }
            }
        });
    });
};