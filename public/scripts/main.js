(()=> {
    var balloon = document.querySelector('#balloon'),
        line = document.querySelector('.balloon--line'),
        lastZ = 0,
        lastY = 0,
        minDiff = 2,
        tm = null,
        wip = 0,
        wipDivizor = 12;

    var absolute = null;
    var alpha = null;
    var beta = null;
    var gamma = null;

    var conn = new WebSocket('ws://172.22.3.26:6080');
    var md = new MobileDetect(window.navigator.userAgent);

    if (md.mobile()) {
        document.querySelector('.empty').style.visibility = 'hidden';
    }

    conn.onmessage = function(e) {
        var event = JSON.parse(e.data);

        if (typeof event.type !== "undefined") {
            console.log(event.id);
            var img = document.createElement('img');
            img.src = 'https://chart.googleapis.com/chart?cht=qr&chl='+event.id+'&chs=250x250&chld=L|0';
            img.className = 'center';
            document.getElementById('qrcode').appendChild(img);

            return true;
        }


        moveElement(event);
    };


    
    function handleOrientation(event) {

        if (md.mobile()) {

            if (
                Math.round(event.absolute) !== absolute ||
                Math.round(event.alpha) !== alpha ||
                Math.round(event.beta) !== beta ||
                Math.round(event.gamma) !== gamma
            ) {
                conn.send(JSON.stringify({
                    absolute: Math.round(event.absolute),
                    alpha: Math.round(event.alpha),
                    beta: Math.round(event.beta),
                    gamma: Math.round(event.gamma)
                }));

                absolute = Math.round(event.absolute);
                alpha = Math.round(event.alpha);
                beta = Math.round(event.beta);
                gamma = Math.round(event.gamma);
            }
        }
    }

    function moveElement(event) {

        var absolute = event.absolute;
        var alpha    = event.alpha;
        var beta     = event.beta;
        var gamma    = event.gamma;

        if(Math.abs(lastZ - gamma) > minDiff){
            clearTimeout(tm);

            // telling the body about the direction for the animation
            if (gamma < 0) {
                document.body.setAttribute('data-moving', 'right');
                line.style.width = (-gamma * 1.1) + 'px';
                line.style.transform = 'translateX(' + (gamma*.1) + 'px)';
            }
            if (gamma > 0) {
                line.style.width = (gamma * 0.5) + 'px';
                document.body.setAttribute('data-moving', 'left');
            }

            // adding wipplash effect
            wip = (gamma - lastZ)/wipDivizor;

            // rotating the balloon
            balloon.style.transform = "rotateZ("+(-1*(gamma + wip))+"deg)";

            tm = setTimeout(_=>{
                // ending the wipplash effect
                balloon.style.transform = "rotateZ("+(-1*(gamma - wip))+"deg)";
            }, 400);

            // and now we store the gamma
            lastZ = gamma;
        }

        if (Math.abs(lastY - beta) > minDiff) {
            // gatting farther or closer
            balloon.style.width = (-beta + 200) + 'px';
            lastY = beta;
        }
    }

    window.addEventListener("deviceorientation", handleOrientation, true);
})();
