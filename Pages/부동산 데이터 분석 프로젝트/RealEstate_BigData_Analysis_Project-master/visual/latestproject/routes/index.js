var express = require('express');
var router = express.Router();
var app = require('../app.js');

/* GET home page. */
router.get('/apart_trade', function(req, res, next) {
    res.render('index', { type: "apart_trades"});
});
router.get('/apart_deposit', function(req, res, next) {
    res.render('index', {  type: "apart_deposits"});
});
router.get('/apart_rent', function(req, res, next) {
    res.render('index', {  type: "apart_rents"});
});
router.get('/office_trade', function(req, res, next) {
    res.render('index', { type: "office_trades"});
});
router.get('/office_deposit', function(req, res, next) {
    res.render('index', { type: "office_deposits"});
});
router.get('/office_rent', function(req, res, next) {
    res.render('index', {  type: "office_rents"});
});

module.exports = router;
