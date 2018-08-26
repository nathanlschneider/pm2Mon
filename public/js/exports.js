function JSapp(pid, name, id, mode, status, restarts, uptime, cpu, memory) {
    this.pid = pid;
    this.name = name;
    this.id = id;
    this.mode = mode;
    this.status = status;
    this.restarts = restarts;
    this.uptime = uptime;
    this.cpu = cpu;
    this.memory = memory;
}

JSapp.prototype = {
    compare: function() {
        console.log(`pid - ${this.pid}`);
    }
};

module.exports = JSapp;
