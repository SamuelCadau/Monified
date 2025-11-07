const Bookmark = require("../../models/index")["Bookmark"];
const BookmarkService = require("../../services/Bookmark/bookmark.services");
const { successResponse, errorResponse } = require("../../helpers/index");

class BookmarkController {
  /**
   * @param {User} user_id
   * @param {Crypto} crypto_id
   * @returns {Promise<Bookmark>}
   * @description Add crypto to user
   */
  async addCryptoToUser(req, res) {
    try {
      const userId = req.body.user_id;
      const cryptoId = req.body.crypto_id;
      const bookmark = await BookmarkService.addCryptoToUser(userId, cryptoId);
      const message = "Crypto added to user successfully";
      return successResponse(req, res, bookmark, message);
    } catch (error) {
      return errorResponse(req, res, error.message);
    }
  }

  /**
   * @param {User} user_id
   * @param {Crypto} crypto_id
   * @returns {Promise<Bookmark>}
   * @description Removes a crypto from a user's bookmarks
   */
  async removeCryptoFromUser(req, res) {
    try {
      const userId = req.body.user_id;
      const cryptoId = req.body.crypto_id;
      const bookmark = await BookmarkService.removeCryptoFromUser(
        userId,
        cryptoId
      );
      const message = "Crypto removed from user successfully";
      return successResponse(req, res, bookmark, message);
    } catch (error) {
      return errorResponse(req, res, error.message);
    }
  }

  /**
   * @param {User} user_id
   * @returns {Promise<Bookmark[]>}
   * @description Get all bookmarks for a user
   */
  async getAllBookmarksForUser(req, res) {
    try {
      const userId = req.query.user_id;
      const bookmarks = await BookmarkService.findAllByUserId(userId);
      const message = "Bookmarks retrieved successfully";
      return successResponse(req, res, bookmarks, message);
    } catch (error) {
      return errorResponse(req, res, error.message);
    }
  }

  /**
   * @param {Crypto} crypto_id
   * @returns {Promise<Bookmark>}
   * @description Get all bookmarks for a crypto
   */
  async getAllBookmarksForCrypto(req, res) {
    try {
      const cryptoId = req.query.crypto_id;
      const bookmarks = await BookmarkService.findAllByCryptoId(cryptoId);
      const message = "Bookmarks retrieved successfully";
      return successResponse(req, res, bookmarks, message);
    } catch (error) {
      return errorResponse(req, res, error.message);
    }
  }

  /**
   * @param {User} user_id
   * @param {Crypto} crypto_id
   * @returns {Promise<Bookmark>}
   * @description Find a bookmark by user and crypto
   */
  async findBookmarkByUserAndCrypto(req, res) {
    try {
      const userId = req.query.user_id;
      const cryptoId = req.query.crypto_id;
      const bookmark = await BookmarkService.findOneByUserIdAndCryptoId(
        userId,
        cryptoId
      );
      const message = "Bookmark retrieved successfully";
      return successResponse(req, res, bookmark, message);
    } catch (error) {
      return errorResponse(req, res, error.message);
    }
  }

  /**
   * @returns {Promise<Bookmark[]>}
   * @description Get all bookmarks
   */
  async getAllBookmarks(req, res) {
    try {
      const bookmarks = await BookmarkService.findAll();
      const message = "Bookmarks retrieved successfully";
      return successResponse(req, res, bookmarks, message);
    } catch (error) {
      return errorResponse(req, res, error.message);
    }
  }

  /**
   * @param {User} user_id
   * @param {Crypto} crypto_id
   * @returns {Promise<Bookmark>}
   * @description Check if a crypto is bookmarked by a user
   */
  async isCryptoBookmarkedByUser(req, res) {
    try {
      const userId = req.query.user_id;
      const cryptoId = req.query.crypto_id;
      const bookmark = await BookmarkService.isCryptoBookmarked(
        userId,
        cryptoId
      );
      if (bookmark === true) {
        const message = "Crypto is bookmarked by user";
        return successResponse(req, res, bookmark, message);
      }
      const message = "Crypto is not bookmarked by any user";
      return successResponse(req, res, bookmark, message);
    } catch (error) {
      return errorResponse(req, res, error.message);
    }
  }
}

module.exports = new BookmarkController();
