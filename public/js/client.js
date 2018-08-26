(function() {
    const refresh = new WebSocket('ws://192.168.1.10:8989/refresh');
    const update = new WebSocket('ws://192.168.1.10:8989/updates');
    var nodeApp = [];

    //var content = document.getElementById('content');

    update.addEventListener('message', function(payload) {
        if (payload.data === 'refreshPage') {
            location.reload();
        } else {
            var obj = JSON.parse(payload.data);
            // console.log(obj);
            var objProp = '.' + Object.keys(obj)[1];

            var key = Object.keys(obj)[1];
            var keyValue = obj[key];

            if (key === 'mem') {
                keyValue = memParser(keyValue);
            }

            if (key === 'cpu') {
                keyValue += '%';
            }

            let currentElement = document.getElementById(obj.pid).querySelector(objProp);

            currentElement.innerText = keyValue;
        }
        // var el = document.getElementById(payload.data.pid).querySelector;
    });

    refresh.addEventListener('message', function(payload) {
        var e = JSON.parse(payload.data);
        for (let i = 0; i < payload.data.length; i++) {
            nodeApp = new Module(
                e.name,
                e.id,
                e.mode,
                e.pid,
                e.status,
                e.restarts,
                e.uptime,
                e.cpu,
                e.mem
            );
        }
        nodeApp.makeElements();
    });

    function Module(name, id, mode, pid, status, restarts, uptime, cpu, mem) {
        this.name = name;
        this.id = id;
        this.mode = mode;
        this.pid = pid;
        this.status = status;
        this.restarts = restarts;
        this.uptime = uptime;
        this.cpu = cpu;
        this.mem = mem;
    }

    Module.prototype = {
        makeElements: function() {
            const content = document.getElementById('content'),
                contents = document.createElement('div'),
                nameSpan = document.createElement('span'),
                idSpan = document.createElement('span'),
                modeSpan = document.createElement('span'),
                pidSpan = document.createElement('span'),
                statusSpan = document.createElement('span'),
                restartsSpan = document.createElement('span'),
                uptimeSpan = document.createElement('span'),
                memSpan = document.createElement('span'),
                cpuSpan = document.createElement('span'),
                btnContainer = document.createElement('div'),
                btn1 = document.createElement('button'),
                btn2 = document.createElement('button');

            contents.className = 'module';
            contents.setAttribute('id', this.pid);

            nameSpan.classList = 'name';
            nameSpan.innerText = this.name;

            idSpan.classList = 'id';
            idSpan.innerText = this.id;

            modeSpan.classList = 'mode';
            modeSpan.innerText = modeParser(this.mode);
            if (this.mode === 'fork_mode') {
                modeSpan.classList.add('fork');
            }
            if (this.mode === 'cluster_mode') {
                modeSpan.classList.add('cluster');
            }

            pidSpan.classList = 'pid';
            pidSpan.innerText = this.pid;

            statusSpan.classList = 'status';
            statusSpan.innerText = this.status;
            if (this.status === 'online') {
                statusSpan.classList.add('online');
            }
            if (this.status === 'stopped') {
                statusSpan.classList.add('stopped');
            }

            restartsSpan.classList = 'restarts';
            restartsSpan.innerText = this.restarts;

            uptimeSpan.classList = 'uptime';
            uptimeSpan.innerText = uptimeParser(this.uptime);

            cpuSpan.classList = 'cpu';
            cpuSpan.innerText = this.cpu + '%';

            memSpan.classList = 'mem';
            memSpan.innerText = memParser(this.mem);

            btnContainer.classList = 'btn';
            btn1.innerText = 'Reload';

            btn1.addEventListener('click', function() {});

            btn2.innerText = 'Stop';
            btn2.addEventListener('click', function() {});

            content.appendChild(contents);
            contents.appendChild(nameSpan);
            contents.appendChild(idSpan);
            contents.appendChild(modeSpan);
            contents.appendChild(pidSpan);
            contents.appendChild(statusSpan);
            contents.appendChild(restartsSpan);
            contents.appendChild(uptimeSpan);
            contents.appendChild(cpuSpan);
            contents.appendChild(memSpan);
            contents.appendChild(btnContainer);
            btnContainer.appendChild(btn1);
            btnContainer.appendChild(btn2);
        }
    };

    function memParser(mili) {
        return Math.trunc(mili / 1000000) + 'mb';
    }

    function modeParser(mode) {
        if (mode === 'fork_mode') {
            return 'fork';
        }

        if (mode === 'cluster_mode') {
            return 'cluster';
        }
    }

    function uptimeParser(seconds) {
        var outString = '';
        var dateNow = Date.now();
        var ms = dateNow - seconds;
        var d, h, m, s;
        s = Math.floor(ms / 1000);
        m = Math.floor(s / 60);
        s = s % 60;
        h = Math.floor(m / 60);
        m = m % 60;
        d = Math.floor(h / 24);
        h = h % 24;
        if (d !== 0) {
            outString = d + 'd ';
        }
        if (h !== 0) {
            outString += h + 'h ';
        }
        outString += m + 'm';
        return outString;
    }
})();
