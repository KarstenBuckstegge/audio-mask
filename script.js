(function() {
    const useInputMedia = stream => {
        const video = document.querySelector('.video');

        // AUDIO API INIT
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioCtx.createAnalyser();
        const source = audioCtx.createMediaStreamSource(stream);
        const gainNode = audioCtx.createGain();
        source.connect(analyser);

        analyser.fftSize = 512;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        // mute output
        source.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        gainNode.gain.value = 0;

        // CANVAS INIT
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');

        const body = document.querySelector('body');
        const clientRect = body.getBoundingClientRect();

        canvas.width = clientRect.width;
        canvas.height = clientRect.height;
        ctx.fillStyle = "rgb(0,0,0)";

        // positions and dimensions
        const centerX = canvas.width * 0.5;
        const centerY = canvas.height * 0.5;
        const radiusMax = Math.min(centerX, centerY) - 10;
        const radiusMin = radiusMax * 0.5;

        const videoHeight = radiusMax * 2;
        const videoRect = video.getBoundingClientRect();
        const videoWidth = videoHeight * ( videoRect.width / videoRect.height );

        const dataLength = dataArray.length;
        const arcStepLength = 360 / dataLength;
        const radiusRange = radiusMax - radiusMin;


        const getAnchorPointPosition = (gain, i) => {
            const angle = arcStepLength * i;
            const radius = radiusMin + (gain / 256) * radiusRange;

            const posX = centerX + radius * Math.cos(angle);
            const posY = centerY + radius * Math.sin(angle);

            return [posX, posY];
        }

        // The actual magic happens here
        const clipVideo = factor => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();

            analyser.getByteFrequencyData(dataArray);

            for (i = 0; i < dataLength; i++) {
                const anchorPointPosition = getAnchorPointPosition(dataArray[i], i);

                if (i === 0) {
                    ctx.beginPath();
                    ctx.moveTo(anchorPointPosition[0], anchorPointPosition[1]);
                } else if (i === dataLength - 1) {
                    ctx.closePath();
                } else {
                    ctx.lineTo(anchorPointPosition[0], anchorPointPosition[1]);
                }
            }

            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.clip();
            ctx.drawImage(
                video,
                centerX - videoWidth / 2,
                centerY - radiusMax,
                videoWidth,
                videoHeight
            );
            ctx.restore();
        }

        // looping louie
        let then = new Date().getTime();

        function doThings() {
            const now = new Date().getTime();
            if(now - then > 25) {
                clipVideo();
                then = now;
            }
            const doer = requestAnimationFrame(doThings);
        }

        doThings();
    }

    // request audio data from the client
    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
    .then(useInputMedia)
}());