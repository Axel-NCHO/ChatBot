var express = require('express');
var router = express.Router();

/* Auth page. */
router.get('/', function(req, res, next) {
    res.render('index');
});

module.exports = router;