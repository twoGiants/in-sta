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

removeSpecificElementsFromArray(0);
removeSpecificElementsFromArray(1);
removeSpecificElementsFromArray(2);
removeSpecificElementsFromArray(3);
removeSpecificElementsFromArray(4);
removeSpecificElementsFromArray(5);
removeSpecificElementsFromArray(6);
removeSpecificElementsFromArray(8);
removeSpecificElementsFromArray(10);

function removeSpecificElementsFromArray(index) {
    var myKey = 'ig_user_statistics.' + index;
    var myObj = {};
    myObj[myKey] = 1;
    log(myObj);
    db.instagram.update({
            _id: mongojs.ObjectId('5698a70eaf3d30b021b81eb5')
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
                        db.close();
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