"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Account extends Model {
  user() {
    return this.belongsTo("App/Models/User", "user_id", "id");
  }
  bank() {
    return this.belongsTo("App/Models/Bank", "bank_id", "id");
  }
}

module.exports = Account;
