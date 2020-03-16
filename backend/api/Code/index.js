var express = require('express');
var controller = require('./code.controller');

var router = express.Router();

router.get('/:code', controller.index);

module.exports = router;