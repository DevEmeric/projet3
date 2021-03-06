const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const secret = require('../helper/jwt_secret');

// Identification par token
passport.use(new JWTStrategy(
  {  
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),  
    secretOrKey   : secret  
  },  
  (jwtPayload, cb) => {
    return cb(null, jwtPayload);
  }  
));

module.exports = passport;
