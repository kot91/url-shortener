var express = require('express');
var mongo = require('mongodb');
var routes = require('./routes/routes.js');
var urlshort = require('./urlshortener/urlshortener.js');
require ('dotenv').config({
    silent: true,
    path: './config.env'
});



var app = express();
mongo.MongoClient.connect('mongodb://ethicmeta-url-shortener-4755979', function (err, db){
    if (err) throw err;
    else
    console.log('connected to mongoDB');
    
    
    app.use(express.static(process.cwd() + '/views'));
    
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });
    
    db.createCollection("sites", {
        capped: true,
        size: 5242880,
        max: 5000
    });
    
    routes(app, db);
    urlshort(app, db);
    
    app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0");
});

//mongod --port 27017 --dbpath=./data --nojournal