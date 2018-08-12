var app = (function () {

    var content = document.getElementById('content');
    
        function Module(arrNum, name, id, mode, pid, status, restart, uptime, cpu, mem){
            this.arrNum = arrNum;
            this.name = name;
            this.id = id;
            this.mode = mode;
            this.pid = pid;
            this.status = status;
            this.restart = restart
            this.uptime = uptime;
            this.cpu = cpu;
            this.mem = mem;

            var contents = document.createElement('div');
            var nameSpan = document.createElement('span');
            var cpuSpan = document.createElement('span');

            contents.className = "module";
            cpuSpan.setAttribute("id", arrNum)
            nameSpan.innerText = "Name: " + name;
            cpuSpan.innerText = " CPU: " + cpu + "%";
            
            content.appendChild(contents);
            contents.appendChild(nameSpan);
            contents.appendChild(cpuSpan);

            var getCpu = document.getElementById(arrNum);

            this.loopTimer = setInterval(function(){
                axios.get('http://localhost:8989/node')
                .then(function(response){
                   getCpu.innerText = " CPU: " + response.data[arrNum].monit.cpu + "%";
                   //this.cpu = response.data[arrNum].monit.cpu;
                    
                })
                .catch(function(err){
                    console.log(error);
                    clearInterval(this.loopTimer);
                })
            }, 1000);
        };
        
        axios.get('http://localhost:8989/node')
        .then(function (response) {
            var appVar = [];
            for (var i = 0; i < response.data.length; i++) {
                var rd = response.data[i];
                appVar[i] = new Module(i, rd.name, rd.pm_id, rd.pm2_env.exec_mode, rd.pid,
                rd.pm2_env.status, rd.pm2_env.restart_time, rd.pm2_env.pm_uptime,
                rd.monit.cpu, rd.monit.mem);
            }
            console.log(appVar);
        })
        .catch(function (error) {
            console.log(error);
        });
})()