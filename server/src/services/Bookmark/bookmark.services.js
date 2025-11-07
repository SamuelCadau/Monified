const Bookmark = require("../../models/index")["Bookmark"];

class BookmarkService {
  constructor() {
    this.bookmark = Bookmark;
  }

  async addCryptoToUser(userId, cryptoId) {
    return await this.bookmark
      .create({
        user_id: userId,
        crypto_id: cryptoId,
      })
      .then((bookmark) => {
        if (bookmark) {
          return bookmark;
        } else {
          throw new Error(
            `Bookmark not created with user_id: ${userId} and crypto_id: ${cryptoId}`
          );
        }
      });
  }

  async removeCryptoFromUser(userId, cryptoId) {
    return await this.bookmark
      .destroy({
        where: {
          user_id: userId,
          crypto_id: cryptoId,
        },
      })
      .then((bookmark) => {
        if (bookmark) {
          return true;
        } else {
          throw new Error(
            `Bookmark not found with user_id: ${userId} and crypto_id: ${cryptoId}`
          );
        }
      });
  }

  async findAllByUserId(userId) {
    return await this.bookmark
      .findAll({
        where: {
          user_id: userId,
        },
      })
      .then((bookmarks) => {
        if (bookmarks.length === 0) {
          throw new Error(`Any bookmarks found with user_id: ${userId}`);
        }
        return bookmarks;
      });
  }

  async findAllByCryptoId(cryptoId) {
    return await this.bookmark
      .findAll({
        where: {
          crypto_id: cryptoId,
        },
      })
      .then((bookmarks) => {
        if (bookmarks.length === 0) {
          throw new Error(`Any bookmarks found with crypto_id: ${cryptoId}`);
        }
        return bookmarks;
      });
  }

  async findOneByUserIdAndCryptoId(userId, cryptoId) {
    return await this.bookmark
      .findOne({
        where: {
          user_id: userId,
          crypto_id: cryptoId,
        },
      })
      .then((bookmark) => {
        if (bookmark) {
          return bookmark;
        } else {
          throw new Error(
            `Bookmark not found with user_id: ${userId} and crypto_id: ${cryptoId}`
          );
        }
      });
  }

  async findAll() {
    return await this.bookmark.findAll().then((bookmarks) => {
      if (bookmarks) {
        if (bookmarks.length === 0) {
            throw new Error("Any bookmarks found");
        }
        return bookmarks;
      } else {
        throw new Error("Any bookmarks found");
      }
    });
  }

  /** BOOKMARKS HELPERS */
  async isCryptoBookmarked(userId, cryptoId) {
    return await this.findOneByUserIdAndCryptoId(userId, cryptoId)
      .then((bookmark) => {
        if (bookmark) {
          return true;
        } else {
          return false;
        }
      })
      .catch((error) => {
        return false;
      });
  }
}

module.exports = new BookmarkService();
