module.exports = function ($resource) {
    return $resource('/', {}, {
        nav: { method: 'GET', url: '/nav', isArray: true }
    });
}