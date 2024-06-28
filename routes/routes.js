const {Router} = require('express');
const router = Router();

router.get('/getConfig', (req, res) => {
    res.json({
        width: process.env.BROADCASTING_WIDTH,
        height: process.env.BROADCASTING_HEIGHT,
        format: process.env.IMAGE_FORMAT,
        broadcastChannel: process.env.RECEIVER_CHANNEL
    });
});

module.exports = router;