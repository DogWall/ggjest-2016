'use strict';

module.exports = function (app, io, matchMaking) {

    app.get('/stats', function (req, res) {
        res.setHeader('Content-Type', 'text/html');
        res.end(matchMaking.stats().join('<br>'));
    })

};
