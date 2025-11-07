<template>
  <div class="icon-top-right" @click="goBack">
    <q-item-label>
      <q-icon name="arrow_back" />
      Back
    </q-item-label>
  </div>
  <section class="q-pa-md news_show_section">
    <div class="row justify-center">
      <div class="col-12 col-md-10 col-lg-8">
        <div class="card">
          <div class="card-body">
            <h1>{{ oneNews.title }} </h1>
            <div class="text-caption text-grey">
              <div class="formated_date">{{ FormatedDate(oneNews.pubDate) }}</div>
            </div>
            <div class="q-mt-md">
              <p v-html="oneNews.contentEncoded"></p>
            </div>
          </div>
          <a :href="oneNews.link" target="_blank" class="q-mb-md">See more about this article</a>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { defineComponent } from "vue";
import { UseGlobal } from "stores/global";
import newsService from "../services/News";
import moment from "moment";


export default defineComponent({
  name: "NewsShow",

  setup() {
    const global = UseGlobal();

    return {
      global,
    };
  },

  data() {
    return {
      oneNews: {},
    }
  },



  methods: {
    async getOneNewsFromParams() {
      const newsId = this.$route.params.id;
      const response = await newsService.getOneNews(newsId);
      this.oneNews = response.data.data;
    },
    FormatedDate(date) {
      return moment(date).format("MM/DD/YYYY, HH:mm a");
    },
    goBack() {
      this.$router.go(-1);
    },
  },
  mounted: function () {
    this.getOneNewsFromParams();
  },




});

</script>


<style>
.relative {
  position: relative;

}

.icon-top-right {
  position: absolute;
  top: 7%;
  right: 10%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 110px;
  color: #fff;
  font-size: 1.2em;
}

.q-item__label:hover {
  color: #59e4d7;
  font-weight: bold;
}

.news_show_section {
  background-color: #11191F;
  color: white;
  display: flex;
  justify-content: center;
  width: 100%;

}

.news_show_section h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.news_show_section .formated_date {
  margin-bottom: 1rem;
  color: #4950B8;
}

.news_show_section .card-body p,
.card-body div,
.card-body a,
.card-body span,
.card-body h1,
.card-body h2,
.card-body h3,
.card-body h4,
.card-body h5,
.card-body h6 {
  text-align: justify;
  color: #E5E5E5;
  text-decoration: none;
  font-size: 1.2rem;
  width: 100%;
}

.news_show_section .card>a {
  color: #4950B8;
  font-size: 1.2rem;
  text-decoration: none;
  outline: none;
}

.news_show_section .card>a:hover {
  color: #59E4D7;
}
</style>
