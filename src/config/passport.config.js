import passport from "passport";
import jwt from "passport-jwt";
import { PRIVATE_KEY } from "../utils.js";
import usersModel from "../dao/dbManagers/models/users.models.js";
import GitHubStrategy from "passport-github2";
import config from "../config.js";

const ADMIN_EMAIL = config.adminEmail;

const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const initializePassport = () => {
  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: PRIVATE_KEY,
      },
      async (jwt_payload, done) => {
        try {
          return done(null, jwt_payload.user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  //GITHUB

  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: "Iv1.40d942bf70c1cd43",
        clientSecret: "c29ac1ca0a57308d922bddf7a845bf96f41aade1",
        callbackURL: "http://localhost:8080/api/sessions/github-callback",
        scope: ["user:email"],
      },
      async (accsessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails[0].value;
          const user = await usersModel.findOne({ email });

          if (user) {
            return done(null, user);
          }

          const newUser = {
            first_name: profile._json.name,
            last_name: "",
            age: "",
            email,
            password: "",
          };

          if (email === ADMIN_EMAIL) {
            newUser.role = "admin";
          }

          const result = await usersModel.create(newUser);
          return done(null, result);
        } catch (error) {
          return done(`Incorrect credentials`);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  passport.deserializeUser(async (id, done) => {
    const user = await usersModel.findById(id);
    done(null, user);
  });
};

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["coderCookieToken"];
  }
  return token;
};

const passportCall = (Strategy) => {
  return async (req, res, next) => {
    passport.authenticate(
      Strategy,
      { session: false },
      function (err, user, info) {
        if (err) return next(err);
        if (!user) {
          return res.status(401).send({
            status: "error",
            error: info.messages ? info.messages : info.toString(),
          });
        }
        req.user = user;
        next();
      }
    )(req, res, next);
  };
};

export { initializePassport, passportCall };
