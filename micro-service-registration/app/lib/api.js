const express = require('express');
const router = express.Router();
const tokenRouter = express.Router();
var users = require("../routes/user");
var jwt = require("jsonwebtoken");
var app = require("../lib/app");

/* GET api listing. */
router.get('/', function (req, res) {
    res.send('api works');
});
// Logging
router.use(function (req, res, next) {
    // do logging

    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // console.log(req);
    console.log('###### Request Triggered ######');

    console.log('From :' + req.url);
    if (req.body !== null) {
        console.log('With a body content :' + JSON.stringify(req.body));
    }
    console.log('###############################');
    console.log('');

    next(); // make sure we go to the next routes and don't stop here
});

//Verify Token
tokenRouter.use(function (req, res, next) {

    //console.log(req.headers);

    var token = req.body.token || req.query.token || req.headers["authorization"];
    //console.log(token);

    if (token) {
        jwt.verify(token, app.get("superSecret"), function (err, decoded) {
            if (err) {
                return res.json({success: false, message: "Failed to authentificate token"})
            } else {
                req.decoded = decoded._doc;
                next();
            }
        })
    } else {
        return res.status(403)
            .send({
                success: false,
                message: "No token provided"
            })
    }

});


/*************Routes ***************/
router.route("/users")
    .post(users.register)
    .delete(users.removeAll);
router.route("/user/login")
    .post(users.login);

tokenRouter.route("/users")
    .get(users.getAllUsers);

module.exports = {
    router: router,
    tokenRouter: tokenRouter
};
