module.exports = (app) => {
  const Picture = require("../../controllers/Picture/picture.controller.js");
  const router = require("express").Router();
  const { upload } = require("../../middleware");

  // Retrieve all Pictures
  router.get("/", Picture.findAll);

  // Retrieve a single Picture with id
  router.get("/:id", Picture.findOne);

  // Retrieve Picture with user_id
  router.get("/user/:id", Picture.findPictureByUserId);4

  // Create a new Picture
  router.post("/upload", upload, Picture.create);

  // Delete a Picture with id
  router.delete("/:id", Picture.delete);

  // Delete Picture from User
  router.delete("/user/:id", Picture.deletePictureFromUser);

  app.use("/api/pictures", router);
};