import { api } from "boot/axios";
import URL from "src/helpers/Contants";

export default {
  getAllBookmarks: () => api.get(URL.API_BOOKMARK),
  getAllBookmarksOfUser: (userId) =>
    api.get(`${URL.API_BOOKMARK}/user`, {
      params: { user_id: userId },
    }),
  getAllBookmarksOfCrypto: (cryptoId) =>
    api.get(`${URL.API_BOOKMARK}/crypto`, {
      params: { crypto_id: cryptoId },
    }),
  getBookmarkOfUserCrypto: (userId, cryptoId) =>
    api.get(`${URL.API_BOOKMARK}/user/crypto`, {
      params: { user_id: userId, crypto_id: cryptoId },
    }),
  checkIfCryptoIsBookmarked: (userId, cryptoId) =>
    api.get(`${URL.API_BOOKMARK}/crypto/bookmarked`, {
      params: { user_id: userId, crypto_id: cryptoId },
    }),
  addCryptoToUserBookmarks: (userId, cryptoId) =>
    api.post(`${URL.API_BOOKMARK}/add`, {
      user_id: userId,
      crypto_id: cryptoId,
    }),
  removeCryptoFromUserBookmarks: (userId, cryptoId) =>
    api.delete(`${URL.API_BOOKMARK}/remove`, {
      data: { user_id: userId, crypto_id: cryptoId },
    }),
};
