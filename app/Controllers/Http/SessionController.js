"use strict";
const User = use("App/Models/User");
const { validate } = use("Validator");

class SessionController {
  async index({ view }) {
    const data = await User.all();
    return view.render("all", { users: data.toJSON() });
  }
  async register({ request, response }) {
    let user = await User.create(request.all());
    const existsEmail = await User.findBy("email", user.email);

    if (existsEmail)
      return response
        .status(400)
        .send({ message: { err: `${data.email} already registered` } });
    else return response.json(user);
  }

  async create({ request, response, session }) {
    const validator = await validate(request.all(), {
      username: "required",
      email: "required|email|unique:users,email",
      password: "required",
    });

    if (validator.fails()) {
      session.withErrors(validator.messages()).flashAll();
      return response.status(500).send("Email invalid");
    }

    const u = new User();

    u.username = request.input("username");
    u.email = request.input("email");
    u.password = request.input("password");

    await u.save();

    session.flash({ notification: "User added! " });
  }
  async login({ auth, request, response, view }) {
    const { email, password } = request.all();
    try {
      let result = await auth.attempt(email, password);
      return view.render("login", { login: result.toJSON() });
    } catch (error) {
      let errorUser = error.message.startsWith("E_USER_NOT_FOUND");
      let errorPass = error.message.startsWith("E_PASSWORD_MISMATCH");
      let info = { type: "another", message: error.message };

      if (errorUser) {
        info = { type: "user", message: "E_USER_NOT_FOUND" };
      } else if (errorPass) {
        info = { type: "pass", message: "E_PASSWORD_MISMATCH" };
      }
      return response.status(403).send(info);
    }
  }
  async show({ auth, params, view, response }) {
    const user = auth.user;
    if (auth.user.id) {
      const userJson = await User.find(params.id);
      console.log(userJson);
      return response.status(200).send(userJson);
    }
    return response.status(403).send({ message: "error authetication" });
  }

  async logout({ response, auth }) {
    try {
      const isLogeddin = await auth.check();
      if (isLogeddin) {
        await auth.logout();
      }
      return response.status(401).send({ alert: "Desconect" });
    } catch (error) {
      response.status(401).send({ alert: "NOT_LOGGEDED" });
    }
  }
}

module.exports = SessionController;
