const express = require('express');
const router = express.Router();

/* GET GUI */
router.get('/', function(req, res) {
    res.render('index');
});

module.exports = router;
