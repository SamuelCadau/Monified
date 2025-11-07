module.exports = (app) => {
    const Bookmark = require("../../controllers/Bookmark/bookmark.controller");
    const router = require("express").Router();
      const { authJwt } = require("../../middleware");

    // Retrieve all Bookmarks
    router.get("/", [authJwt.verifyToken, authJwt.isAdmin], Bookmark.getAllBookmarks);

    // Retrieve all Bookmarks of a User
    router.get("/user", authJwt.verifyToken, Bookmark.getAllBookmarksForUser);

    // Retrieve all Bookmarks of a Crypto
    router.get("/crypto", [authJwt.verifyToken, authJwt.isAdmin], Bookmark.getAllBookmarksForCrypto);

    // Retrieve a Bookmark by User and Crypto
    router.get("/user/crypto", authJwt.verifyToken, Bookmark.findBookmarkByUserAndCrypto);

    // Check if a Crypto is Bookmarked by a User
    router.get("/crypto/bookmarked", authJwt.verifyToken, Bookmark.isCryptoBookmarkedByUser);

    // Add Cryto to User's Bookmarks
    router.post("/add", authJwt.verifyToken ,Bookmark.addCryptoToUser);

    // Remove Crypto from User's Bookmarks
    router.delete("/remove", authJwt.verifyToken ,Bookmark.removeCryptoFromUser);

    app.use('/api/bookmarks', router);
}