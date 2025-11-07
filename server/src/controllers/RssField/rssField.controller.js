const RssField = require("../../models/index")["RssField"];
const RssFieldService = require("../../services/RssField/rssField.services");
const RssFields = new RssFieldService();
const { successResponse, errorResponse } = require("../../helpers/index");


class RssFieldController {



  async cryptoNews(req, res) {
    try {
      const cryptoNews = await RssFields.cryptoNews();
      const message = "Crypto News retrieved successfully";
      return successResponse(req, res, cryptoNews, message);
    } catch (error) {
      return errorResponse(req, res, error.message);
    }
  }
  async create(req, res) {
    try {
      const rssField = await RssFields.create(req.body);
      const message = "RSSField created successfully";
      return successResponse(req, res, rssField, message);
    } catch (error) {
      return errorResponse(req, res, error.message);
    }
  }

  async findAll(req, res) {
    try {
      const rssFields = await RssFields.findAll();
      const message = "rssFields retrieved successfully";
      return successResponse(req, res, rssFields, message);
    } catch (error) {
      return errorResponse(req, res, error.message);
    }
  }

  async findOne(req, res) {
    try {
      const rssFieldId = req.params.id;
      const rssField = await RssFields.findOne(rssFieldId);
      const message = "rssField retrieved successfully";
      return successResponse(req, res, rssField, message);
    } catch (error) {
      return errorResponse(req, res, error.message);
    }
  }

  async delete(req, res) {
    try {
      const rssFieldId = req.params.id;
      const rssField = await RssFields.delete(rssFieldId);
      const message = "rssField deleted successfully";
      return successResponse(req, res, rssField, message);
    } catch (error) {
      return errorResponse(req, res, error.message);
    }
  }
}

module.exports = RssFieldController;
