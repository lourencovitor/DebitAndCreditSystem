"use strict";
const Account = use("App/Models/Account");
const Database = use("Database");
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with debits
 */
class DebitController {
  async store({ request, response }) {
    const data = request.only(["number_account", "cpf", "value"]);
    const account = await Account.query()
      .where("number_account", data.number_account)
      .where("cpf", data.cpf)
      .first();
    if (account !== undefined) {
      if (account.current_value <= 0) {
        return response
          .status(500)
          .json({ message: "You don't have enough balance" });
      }
      const current_value = parseInt(account.current_value - data.value);
      let new_date = new Date();
      const day = new_date.getDate();
      const month = new_date.getMonth();
      const year = new_date.getFullYear();
      const last_debt = `${year}-${month}-${day}`;
      const dataCredit = {
        last_debt,
        current_value,
      };
      const update = await Account.query()
        .where("id", account.id)
        .update(dataCredit);
      if (update === 1) {
        const data = await Account.findOrFail(account.id);
        return response.status(200).json({ data });
      }
    }
    return response
      .status(500)
      .json({ message: "Error when searching for account" });
  }
}

module.exports = DebitController;
