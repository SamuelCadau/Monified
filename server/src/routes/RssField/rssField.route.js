module.exports = (app) => {
  const Controller = require("../../controllers/RssField/rssField.controller.js");
  const RssField = new Controller();
  const router = require("express").Router();
  const { authJwt } = require("../../middleware");

  // Set RssField
  router.get("/rss", RssField.cryptoNews);

  // Retrieve all RssFields
  router.get("/", RssField.findAll);

  // Retrieve a single RssField with id
  router.get("/:id", RssField.findOne);

  // Delete a RSSFiled with id
  router.delete(
    "/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    RssField.delete
  );

  app.use("/api/news", router);
};
