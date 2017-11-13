var express = require('express');
var router = express.Router();
var jwt = require("jsonwebtoken");


//Verify Token
router.use(function (req, res, next) {

    //console.log(req.headers);

    var token = req.body.token || req.query.token || req.headers["authorization"];
    //console.log(token);

    if (token) {
        jwt.verify(token, "insatbigdata", function (err, decoded) {
            console.log(err);
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
                message: "Failed to authentificate"
            })
    }

});
/* GET users listing. */
router.get('/user', function (req, res, next) {

    console.log("Hello");
    //ceci un utilisateur
    console.log(req.decoded);

    res.json({success: true, data: req.decoded});
});

module.exports = router;
