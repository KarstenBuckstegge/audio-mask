(function() {
    const useInputMedia = stream => {
        // console.log('useInputMedia');
        // const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        // const analyser = audioCtx.createAnalyser();
        // const source = audioCtx.createMediaStreamSource(stream);

        // source.connect(analyser);
        // analyser.connect(audioCtx.destination);

        // analyser.fftSize = 32;
        // const bufferLength = analyser.frequencyBinCount;
        // const dataArray = new Uint8Array(bufferLength);

        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        const video = document.querySelector('.video');

        // const sliceAudioData = () => {
        //     console.log('sliceAudioData');
        //     const slicedData = [];

        //     for(let i = 0; i < bufferLength; i++) {
        //         const value = dataArray[i] / 2;
        //         slicedData.push(value);
        //     }

        //     return slicedData;
        // }

        const clipVideo = factor => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();
            ctx.beginPath();
            ctx.arc(306, 277, 274, 0, Math.PI * 2, false);

            ctx.clip();

            ctx.drawImage(video, 0, 0);

            ctx.restore();
        }

        console.log('SET NOW');
        let then = new Date().getTime();

        function doThings() {
            const now = new Date().getTime();
            
            if(now - then > 25) {
                // analyser.getByteFrequencyData(dataArray);
                // const data = sliceAudioData();
                clipVideo(Math.random());
                // console.log('data', data);
                then = now;
            }

            const doer = requestAnimationFrame(doThings);
        }

        doThings();
    }


    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
    .then(useInputMedia)
}());