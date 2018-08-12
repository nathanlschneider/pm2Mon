var app = (function () {

    var appVar = [];
    
    function Module(arrNum, name, id, mode, pid, status, restarts, uptime, cpu, mem) {
        this.arrNum = arrNum;
        this.name = name;
        this.id = id;
        this.mode = mode;
        this.pid = pid;
        this.status = status;
        this.restarts = restarts
        this.uptime = uptime;
        this.cpu = cpu;
        this.mem = mem;
    };
    
    Module.prototype.makeElements = function () {
        var content = document.getElementById('content');
        var contents = document.createElement('div');
        var nameSpan = document.createElement('span');
        var idSpan = document.createElement('span');
        var modeSpan = document.createElement('span');
        var pidSpan = document.createElement('span');
        var statusSpan = document.createElement('span');
        var restartsSpan = document.createElement('span');
        var uptimeSpan = document.createElement('span');
        var memSpan = document.createElement('span');
        var cpuSpan = document.createElement('span');
        var btnContainer = document.createElement('div');
        var btn1 = document.createElement('button');
        var btn2 = document.createElement('button');


        contents.className = "module";
        cpuSpan.setAttribute("id", this.arrNum);
        nameSpan.innerText = this.name;
        nameSpan.classList = "name";
        idSpan.innerText = this.id;
        idSpan.classList = "id";
        modeSpan.innerText = this.mode;
        modeSpan.classList = "mode";
        pidSpan.innerText = this.pid;
        pidSpan.classList = "pid";
        statusSpan.innerText = this.status;
        statusSpan.classList = "status";
        restartsSpan.innerText = this.restarts;
        restartsSpan.classList = "restarts";
        uptimeSpan.innerText = this.uptime;
        uptimeSpan.classList = "uptime";
        cpuSpan.innerText = this.cpu + "%";
        cpuSpan.classList = "cpu";
        memSpan.innerText = this.mem / 1000 + " kb";
        memSpan.classList = "mem";
        btn1.innerText = "Reload";
        btn2.innerText = "Stop";
        btnContainer.classList = "btn";
       
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
       
    };

    axios.get('http://localhost:8989/node')
        .then(function (response) {
console.log(response);
            for (var i = 0; i < response.data.length; i++) {
                var rd = response.data[i];
                appVar[i] = new Module(i, rd.name, rd.pm_id, rd.pm2_env.exec_mode, rd.pid,
                    rd.pm2_env.status, rd.pm2_env.restart_time, rd.pm2_env.pm_uptime,
                    rd.monit.cpu, rd.monit.memory);
                    console.log(appVar[i]);
                    appVar[i].makeElements();
            }
        })
        .catch(function (error) {
            console.log(error);
        });
})()