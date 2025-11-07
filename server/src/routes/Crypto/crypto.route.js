module.exports = (app) => {
  const Controller = require("../../controllers/Crypto/crypto.controller.js");
  const Crypto = new Controller();
  const router = require("express").Router();
  const { authJwt } = require("../../middleware");

  // Create a new Crypto
  router.post("/", [authJwt.verifyToken, authJwt.isAdmin], Crypto.create);

  // Retrieve all Cryptos
  router.get("/", Crypto.findAll);

  // Retrieve Bitcoin Crypto
  router.get("/bitcoin", authJwt.verifyToken, Crypto.findBtc);

  // Retrieve a single Crypto with id
  router.get("/:id", authJwt.verifyToken, Crypto.findOne);

  // Retrieve price of a Crypto
  router.get(
    "/price/:symbol",
    authJwt.verifyToken,
    Crypto.getAveragePriceOfCrypto
  );

  // Update a Crypto with id
  router.put("/:id", [authJwt.verifyToken, authJwt.isAdmin], Crypto.update);

  // // Delete a Crypto with id
  router.delete("/:id", [authJwt.verifyToken, authJwt.isAdmin], Crypto.delete);

  app.use("/api/cryptos", router);
};
