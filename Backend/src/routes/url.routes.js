const express = require('express');
const UrlRouter = express.Router();
// const controller = require('../controllers/url.controller');
const {shorten,redirect}=require('../controllers/url.controller')

UrlRouter.post('/shorten', shorten);
UrlRouter.get('/u/:shortCode', redirect);

module.exports = UrlRouter;
