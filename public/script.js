import { fetchConfig, getBroadcastingImageWidth, getBroadcastingImageHeight,getBroadcastingImageFormat } from './config.js';

let imageWidth, imageHeight, imageFormat;

await fetchConfig();

imageWidth = getBroadcastingImageWidth();
imageHeight = getBroadcastingImageHeight();
imageFormat = getBroadcastingImageFormat();

console.log(`Size: ${imageWidth} x ${imageHeight}`);

navigator.mediaDevices.getDisplayMedia({ video: { width: { ideal: imageWidth }, height: { ideal: imageHeight } } })
    .then(stream => {
        console.log('Display media stream obtained');
        video.srcObject = stream;

        const ws = new WebSocket('ws://localhost:3000');

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
                    // Set higher resolution for the canvas
                    canvas.width = imageWidth;
                    canvas.height = imageHeight;
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    canvas.toBlob((blob) => {
                        if (blob) {
                            const reader = new FileReader();
                            reader.readAsDataURL(blob);
                            reader.onloadend = () => {
                                const base64data = reader.result.split(',')[1];
                                const message = {
                                    id: 'webcomponent',
                                    width: canvas.width,
                                    height: canvas.height,
                                    imageData: base64data
                                };
                                ws.send(JSON.stringify(message));
                                console.log('Sent frame:', message);
                            };
                        }
                    }, imageFormat, 0.95); // Adjust quality parameter if necessary
                } else {
                    console.warn('Video width or height is zero');
                }
            };

            // Send frame every 100ms
            const sendInterval = setInterval(sendFrame, 100);

            // Stop sending frames when WebSocket is closed
            ws.onclose = () => {
                console.log('WebSocket connection closed');
                clearInterval(sendInterval);
            };
        };

        ws.onerror = (error) => {
            console.error('WebSocket error: ', error);
        };

        ws.OnClose += (sender, e) => {
            console.log(sender + "-" + e.Reason);
        };
    })
    .catch(error => {
        console.error('Error accessing display media.', error);
    });