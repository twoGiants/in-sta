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
    timezone: process.env.TZ,
    testUsernames: ['aya_shalkar', 'newkissontheblog']
};