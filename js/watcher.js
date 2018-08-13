var watcher = (function () {
   
   
        var mem = document.querySelectorAll('.mem');
        console.log(mem.length);
        var loopTimer = setInterval(function () {
            axios.get('http://localhost:8989/node')
                .then(function (response) {
                    for (var i = 0; i < response.data.length; i++) {
                        var rd = response.data[i];
                        mem[i].innerHTML = rd.monit.memory;

                    }
                })
                .catch(function (error) {
                    console.log(error);
                    clearInterval(loopTimer);
                });

        }, 500);

})()