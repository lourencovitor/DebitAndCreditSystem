"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class AccountSchema extends Schema {
  up() {
    this.create("accounts", (table) => {
      table.increments();
      table.string("number_account");
      table.string("cpf");
      table.string("email");
      table.string("phone");
      table.double("initial_value");
      table.date("last_credit");
      table.date("last_debt");
      table.double("current_value");
      table.integer("user_id").unsigned().references("id").inTable("users");
      table.integer("bank_id").unsigned().references("id").inTable("banks");
      table.timestamps();
    });
  }

  down() {
    this.drop("accounts");
  }
}

module.exports = AccountSchema;
