"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class BanksSchema extends Schema {
  up() {
    this.create("banks", (table) => {
      table.increments();
      table.string("name");
      table.string("abbreviation");
      table.timestamps();
    });
  }

  down() {
    this.drop("banks");
  }
}

module.exports = BanksSchema;
