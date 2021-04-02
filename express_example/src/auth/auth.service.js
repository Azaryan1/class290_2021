const User = require('../users/user.entity');
const { Unauthorized } = require('http-errors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class AuthService {
    async validate(username, password) {
        const user = await User.findOne({ username });
        if(user.locked==='yes'){
            throw new Error("The user is locked!");
        }
        if (!user || !bcrypt.compareSync(password, user.password)) {
            const attempts = user.failedlogins+1;
            user.failedlogins = attempts;
            user.save();
            if(user.failedlogins===3){
                user.locked = 'yes';
                user.save();
                throw new Error("The user is locked!");
            }
            throw new Unauthorized();
        }
        user.failedlogins = 0;
        user.save();

        return user;
    }

    async login(username, password) {
        const user = await this.validate(username, password);

        const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        })

        return token;
    }

    validateToken(token) {
        const obj = jwt.verify(token, process.env.JWT_SECRET, {
            ignoreExpiration: false
        })

        return { userId: obj.userId, username: obj.username };
    }
}

module.exports = new AuthService();