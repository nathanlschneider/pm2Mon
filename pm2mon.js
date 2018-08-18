/* eslint-env node*/

var pm2 = require('pm2'),
    express = require('express'),
    app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

pm2.connect(function(err) {
    if (err) {
        console.error(err);
    } else {
        console.log('Connected to pm2!');
    }
});

app.get('/api/pm2', function(req, res) {
    pm2.list(function(err, list) {
        if (err) {
            console.error(err);
        }
        res.send(list);
    });
});

app.post('/api/post', function(req) {
    var action = req.body.action;
    var id = req.body.id;

    if (action === 'stop') {
        pm2.stop(id, function(err) {
            console.log(err);
        });
    }
});

app.listen(8989);
