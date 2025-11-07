<template>
  <div v-bind:class="{ 'main-blur': this.isActive, none: !this.isActive }">
    <div class="success">
      <svg
        width="25px"
        height="25px"
        viewBox="0 0 16 16"
        class="bi bi-check2-circle"
        fill="#59e4d7"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          d="M15.354 2.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L8 9.293l6.646-6.647a.5.5 0 0 1 .708 0z"
        />
        <path
          fill-rule="evenodd"
          d="M8 2.5A5.5 5.5 0 1 0 13.5 8a.5.5 0 0 1 1 0 6.5 6.5 0 1 1-3.25-5.63.5.5 0 1 1-.5.865A5.472 5.472 0 0 0 8 2.5z"
        />
      </svg>
      <p class="text">{{ message }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "SuccessBar",
  props: {
    message: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
    },
  },
};
</script>

<style scoped>
.none {
  display: none;
}

.main-blur {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 1000000000000;
}

.success {
  position: absolute;
  bottom: 2%;
  left: 1%;
  width: 100%;
  background-color: #202740;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 10px;
  padding: 10px;
  padding-left: 20px;
  padding-right: 20px;
  max-width: 350px;
  gap: 10px;
}

.text {
  color: #59e4d7;
  font-size: 16px;
  margin: 0;
}
</style>
