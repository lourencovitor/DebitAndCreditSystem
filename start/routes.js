"use strict";

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route");

Route.on("/").render("welcome");

Route.post("/login", "SessionController.login"); // login
Route.post("/created", "SessionController.create");
Route.get("users/:id", "SessionController.show");
Route.get("users", "SessionController.index").middleware("auth");

Route.group(() => {
  Route.get("banks", "BankController.index");
  Route.post("banks", "BankController.store");
  Route.get("banks/:id", "BankController.show");
  Route.put("banks/:id", "BankController.update");
  Route.delete("banks/:id", "BankController.destroy");

  Route.get("accounts", "AccountController.index");
  Route.post("accounts", "AccountController.store");
  Route.get("accounts/:id", "AccountController.show");
  Route.put("accounts/:id", "AccountController.update");
  Route.delete("accounts/:id", "AccountController.destroy");

  Route.post("credit", "CreditController.store");
  Route.post("debit", "DebitController.store");
}).prefix("api/v1");
