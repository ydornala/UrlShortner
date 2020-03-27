const express = require('express');
const User = require('../api/User/User.model');
const router = express.Router();

const Config = require('../config/environment');

require('./google/passport').setup(User, Config);

router.use('/google', require('./google').default);

export default router;