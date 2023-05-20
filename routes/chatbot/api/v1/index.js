var express = require('express');
var router = express.Router();

/* Auth page. */
router.get('/', function(req, res, next) {
    res.render('index');
});

/* Create a new bot */
router.post('/bots', async (req, res) => {
  let botService = req.app.get('BotService');
  let userService = req.app.get('UserService');
  let bots = null;
  let id = userService.getUser(req.body);
  if (id != null) {
      await botService.addBot(req.body).catch((err) => {
          console.log(err);
          res.status(400).send(err.message);
      });
      bots = await botService.getBots({id: id}, false).catch((err) => {console.log(err)});
      if (bots != null)
          res.status(200).send(JSON.stringify({id: id, bots: bots}));
      else
          res.status(500).send('SERVER ERROR');
  } else
      res.status(404).send('UNKNOWN ID');
});

/* Authentication */
router.post('/users', async (req, res) => {
    console.log('connecting')
    let UserService = req.app.get("UserService");
    let BotService = req.app.get("BotService");
    let id = UserService.getUser(req.body);
    let bots = null;
    if (id != null) {
        bots = await BotService.getBots(req.body);
        if (bots != null)
            res.status(200).send(JSON.stringify({id: id, bots: bots}));
        else
            res.status(500).send('SERVER ERROR');
    } else
        res.status(404).send('UNKNOWN ID');
});

module.exports = router;
