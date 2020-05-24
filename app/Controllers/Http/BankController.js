"use strict";

const Bank = use("App/Models/Bank");
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with banks
 */
class BankController {
  /**
   * Show a list of all banks.
   * GET banks
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, view }) {
    try {
      const data = await Bank.all();
      return response.status(200).json({
        data: data,
      });
    } catch (error) {
      throw Error(`Error when searching for banks`, error);
    }
  }

  /**
   * Render a form to be used for creating a new bank.
   * GET banks/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async store({ request, response }) {
    try {
      const data = request.only(["name", "abbreviation"]);
      const bank = await Bank.create(data);
      return response.status(200).json({
        message: "Success",
        data: bank,
      });
    } catch (error) {
      throw Error(`Error when registering banks`, error);
    }
  }

  /**
   * Display a single bank.
   * GET banks/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ auth, params, request, response, view }) {
    try {
      const bank = await Bank.findOrFail(params.id);
      if (auth.user.id) {
        const userJson = await bank;
        return response.status(200).json({ data: userJson });
      }
      return response.status(403).send({ message: "error authetication" });
    } catch (error) {
      throw Error(`Error when searching for bank`, error);
    }
  }

  /**
   * Render a form to update an existing bank.
   * GET banks/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async update({ params, request, response }) {
    try {
      const data = request.only(["name", "abbreviation"]);
      const update = await Bank.query().where("id", params.id).update(data);
      if (update === 1) {
        const bank = await Bank.findOrFail(params.id);
        return response.status(200).json({ data: bank });
      }
    } catch (error) {
      throw Error(`Error when updating bank`, error);
    }
  }

  /**
   * Delete a bank with id.
   * DELETE banks/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {
    try {
      const { id } = params;
      const bank = await Bank.find(id);
      const deleted = await bank.delete();
      if (deleted === true) {
        return response.status(200).json({ message: "Deletado com sucesso" });
      }
      return response.status(500).json({ message: "Erro ao deletar bank" });
    } catch (error) {
      throw Error(`Error when deleted bank`, error);
    }
  }
}

module.exports = BankController;
