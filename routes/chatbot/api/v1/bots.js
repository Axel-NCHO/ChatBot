var express = require('express');
var router = express.Router();

/* Create a new bot */
router.post('/', async (req, res) => {
  let botService = req.app.get('BotService');
  let userService = req.app.get('UserService');
  let bots = null;
  let id = userService.getUser(req.body);
  if (id != null) {
      await botService.addBot(req.body).catch((err) => {
          console.log(err);
          res.status(400).send(err.message);
      });
      bots = await botService.getBots({id: id}).catch((err) => {console.log(err)});
      if (bots != null)
          res.status(200).send(JSON.stringify({id: id, bots: bots}));
      else
          res.status(500).send('SERVER ERROR');
  } else
      res.status(404).send('UNKNOWN ID');
});

router.patch('/', async (req, res) => {
    let botService = req.app.get('BotService');
    let userService = req.app.get('UserService');
    let bots = null;
    let id = userService.getUser(req.body);
    if (id != null) {
        await botService.patchBot(req.body);
        bots = await botService.getBots({id: id}).catch((err) => {console.log(err)});
        res.status(200).send(JSON.stringify({id: id, bots: bots}));
    } else
        res.status(404).send('UNKNOWN ID');
});

router.delete('/', async (req, res) => {
    let botService = req.app.get('BotService');
    let userService = req.app.get('UserService');
    let bots = null;
    let id = userService.getUser(req.body);
    if (id != null) {
        await botService.removeBot(req.body);
        bots = await botService.getBots({id: id}).catch((err) => {console.log(err)});
        res.status(200).send(JSON.stringify({id: id, bots: bots}));
    } else
        res.status(404).send('UNKNOWN ID');
})


module.exports = router;
