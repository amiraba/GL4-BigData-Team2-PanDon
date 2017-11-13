/**
 * Created by Vyndee on 23/04/2017.
 */

var User = require("../models/user");
var mongoose = require("mongoose");
var jwt = require('jsonwebtoken');
var app = require("../lib/app");

module.exports = {
    register: function (req, res, next) {

        console.log(req.body);

        User.findOne({
            email: req.body.email
        }, function (err, user) {
            console.log(user);
            if (user) {
                res.json({success: false, message: "User exist"});
            } else {
                User.create(req.body, function (err, user) {
                    console.log(user);
                    console.log(err);
                    if (err) {
                        res.status(402).send(err);
                        return;
                    }
                    var token = jwt.sign(user, app.get("superSecret"), {
                        expiresIn: "24h"//expires in 24 hours
                    });
                    res.json({success: true, data: user, token: token});
                })
            }
        });

    },
    getAllUsers: function (req, res) {

        console.log(req.decoded);
        User.find({})
        //.select({password: 0})
            .exec(callback);

        function callback(err, users) {
            console.log(err);
            res.json(users);
        }

    },
    login: function (req, res) {
        User.findOne({
            email: req.body.email
        }, function (err, user) {

            console.log(user);
            if (user) {
                console.log("hello");

                user.comparePassword(req.body.password, function (err, isMatch) {
                    if (isMatch) {
                        console.log(app.get('superSecret'));
                        var token = jwt.sign(user, app.get('superSecret'), {
                            expiresIn: "24h"// expires in 24 hours
                        });
                        res.json({success: true, data: user, token: token})
                    } else {
                        res.status(403)
                            .send({success: false, data: "Password Incorrect"});
                    }
                })
            } else {
                res.status(401)
                    .send({success: false, data: "User Not Found"});
            }
        });


    },
    removeAll: function (req, res) {
        User.remove({}, function (err, response) {

            res.json({success: true});
        })
    }
};