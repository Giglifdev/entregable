import { Router as expressRouter } from "express";
import passport from "passport";
import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.js";

export default class Router {
  constructor() {
    this.router = expressRouter();
    this.init();
  }

  getRouter() {
    return this.router;
  }

  init() {}

  get(path, policies, strategy, ...callbacks) {
    this.router.get(
      path,
      this.applyCustomPassportCall(strategy),
      this.handlePolicies(policies),
      this.generateCustomResponse,
      this.applyCallbacks(callbacks)
    );
  }

  post(path, policies, strategy, ...callbacks) {
    this.router.post(
      path,
      this.applyCustomPassportCall(strategy),
      this.handlePolicies(policies),
      this.generateCustomResponse,
      this.applyCallbacks(callbacks)
    );
  }

  put(path, policies, strategy, ...callbacks) {
    this.router.put(
      path,
      this.applyCustomPassportCall(strategy),
      this.handlePolicies(policies),
      this.generateCustomResponse,
      this.applyCallbacks(callbacks)
    );
  }

  delete(path, policies, strategy, ...callbacks) {
    this.router.delete(
      path,
      this.applyCustomPassportCall(strategy),
      this.handlePolicies(policies),
      this.generateCustomResponse,
      this.applyCallbacks(callbacks)
    );
  }

  generateCustomResponse = (req, res, next) => {
    res.sendSuccess = (data) => {
      res.status(200).json({ data });
    };

    res.sendServerError = (error) => {
      res.status(500).json({ error });
    };

    res.sendClientError = (error) => {
      res.status(400).json({ error });
    };

    next();
  };

  applyCustomPassportCall = (Strategy) => (req, res, next) => {
    if (Strategy === passportStrategiesEnum.JWT) {
      passport.authenticate(
        Strategy,
        { session: false },
        function (err, user, info) {
          if (err) return next(err);
          if (!user) {
            return res.status(401).send({
              error: info.messages ? info.messages : info.toString(),
            });
          }
          req.user = user;
          next();
        }
      )(req, res, next);
    } else if (Strategy === passportStrategiesEnum.GITHUB) {
      passport.authenticate(
        Strategy,
        { scope: ["user:email"] },
        function (err, user, info) {
          if (err) return next(err);
          if (!user) {
            return res.status(401).send({
              error: info.messages ? info.messages : info.toString(),
            });
          }
          req.user = user;
          next();
        }
      )(req, res, next);
    } else {
      next();
    }
  };

  handlePolicies = (policies) => (req, res, next) => {
    if (policies[0] === accessRolesEnum.PUBLIC) return next();
    const user = req.user;
    if (!user) return res.status(401).json({ error: "no token provide" });
    if (!policies.includes(user.role))
      return res.status(403).json({ error: "not permissions" });

    next();
  };

  applyCallbacks(callbacks) {
    return callbacks.map((callback) => async (...params) => {
      try {
        await callback.apply(this, params);
      } catch (error) {
        params[1].status(500).json({ status: "error", message: error.message });
      }
    });
  }
}
