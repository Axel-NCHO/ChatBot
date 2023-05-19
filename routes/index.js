var express = require('express');
var router = express.Router();

/* GET auth page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', message: "" });
});

/* Create a new bot */
router.post('/add', (req, res) => {
  let botService = req.app.get('BotService');
  let botName = req.body.name;
  let botPersonality = req.body.personality;
  let botUser = req.body.userid;
  botService.addBot({name: botName, personality: botPersonality, user: botUser})
      .then(() => {
        res.status(200).redirect(`/home/${botUser}`);
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
        let user = UserService.getUser({id: userid, pwd: password});
        let bots = BotService.getBots(userid);
        console.log(`${userid} bots : ${bots}`);
        res.status(200).redirect(`/home/${user.id}`);
    } catch (err) {
        res.status(404).render("index", {title: 'Express', message: err.stack});
    }
});

/* Home page after authentication */
router.get('/home/:id', (req, res) => {
    let userid = req.params.id;
    let UserService = req.app.get("UserService");
    if (UserService.isConnected(userid))
        res.status(200).render("home", {userid: userid});
    else
        res.status(400).redirect("/");
});

module.exports = router;
