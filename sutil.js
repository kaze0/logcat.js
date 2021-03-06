/*
 * Borrowed and mofidied form a Node chat server, probably
 * completely different now
 */
var sys = require('sys'),
    fs = require('fs'),
    qs = require('querystring'),
    url = require('url'),
    sutil = exports;

sutil.getMap = [];

sutil.sessions = {};

sutil.get = function (path, handler) {
    sutil.getMap[path] = handler;
};

sutil.not_found = function (req, res) {
    var not_found_msg = 'Not Found';
    console.log('Not found: ' + req.url);
    res.writeHead(404, {
        'Content-Type': 'text/plain',
        'Content-Length': not_found_msg.length
    });
    res.write(not_found_msg);
    res.end();
};

sutil.staticHandler = function (filename) {
    var body;

    function loadResponseData(callback) {
        fs.readFile(filename, function (err, data) {
            if (err) {
                sys.debug('Error loading file ' + filename);
            } else {
                sys.debug('loading file ' + filename);
                body = data;
            }
            callback();
        });
    }

    return function (req, res) {
        loadResponseData(function () {
            res.writeHead(200, {
                //FIXME: Pull these from a map based on extension
                'Content-Type': 'text/html',
                'Content-Length': body.length
            });
            res.write(body);
            res.end();
        });
    };

};

//FIXME: make this generic
sutil.get('/', sutil.staticHandler('index.html'));
sutil.get('/jquery.dataTables.min.js', sutil.staticHandler('jquery.dataTables.min.js'));
sutil.get('/jquery.js', sutil.staticHandler('jquery.js'));
sutil.get('/style.css', sutil.staticHandler('style.css'));
sutil.get('/tables.css', sutil.staticHandler('tables.css'));
sutil.get('/jquery-ui-1.8.17.custom.css', sutil.staticHandler('trontastic/jquery-ui-1.8.17.custom.css'));
sutil.get('/images/forward_disabled.jpg', sutil.staticHandler('images/forward_disabled.jpg'));
sutil.get('/images/back_disabled.jpg', sutil.staticHandler('images/back_disabled.jpg'));
sutil.get('/images/forward_enabled.jpg', sutil.staticHandler('images/forward_enabled.jpg'));
sutil.get('/images/back_enabled.jpg', sutil.staticHandler('images/back_enabled.jpg'));
sutil.get('/images/sort_desc.png', sutil.staticHandler('images/sort_desc.png'));
sutil.get('/images/sort_asc.png', sutil.staticHandler('images/sort_asc.png'));
sutil.get('/images/sort_both.png', sutil.staticHandler('images/sort_both.png'));

//FIXME: just left in as a simple sample, it's dumb
sutil.get('/who', function (req, res) {
    var nicks = [],
        i, session;

    for (i in sutil.sessions) {
        session = sutil.sessions[i];
        nicks.push(session.nick);
    }
    res.simpleJSON(200, {
        nicks: nicks
    });
});