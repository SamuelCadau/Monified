<template>
  <div class="col-12 row q-pa-md">

    <div v-if="checkUser" class="col-12 items-center row">

      <div class="col-6 q-px-lg row justify-start" style="margin-top: 5%;">
        <span class="WorkBold col-12" style="color: white; font-size: 36px">News</span>
        <span class="WorkSans col-12" style="color: #acb5ca; font-size: 14px">All the news in today’s market</span>
      </div>
      <div class="col-6 row justify-end">
        <q-avatar size="42px">
          <img :src="userAvatar" />
        </q-avatar>
        <q-btn flat dense round color="white" icon="expand_more">
          <q-menu
            transition-show="jump-down"
            transition-hide="jump-up"
            style="background-color: #202740"
          >
            <q-list style="min-width: 100px">
              <q-item clickable style="color: red" @click="logout">
                <q-item-section>Logout</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </div>
    </div>
    <div class="col-12 q-mt-lg row news-search-block">

      <div v-if="global.accessToken" class="col-3 flex q-pl-lg justify-between items-center">
        <q-input outlined label="Search..." v-model="keyword" dark ><template v-slot:after>
          <q-btn round dense flat icon="search" @click="searchNews" />
        </template>
      </q-input>
      </div>
      <div class="col-12 q-mt-lg">
        <div id="q-app-cards" style="">
          <div class="q-pa-md row items-start q-gutter-md card-news-container">
            <q-card
              v-for="news in cryptoNews"
              :key="news.title"
              class="cards"
              flat
              bordered
              @click.prevent="goNewsShow(news.id)"
            >
              <q-card-section horizontal>
                <q-card-section class="q-pt-xs">
                  <div class="text-h5 q-mt-sm q-mb-xs card-news-title">
                    {{ news.title }}
                  </div>
                  <div
                    class="text-caption text-grey card-news-short-description"
                  >
                    <span>{{ news.shortDescription }}</span>
                  </div>
                </q-card-section>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { UseGlobal } from "stores/global";
import newsService from "../services/News";
import userService from "../services/User";
import URL from "src/helpers/Contants";
import createLogger from "src/utils/logger";

const logger = createLogger("news-connected");

export default defineComponent({
  name: "NewsConnected",

  setup() {
    const global = UseGlobal();

    return {
      global,
    };
  },

  data() {
    return {
      cryptoNews: [],
      keyword: "",
      searchResult: [],
      router: this.$router,
      newsId: "",
      account: false,
      user: {},
      defaultAvatar: "https://cdn.quasar.dev/img/avatar2.jpg",
    };
  },
  methods: {
    /**
     * Get all news
     * @returns {Array} news
     */
    async getCryptoNews() {
      const response = await newsService.getAllNews();
      const data = response.data.data;
      this.cryptoNews = data.map((news) => {
        return {
          id: news.id,
          title: news.title,
          shortDescription: news.content,
          content: news.contentEncoded,
        };
      });
    },

    /**
     * Get one news by id
     * @param {String} newsId
     * @returns {Object} news
     */

    async goNewsShow(newsId) {
      const response = await newsService.getOneNews(newsId);
      const data = response.data.data;
      this.router.push({ path: `/news/${newsId}` });
    },
    getUser() {
      userService
        .getUser(this.global.accessToken[1])
        .then((response) => {
          this.user = response.data.data;
          return this.user;
        })
        .catch((err) => {
          logger.warn("Unable to fetch connected user", err);
        });
    },
    /**
     * Search news by keyword
     * @returns {Array} news
     */
    async searchNews() {
      const searchInput = this.keyword;

      if (searchInput === "") {
        alert("Please enter a keyword");
        return;
      }

      // verify if cryptoNews object is including the keyword
      const news = this.cryptoNews.map((news) => {
        if (news.content.includes(searchInput)) {
          return news;
        }
      });
      this.searchResult = news.filter((news) => news !== undefined);
      this.cryptoNews = this.searchResult;
      detectDelete();
      return this.cryptoNews;
    },

    handleChange(event) {
      this.keyword = event.target.value;
      this.searchNews();
    },
    // using keyboard to detecte quand l'utilisateur supprime le mot clé de la barre de recherche
    // et réaffiche les news
    detectDelete() {
      document.addEventListener("keydown", (event) => {
        if (event.key === "Backspace") {
          this.getCryptoNews();
        }
      });
    },

    // check if user is logged in by session storage and store access token
    checkUser() {
      const token = sessionStorage.getItem("token");
      if (token) {
        this.account = true;
        return true;
      } else {
        this.account = false;
        return false;
      }
    },

    // logout user
    logout() {
      sessionStorage.clear();
      this.global.accessToken = "";
      this.account = false;
      this.router.push({ path: `/login` });
    },
  },
  computed: {
    userAvatar() {
      return this.user?.picture?.path
        ? URL.buildAssetUrl(this.user.picture.path)
        : this.defaultAvatar;
    },
  },
  mounted() {
    this.getCryptoNews();
    this.detectDelete();
    this.checkUser();
    this.getUser();
  },
});
</script>

