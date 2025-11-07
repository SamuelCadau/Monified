
<template>
  <div>
    <NewsShow />
  </div>
</template>

<script>

import NewsShow from '../components/NewsShow.vue'

import { defineComponent } from 'vue';

export default defineComponent({
  name: "NewsPage",
  components: {
    NewsShow,
  },
})

</script>
