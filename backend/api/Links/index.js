import * as auth from '../../auth/auth.service';

var express = require('express');
var controller = require('./link.controller');

var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.index);
router.post('/', auth.isAuthenticated(), controller.create);

module.exports = router;