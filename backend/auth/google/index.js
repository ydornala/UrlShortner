import { setTokenCookie } from '../auth.service';
const express = require('express');
const passport = require('passport');

const router = express.Router();

router
    .get('/', passport.authenticate('google', {
     failureRedirect: '/register',
     scope: ['profile',' email'],
     session: true
    }))
    .get('/callback', passport.authenticate('google', {
        failureRedirect: 'register',
        session: true
    }), setTokenCookie);

    export default router;