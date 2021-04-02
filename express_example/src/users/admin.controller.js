const express = require('express');
const router = express.Router();
const users = require('./users.service');
const asyncHandler = require('express-async-handler');
const util = require('../commons/util');


router.use(function timeLog (req, res, next) {
    console.log('Time: ', new Date());
    next();
})


router.patch('/unlock-user/:id/', asyncHandler(async (req, res) => {
    const user = req.user;
    if(user.role === util.ADMIN_ROLE){
        await users.unlock(user.id)
        res.status(200).send({message:"User has successfully been unlocked!"});
    }
    else res.status(403).send({message: "Not authorized!"});
}))

router.patch('/lock-user/:id/', asyncHandler(async (req, res) => {
    const user = req.user;
    if(user.role === util.ADMIN_ROLE){
        await users.lock(user.id)
        res.status(200).send({message:"User has successfully been locked!"});
    }
    else res.status(403).send({message: "Not authorized!"});
}))


module.exports = router;