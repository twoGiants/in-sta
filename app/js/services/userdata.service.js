'use strict';

module.exports = function ($resource) {
    return $resource('/', {}, {
        nav: { method: 'GET', url: '/nav', isArray: true },
        stat: { method: 'GET', url: '/statistics', isArray: true },
        query: { method: 'GET', url: '/statistics/:item', params: { item: 'ig_user' }, isArray: true }
    });
};