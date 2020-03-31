import { setTokenCookie } from '../auth.service';
const express = require('express');
const passport = require('passport');

const router = express.Router();

router
    .get('/', passport.authenticate('google', {
     failureRedirect: '/register',
     scope: ['profile',' email'],
     session: false
    }))
    .get('/callback', passport.authenticate('google', {
        failureRedirect: 'register',
        session: false
    }), setTokenCookie);

    export default router;