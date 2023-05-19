var express = require('express');
var router = express.Router();

/* Auth page. */
router.post('/', (req,res) => {
    if (req.session.userid) {
        console.log(req.body.name);
        // res.status(400).redirect('/');
        let BotService = req.app.get("BotService");
        BotService.useBot({
            name: req.body.name,
            user: req.body.userid
            }).then(() => {
                res.status(200).redirect(`/chat/${req.body.name}`);
        })
    }else
        res.status(400).redirect('/');
});

router.get('/:botname', (req,res) => {
    if (req.session.userid) {
        res.status(200).render('chat', {botname: req.params.botname, userid: req.session.userid});
    }else
        res.status(400).redirect('/');
});

router.post('/response', (req,res) => {
    if (req.session.userid) {
        let BotService = req.app.get('BotService');
        BotService.getResponse({
            botname: req.body.botname,
            user: req.body.user,
            input: req.body.input
        }).then((response) => {
            res.status(200).send(JSON.stringify({text: response}));
        }).catch((err) => {
            res.status(500).send(JSON.stringify({text: err.stack}));
        });
    } else
        res.status(400).redirect('/');
});

module.exports = router;