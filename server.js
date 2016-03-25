"use strict";
require("use-strict");

// set up ======================================================================
// DEBUG
var debug = require("debug");
var log   = debug("server:log");
var info  = debug("server:info");
var error = debug("server:error");

// SERVER
var express = require("express");
var app = express();

// DB
var dbTools = require("./server/db-tools");

// CONFIG
var conf = require("./server/config/config");

// OTHER
var monkeyBiz = require('./server/request-loop');
var t = require("./server/tools");

// configuration ===============================================================
app.use(express.static(__dirname + '/app'));
app.use(function (err, req, res, next) {
    error(err);
    res.status(500).send(err);
});

// routes ======================================================================
    // api ---------------------------------------------------------------------
    // get navigation menu data
    app.get('/nav', function (req, res) {
        log('I received a GET request from navigationCtrl.');
        
        dbTools.getNav(res, { 'usernames': conf.usernames });
    });

    // aggregate statistics user(month, year)
    app.get('/statistics/:item', function (req, res, next) {
        var navItem = req.params.item;
        log('I received a GET request from /statistics/' + navItem + '.');

        var errorHappened = false;
        var navItemArr = '';

        /*
            Cases:
                + navItem === string?
                + string consists of three parts?
                + is first part a a valid username? /^[a-zA-Z0-9_.]*$/
                + is the second part a month i.e. 0<x<13?
                + is third part a number and a valid year?
        */ 
        try {
            //Error case
            if (typeof navItem != 'string') {
                throw new Error('Query string must be a string, not -> ' + typeof navItem);
            }

            //Error case
            navItemArr = navItem.split('-');
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
            next(err.message);
        }

        if(!errorHappened) {
            var start = new Date(navItemArr[2], navItemArr[1] - 1);
            var end = new Date(start);
            end.setMonth(end.getMonth() + 1);

            dbTools.getUserStatsTimeframe(res, navItemArr[0], start, end);
        }
    });

// start app ===================================================================
app.listen(conf.port, conf.ipaddress, function () {
    log('Server running on http://' + conf.ipaddress + ':' + conf.port);
});
monkeyBiz.gogogo(conf);