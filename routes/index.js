var express = require('express');
var router = express.Router();

/* Auth page. */
router.get('/', function(req, res, next) {
    if (req.session.userid)
        res.status(200).redirect(`/home/:${req.session.userid}`);
    else
        res.render('index', { title: 'Express', message: "" });
});

/* Create a new bot */
router.post('/add', (req, res) => {
  let botService = req.app.get('BotService');
  let capitalize = req.app.get('capitalize');
  let botName = req.body.name;
  let botPersonality = req.body.personality;
  let botUser = req.body.userid;
  botService.addBot({name: botName, personality: botPersonality, user: botUser})
      .then(() => {
          req.session.bots.push({name: capitalize(botName), personality: botPersonality, user: req.session.userid});
          res.status(200).redirect(`/home/${req.session.userid}`);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).render('error', {message: err.message, error: err});
      })
});

/* Authentication */
router.post('/user', (req, res) => {
    let userid = req.body.id;
    let password = req.body.pwd;
    let UserService = req.app.get("UserService");
    let BotService = req.app.get("BotService");
    try {
        req.session.userid = UserService.getUser({id: userid, pwd: password});
        BotService.getBots(req.session.userid)
            .then((bots) => {
                req.session.bots = bots;
                console.log(`bots : ${req.session.bots.length}`);
                res.status(200).redirect(`/home/${req.session.userid}`);
            })
    } catch (err) {
        res.status(404).render("index", {title: 'Express', message: err.stack});
    }
});

/* Home page after authentication */
router.get('/home/:id', (req, res) => {
    if (req.session.userid) {
        let UserService = req.app.get("UserService");
        if (UserService.isConnected(req.params.id))
            res.status(200).render("home", {userid: req.session.userid, bots: req.session.bots});
        else {
            req.session.destroy();
            res.status(400).redirect("/");
        }
    }
    else
        res.status(400).redirect("/");
});

/* Log out */
router.post('/logout', (req, res) => {
    // save uservars and bots
    let UserService = req.app.get('UserService');
    let BotService = req.app.get('BotService');
    UserService.logOut(req.session.userid);
    BotService.saveContext(req.session.userid)
        .then(() => {
            req.session.destroy();
            res.status(200).redirect('/');
        });
})

module.exports = router;
