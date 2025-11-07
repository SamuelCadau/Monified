const Picture = require("../../models/index")["Picture"];
const Crypto = require("../../models/index")["Crypto"];
const axios = require("axios");
const { upload } = require("../../middleware");
const fs = require("fs");

const ICON_PROVIDERS = [
  (symbol) => `https://coinicons-api.vercel.app/api/icon/${symbol}`,
  (symbol) => `https://cryptoicon-api.vercel.app/api/icon/${symbol}`,
  (symbol) => `https://assets.coincap.io/assets/icons/${symbol}@2x.png`,
];

const buildFallbackIcon = (symbol) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(
    symbol.toUpperCase()
  )}&background=111827&color=ffffff&bold=true`;

const checkIconAvailability = async (url) => {
  try {
    await axios.head(url, { timeout: 5000 });
    return true;
  } catch (error) {
    const status = error.response?.status;
    if (status === 405) {
      try {
        await axios.get(url, {
          timeout: 5000,
          responseType: "arraybuffer",
        });
        return true;
      } catch (innerError) {
        return false;
      }
    }
    return false;
  }
};

const resolveIconUrl = async (symbol) => {
  for (const provider of ICON_PROVIDERS) {
    const candidate = provider(symbol);
    const available = await checkIconAvailability(candidate);
    if (available) {
      return candidate;
    }
  }
  return buildFallbackIcon(symbol);
};

class PictureService {
  constructor() {
    this.picture = Picture;
  }

  /**
   * @param {Picture} picture
   * @returns {Promise<Picture>}
   */
  async create(user_id, path) {
    return await this.picture
      .create({
        user_id: user_id,
        path: "/images/" + path,
      })
      .then((picture) => {
        if (picture) {
          return picture;
        } else {
          throw new Error("Picture cannot be created for the user");
        }
      });
  }

  async createPictureForCrypto(crypto_id, path) {
    return await this.picture
      .create({
        crypto_id: crypto_id,
        path: path,
      })
      .then((picture) => {
        if (picture) {
          return picture;
        } else {
          throw new Error("Picture cannot be created for the crypto");
        }
      });
  }

  /**
   * @returns {Promise<Picture[]>}
   */
  async findAll() {
    return await this.picture.findAll({
      include: [
        {
          model: Crypto,
          as: "crypto"
        },
      ]
    }).then((pictures) => {
      if (pictures.length !== 0) {
        return pictures;
      } else {
        throw new Error("Any pictures found");
      }
    });
  }

  /**
   * @param {Number} id
   * @returns {Promise<Picture>}
   * @throws {Error} if picture not found
   */
  async findOne(id) {
    return await this.picture
      .findByPk({
        where: {
          id: id,
        },
        include: [
          {
            model: Crypto,
            as: 'crypto'
          },
        ],
      })
      .then((picture) => {
        if (picture) {
          return picture;
        } else {
          throw new Error(`Picture with id ${id} not found`);
        }
      });
  }

  /**
   * @param {Number} id
   * @returns {Promise<Picture>}
   * @throws {Error} if picture not found
   * @throws {Error} if picture not deleted
   */
  async delete(id) {
    return await this.picture
      .destroy({
        where: {
          id: id,
        },
      })
      .then((picture) => {
        if (picture) {
          fs.unlinkSync(__basedir + "/public" + picture.path),
            (err) => {
              if (err) {
                throw new Error(err);
              }
            };
          return true;
        } else {
          throw new Error(`Picture with id ${id} not found`);
        }
      });
  }

  /**
   * @param {Number} user_id
   * @returns {Promise<Picture>}
   * @throws {Error} if picture not found
   * @throws {Error} if picture not deleted
   */
  async deletePictureByUserId(user_id) {
    return await this.picture
      .destroy({
        where: {
          user_id: user_id,
        },
      })
      .then((picture) => {
        if (picture) {
          return true;
        } else {
          throw new Error(`Picture with user_id ${user_id} not found`);
        }
      });
  }

  /**
   * @param {Number} user_id
   * @returns {Promise<Picture>}
   * @throws {Error} if picture not found
   */
  async findPictureByUserId(user_id) {
    return await this.picture
      .findOne({
        where: {
          user_id: user_id,
        },
      })
      .then((picture) => {
        if (picture) {
          return picture;
        } else {
          throw new Error(`Picture with user_id ${user_id} not found`);
        }
      });
  }

  /**
   * @param {String} symbol
   * @param {Number} crypto_id
   * @returns {Promise<Picture>}
   * @description Set Picture for all cryptos in db
   */
  async setPictureForAllCryptos(symbol, crypto_id) {
    if (!symbol) {
      throw new Error("Symbol is required");
    }
    const newSymbol = symbol.toLowerCase();
    const url = await resolveIconUrl(newSymbol);
    await this.createPictureForCrypto(crypto_id, url);
  }
}

module.exports = new PictureService();