<style scoped>
.search {
  width: 100%;
  position: relative;
  display: flex;
}

.searchTerm {
  width: 200px;
  height: 50px;
  border: 1px solid #202740;
  border-right: none;
  padding: 20px;
  border-radius: 5px 0 0 5px;
  outline: none;
  color: #acb5ca;
  background-color: transparent;
}

.searchTerm:focus {
  color: #acb5ca;
}

/* INPUT PLACEHOLDER */
.searchTerm::placeholder {
  color: #acb5ca;
}

.searchButton {
  display: flex;
  align-items: center;
  width: 50px;
  height: 50px;
  border: 1px solid #202740;
  background-color: transparent;
  color: #fff;
  border-radius: 0 5px 5px 0;
  cursor: pointer;
  font-size: 20px;
}
.news_page_title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.news_page_title h1 {
  color: white;
  font-size: 1.9em;
}

.search_section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 30%;
  position: relative;
}

.search_news_input {
  width: 71%;
  height: 50px;
  border-radius: 6px;
  background-color: #202740;
  color: white;
  font-size: 1.5em;
  padding-left: 20px;
  border-right: none;
}

.search_btn {
  width: 30%;
  height: 30px;
  border-radius: 4px;
  background-color: #202740;
  color: white;
  font-size: 1.4em;
  border-left: none;
  position: absolute;
  right: 0;
}

#q-app-cards {
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.card-news-container {
  width: 100%;
  height: 100%;
  display: flex;
}

.cards {
  width: 23%;
  height: 200px;
  max-width: 350px;
  background-color: #202740;
  border-radius: 6px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
}

.card-news-title {
  width: 100%;
  color: #fff;
  font-size: 1.2em;
  text-align: left;
  height: 50%;
  line-height: 1.5em;
}

.card-news-short-description {
  width: 100%;
  color: #fff;
  font-size: 1em;
  height: 40%;
  padding: 2%;
}

.my-sticky-virtscroll-table {
  height: 410px;
}

.q-table__card {
  background-color: #11191f !important;
  box-shadow: none;
  color: #fff;
}

.q-table__top,
.q-table__bottom,
thead tr:first-child th {
  background-color: #fff;
}

thead tr th {
  position: sticky;
  z-index: 1;
}

thead tr:last-child th {
  top: 48px;
}

thead tr:first-child th {
  top: 0;
}

@media screen and (max-width: 768px) {
  .news-search-block {
    display: flex;
    justify-content: center;
  }

  .search_section {
    justify-content: flex-start;
    width: 50%;
  }

  .search_news_input {
    width: 170px;
    height: 50px;
    border-radius: 6px;
    background-color: #202740;
    color: white;
    font-size: 1.5em;
    padding-left: 20px;
    border-right: none;
  }

  .search_btn {
    width: 100px;
    height: 30px;
    border-radius: 4px;
    background-color: #202740;
    color: white;
    font-size: 1.4em;
    border-left: none;
    position: absolute;
    right: 0;
  }

  .cards {
    height: 180px;
    width: 100%;
  }
}
</style>
