"use strict";
const Account = use("App/Models/Account");
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with accounts
 */
class AccountController {
  /**
   * Show a list of all accounts.
   * GET accounts
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ auth, request, response, view }) {
    try {
      const data = await Account.all();
      return response.status(200).json({
        data,
      });
    } catch (error) {
      throw Error(`Error when searching for accounts`);
    }
  }

  /**
   * Render a form to be used for creating a new account.
   * GET accounts/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async store({ request, response }) {
    try {
      const data_request = request.only([
        "cpf",
        "email",
        "phone",
        "initial_value",
        "last_credit",
        "last_debt",
        // "current_value",
        "user_id",
        "bank_id",
      ]);
      const hashCode = function (s) {
        var h = 0,
          l = s.length,
          i = 0;
        if (l > 0) while (i < l) h = ((h << 5) - h + s.charCodeAt(i++)) | 0;
        return h;
      };

      const data = {
        number_account: hashCode(data_request.phone),
        ...data_request,
        current_value: data_request.initial_value,
      };
      const account = await Account.create(data);
      return response.status(200).json({
        message: "Success",
        data: account,
      });
    } catch (error) {
      throw Error(`Error when searching for accounts`);
    }
  }

  /**
   * Display a single account.
   * GET accounts/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ auth, params, request, response, view }) {
    try {
      const account = await Account.findOrFail(params.id);
      const user = await account.user().fetch();
      const bank = await account.bank().fetch();
      if (auth.user.id) {
        const data = {
          ...account.$attributes,
          user,
          bank,
        };
        return response.status(200).json({ data: data });
      }
      return response.status(403).send({ message: "error authetication" });
    } catch (error) {
      throw Error(`Error when searching for account`, error);
    }
  }

  /**
   * Render a form to update an existing account.
   * GET accounts/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async update({ params, request, response }) {
    try {
      const data_request = request.only([
        "cpf",
        "email",
        "phone",
        "initial_value",
        "last_credit",
        "last_debt",
        "current_value",
        "user_id",
        "bank_id",
      ]);
      const update = await Account.query()
        .where("id", params.id)
        .update(data_request);
      if (update === 1) {
        const account = await Account.findOrFail(params.id);
        return response.status(200).json({ data: account });
      }
    } catch (error) {
      throw Error(`Error when updating bank`, error);
    }
  }

  /**
   * Delete a account with id.
   * DELETE accounts/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {
    try {
      const { id } = params;
      const account = await Account.find(id);
      const deleted = await account.delete();
      if (deleted === true) {
        return response.status(200).json({ message: "Deletado com sucesso" });
      }
      return response.status(500).json({ message: "Erro ao deletar bank" });
    } catch (error) {
      throw Error(`Error when deleted bank`, error);
    }
  }
}

module.exports = AccountController;
