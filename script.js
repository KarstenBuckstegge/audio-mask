(function() {
    const useInputMedia = stream => {
        const video = document.querySelector('.video');

        // AUDIO API INIT
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioCtx.createAnalyser();
        const source = audioCtx.createMediaStreamSource(stream);
        const gainNode = audioCtx.createGain();
        source.connect(analyser);

        // mute output
        source.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        gainNode.gain.value = 0;

        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        // CANVAS INIT
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');

        const body = document.querySelector('body');
        const clientRect = body.getBoundingClientRect();

        canvas.width = clientRect.width;
        canvas.height = clientRect.height;
        const centerX = canvas.width * 0.5;
        const centerY = canvas.height * 0.5;
        const radiusMax = Math.min(centerX, centerY) - 10;
        const radiusMin = radiusMax * 0.75;
        ctx.lineWidth = 12;
        ctx.strokeStyle = "#09f";
        ctx.fillStyle = "rgba(0,0,0,0.16)";


        const clipVideo = factor => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();

            analyser.getByteFrequencyData(dataArray);

            bandAverageData = (dataArray[1] + dataArray[2]) / 512;

            ctx.beginPath();
            ctx.arc(
                centerX,
                centerY,
                radiusMin + (radiusMax - radiusMin) * bandAverageData*bandAverageData*bandAverageData*bandAverageData,
                0,
                6.28);
            ctx.closePath();

            ctx.clip();
            ctx.drawImage(video, 0, 0);
            ctx.restore();
        }

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


    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
    .then(useInputMedia)
}());