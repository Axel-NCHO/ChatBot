var express = require('express');
var router = express.Router();


/* Authentication */
router.post('/', async (req, res) => {
    console.log('connecting')
    let UserService = req.app.get("UserService");
    let BotService = req.app.get("BotService");
    let id = UserService.getUser(req.body);
    console.log("Got user "+ id)
    let bots = null;
    if (id != null) {
        bots = await BotService.getBots(req.body);
        console.log(`Got ${bots.length} bots`)
        let personalities = BotService.getPersonalities();
        res.status(200).send(JSON.stringify({id: id, bots: bots, personalities: personalities}));
    } else
        res.status(404).send('UNKNOWN ID');
});

router.post('/registration', async (req, res) => {
    console.log('creating account');
    let UserService = req.app.get("UserService");
    let BotService = req.app.get("BotService");
    let id = UserService.getUser(req.body);
    if (id == null) {
        // new user
        await UserService.addUser(req.body).catch((err) => {
            console.log(err);
            res.status(500).send("ERROR");
        });
        let personalities = BotService.getPersonalities();
        res.status(200).send(JSON.stringify({id: id, bots: [], personalities: personalities}));
    } else
        res.status(400).send('THIS ACCOUNT ALREADY EXISTS')
})

module.exports = router;
