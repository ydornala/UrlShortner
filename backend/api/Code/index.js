import * as auth from '../../auth/auth.service';

var express = require('express');
var controller = require('./code.controller');
var router = express.Router();

router.get('/:code', auth.isAuthenticated(), controller.index);

module.exports = router;