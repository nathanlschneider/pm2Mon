var pm2 = require('pm2'),
    express = require('express'),
    app = express();



pm2.connect(function (err) {
    if (err) {
        console.error(err);
        process.exit(2);
    } else {
        console.log("Connected to pm2!");

    }
})
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.get("/node", function (req, res) {
    pm2.list(function (err, list) {
        if (err) {
            console.error(err);
        }
        res.send(list);
    })
});



app.listen(8989);