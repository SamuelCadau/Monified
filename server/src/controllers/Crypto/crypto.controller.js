const Crypto = require("../../models/index")["Crypto"];
const CryptoService = require("../../services/Crypto/crypto.services");
const Cryptos = new CryptoService();
const { successResponse, errorResponse } = require("../../helpers/index");

class CryptoController {
  /**
   * @param {Crypto} crypto
   * @returns {Promise<Crypto>}
   */

  async create(req, res) {
    try {
      const crypto = await Cryptos.create(req.body);
      const message = "Crypto created successfully";
      return successResponse(req, res, crypto, message);
    } catch (error) {
      return errorResponse(req, res, error.message);
    }
  }

  /**
   * @returns {Promise<Crypto[]>}
   */
  async findAll(req, res) {
    try {
      const cryptos = await Cryptos.findAll();
      const message = "Cryptos retrieved successfully";
      return successResponse(req, res, cryptos, message);
    } catch (error) {
      return errorResponse(req, res, error.message);
    }
  }

  /**
   * @param {Number} id
   * @returns {Promise<Crypto>}
   */
  async findOne(req, res) {
    try {
      const cryptoId = req.params.id;
      const crypto = await Cryptos.findOne(cryptoId);
      const message = "Crypto retrieved successfully";
      return successResponse(req, res, crypto, message);
    } catch (error) {
      return errorResponse(req, res, error.message);
    }
  }

  /**
   * @param {String} symbol
   * @returns {Promise<Crypto>}
   * @description Retrieve a crypto by symbol
   */
  async findBySymbol(req, res) {
    try {
      let { symbol } = req.query;
      const crypto = await Cryptos.findBySymbol(symbol);
      const message = "Crypto retrieved successfully";
      return successResponse(req, res, crypto, message);
    } catch (error) {
      return errorResponse(req, res, error.message);
    }
  }

  /**
   * @returns {Promise<Crypto>}
   * @description Find Bitcoin
   */
  async findBtc(req, res) {
    try {
      const crypto = await Cryptos.findBitcoin();
      const message = "Bitcoin retrieved successfully";
      return successResponse(req, res, crypto, message);
    } catch (error) {
      return errorResponse(req, res, error.message);
    }
  }

  /**
   * @param {Number} id
   * @param {Crypto} crypto
   * @returns {Promise<Crypto>}
   */
  async update(req, res) {
    try {
      const cryptoId = req.params.id;
      const crypto = await Cryptos.update(cryptoId, req.body);
      const message = "Crypto updated successfully";
      return successResponse(req, res, crypto, message);
    } catch (error) {
      return errorResponse(req, res, error.message);
    }
  }

  /**
   * @param {Number} id
   * @returns {Promise<Crypto>}
   */
  async delete(req, res) {
    try {
      const cryptoId = req.params.id;
      const crypto = await Cryptos.delete(cryptoId);
      const message = "Crypto deleted successfully";
      return successResponse(req, res, crypto, message);
    } catch (error) {
      return errorResponse(req, res, error.message);
    }
  }

  /**
   * @param {String} symbol
   * @param {String[]} options
   * @returns {Promise<Crypto[]>}
   */
  async getAveragePriceOfCrypto(req, res) {
    try {
      let { symbol } = req.query;
      symbol += "USDT";
      const crypto = await Cryptos.getPriceOfACrypto(symbol);
      const message = "Average Price info retrieved successfully";
      return successResponse(req, res, crypto, message);
    } catch (error) {
      return errorResponse(req, res, error.message);
    }
  }

  /**
   * @returns {Promise<Crypto[]>}
   * @description Get all cryptos from Binance format USDT and create them in the database
   * @returns {Promise<Crypto[]>}
   */
  async setAllCryptos(req, res) {
    try {
      const cryptos = await Cryptos.setAllCryptoDB();
      const message = "Cryptos retrieved successfully";
      return successResponse(req, res, cryptos, message);
    } catch (error) {
      return errorResponse(req, res, error.message);
    }
  }
}

module.exports = CryptoController;
