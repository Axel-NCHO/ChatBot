const express = require('express');
const router = express.Router();

/* Check if user 'id-pwd' ha bot 'name' */
router.get('/id=:id&pwd=:pwd&name=:name', async (req,res) => {
    let UserService = req.app.get("UserService");
    let BotService = req.app.get("BotService");
    console.log(req.params)
    if (UserService.exists(req.params)) {
        if (await BotService.exists(req.params))
            res.status(200).send('OK');
        else
            res.status(404).send('OK');
    } else
        res.status(404).send('UNKNOWN ID');
});

/* Reply. Can be used directly */
router.post('/response', async (req,res) => {
    let BotService = req.app.get('BotService');
    let UserService = req.app.get('UserService');
    if (UserService.exists(req.body)) {
         let response = await BotService.getResponse(req.body);
         if (response)
             res.status(200).send(JSON.stringify({text: response}));
         else
             res.status(500).send('SERVER ERROR');
    } else
        req.status(404).send('UNKNOWN ID');
});

module.exports = router;
