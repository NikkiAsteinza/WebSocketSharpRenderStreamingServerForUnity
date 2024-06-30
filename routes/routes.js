const {Router} = require('express');
const router = Router();

router.get('/getConfig', (req, res) => {
    res.json({
        PORT: process.env.PORT,
        BROADCASTING_WIDTH: process.env.BROADCASTING_WIDTH,
        BROADCASTING_HEIGHT: process.env.BROADCASTING_HEIGHT,
        IMAGE_FORMAT: process.env.IMAGE_FORMAT,
        BROADCASTER_CHANNEL: process.env.BROADCASTER_CHANNEL,
        RECEIVER_CHANNEL: process.env.RECEIVER_CHANNEL
    });
});

module.exports = router;