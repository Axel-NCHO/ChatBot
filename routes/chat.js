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

module.exports = router;