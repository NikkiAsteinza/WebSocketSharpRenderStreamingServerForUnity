import {fetchConfig, getConfig} from '../config.js';

let config;

await fetchConfig();
config = getConfig();


console.log(`Config: ${config}`);

navigator.mediaDevices.getDisplayMedia({ video: { width: { ideal: config.BROADCASTING_WIDTH }, height: { ideal: config.BROADCASTING_HEIGHT } } })
    .then(stream => {
        console.log('Display media stream obtained');
        video.srcObject = stream;

        const ws = new WebSocket(`ws://localhost:${config.PORT}`);

        ws.onopen = () => {
            console.log('WebSocket connection established');

            stream.getVideoTracks()[0].addEventListener('ended', () => {
                console.log('Display media stream ended');
                ws.close();
            });

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // Function to send frames over WebSocket
            const sendFrame = () => {
                if (video.videoWidth && video.videoHeight) {
                    canvas.width =  config.BROADCASTING_WIDTH;
                    canvas.height =  config.BROADCASTING_HEIGHT;
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    canvas.toBlob((blob) => {
                        if (blob) {
                            const reader = new FileReader();
                            reader.readAsDataURL(blob);
                            reader.onloadend = () => {
                                const base64data = reader.result.split(',')[1];
                                const message = {
                                    id: config.BROADCASTER_CHANNEL,
                                    width: canvas.width,
                                    height: canvas.height,
                                    imageData: base64data
                                };
                                ws.send(JSON.stringify(message));
                                console.log('Sent frame:', message);
                            };
                        }
                    }, config.IMAGE_FORMAT, 0.95); // Adjust quality parameter if necessary
                } else {
                    console.warn('Video width or height is zero');
                }
            };

            // Send frame every 100ms
            const sendInterval = setInterval(sendFrame, 100);

            // Stop sending frames when WebSocket is closed
            ws.onclose = () => {
                console.log('WebSocket connection closed');
                console.log(sender + "-" + e.Reason);

                clearInterval(sendInterval);
            };
            
            ws.onerror = (error) => {
                console.error('WebSocket error: ', error);
            };
        };


    })
    .catch(error => {
        console.error('Error accessing display media.', error);
    });