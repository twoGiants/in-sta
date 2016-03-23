"use strict";

process.env.TZ = 'Europe/Berlin';

module.exports = {
    desiredTime: [4, 5],
    usernames: ['stazzmatazz', 'lukatarman', 'aya_shalkar', 'newkissontheblog'],
    source: "http://iconosquare.com/",
    selector: [
        'a[class="followers user-action-btn"] span[class=chiffre]',
        'a[class="followings user-action-btn"] span[class=chiffre]',
        'div[id="userProfilLarge"]'
    ],
    ipaddress: process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1',
    port: process.env.OPENSHIFT_NODEJS_PORT || 8080,
    connectionString: process.env.OPENSHIFT_MONGODB_DB_PASSWORD ?
        (process.env.OPENSHIFT_MONGODB_DB_USERNAME + ':' +
        process.env.OPENSHIFT_MONGODB_DB_PASSWORD + '@' +
        process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
        process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
        process.env.OPENSHIFT_APP_NAME) : 
        '127.0.0.1:27017/nodejs',
    timezone: process.env.TZ,
    testUsernames: ['aya_shalkar', 'newkissontheblog']
};