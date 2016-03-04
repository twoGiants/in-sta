module.exports = function ($resource) {
    return $resource('/', {}, {
        nav: { method: 'GET', url: '/nav', isArray: true },
        stat: { method: 'GET', url: '/statistics', isArray: true}
    });
}