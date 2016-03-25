'use strict';

module.exports = function ($resource) {
    return $resource('/', {}, {
        nav: { method: 'GET', url: '/nav', isArray: true },
        query: { method: 'GET', url: '/statistics/:item', params: { item: 'ig_user' }, isArray: true }
    });
};