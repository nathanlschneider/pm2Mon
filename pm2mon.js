/*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
/* eslint-env node es6*/

const pm2 = require('pm2'),
    express = require('express'),
    app = express(),
    expressWs = require('express-ws')(app);

var newMem = {},
    oldMem = {},
    newPid = {},
    oldPid = {},
    newName = {},
    oldName = {},
    newCpu = {},
    oldCpu = {},
    newStatus = {},
    oldStatus = {},
    newMode = {},
    oldMode = {},
    newId = {},
    oldId = {},
    newRestarts = {},
    oldRestarts = {},
    newUptime = {},
    oldUptime = {},
    lastListLength = 0;

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
        // broadcast error?
    }
});

app.ws('/refresh', function(ws) {
    console.log(Date(), 'refresh request');
    pm2.list(function(err, list) {
        if (err) {
            // err
        } else {
            list.forEach(function(e) {
                var dataObj = {
                    name: e.name,
                    id: e.pm2_env.pm_id,
                    mode: e.pm2_env.exec_mode,
                    pid: e.pid,
                    status: e.pm2_env.status,
                    restarts: e.pm2_env.restart_time,
                    uptime: e.pm2_env.pm_uptime,
                    cpu: e.monit.cpu,
                    mem: e.monit.memory
                };
                ws.send(JSON.stringify(dataObj));
            });
        }
    });
});

// ################################################

app.ws('/updates', function(ws) {
    console.log('started client interval');
    var setlOop = setInterval(function() {
        pm2.list(function(err, list) {
            if (err) {
                // err
            } else {
                if (lastListLength !== list.length) {
                    ws.send('refreshPage');
                }

                lastListLength = list.length;

                for (var i = 0; i < list.length; i++) {
                    if (list[i].pid !== oldPid[i]) {
                        ws.send('refreshPage');
                        oldPid[i] = list[i].pid;
                    }

                    newMem[i] = `"mem": "${list[i].monit.memory}"`;
                    if (newMem[i] !== oldMem[i]) {
                        ws.send(`{"pid": "${list[i].pid}", ${newMem[i]}}`);
                        oldMem[i] = newMem[i];
                    }

                    newName[i] = `name: ${list[i].name}`;
                    if (newName[i] !== oldName[i]) {
                        ws.send(`pid: ${list[i].pid} ${newName[i]}`);
                        oldName[i] = newName[i];
                    }

                    newStatus[i] = `status: ${list[i].pm2_env.status}`;
                    if (newStatus[i] !== oldStatus[i]) {
                        ws.send(`pid: ${list[i].pid} ${newStatus[i]}`);
                        oldStatus[i] = newStatus[i];
                    }

                    newMode[i] = `mode: ${list[i].pm2_env.exec_mode}`;
                    if (newMode[i] !== oldMode[i]) {
                        ws.send(`pid: ${list[i].pid} ${newMode[i]}`);
                        oldMode[i] = newMode[i];
                    }

                    newId[i] = `id: ${list[i].pm2_env.pm_id}`;
                    if (newId[i] !== oldId[i]) {
                        ws.send(`"pid: ${list[i].pid}", "${newId[i]}"`);
                        oldId[i] = newId[i];
                    }

                    newRestarts[i] = `restarts: ${list[i].pm2_env.restart}`;
                    if (newRestarts[i] !== oldRestarts[i]) {
                        ws.send(`pid: ${list[i].pid} ${newRestarts[i]}`);
                        oldRestarts[i] = newRestarts[i];
                    }
                    newUptime[i] = `uptime: ${list[i].pm2_env.pm_uptime}`;
                    if (newUptime[i] !== oldUptime[i]) {
                        ws.send(`"pid: ${list[i].pid}", "${newUptime[i]}"`);
                        oldUptime[i] = newUptime[i];
                    }

                    newCpu[i] = `"cpu": "${list[i].monit.cpu}"`;
                    if (newCpu[i] !== oldCpu[i]) {
                        ws.send(`{"pid": "${list[i].pid}", ${newCpu[i]}}`);
                        oldCpu[i] = newCpu[i];
                    }
                }
            }
        });
    }, 1000);

    // ################################################

    ws.on('close', function() {
        clearInterval(setlOop);
        console.log('stopping client interval');
    });

    // ################################################

    // ws.on('message', function incoming(data) {
    //     if (data === 'refresh') {
    //         //send all data
    //         ws.send(pm2.list);
    //     }
    // });

    // ################################################
});

app.listen(8989);
