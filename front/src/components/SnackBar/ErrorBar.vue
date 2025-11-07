<template>
  <div v-bind:class="{ 'main-blur': this.isActive, none: !this.isActive }">
    <div class="success">
      <svg
        height="25"
        viewBox="0 0 15 15"
        width="25"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8 10.5V10H7V10.5H8ZM7 10.51V11.01H8V10.51H7ZM7 4V8H8V4H7ZM7 10.5V10.51H8V10.5H7ZM7.5 14C3.91015 14 1 11.0899 1 7.5H0C0 11.6421 3.35786 15 7.5 15V14ZM14 7.5C14 11.0899 11.0899 14 7.5 14V15C11.6421 15 15 11.6421 15 7.5H14ZM7.5 1C11.0899 1 14 3.91015 14 7.5H15C15 3.35786 11.6421 0 7.5 0V1ZM7.5 0C3.35786 0 0 3.35786 0 7.5H1C1 3.91015 3.91015 1 7.5 1V0Z"
          fill="red"
        />
      </svg>
      <p class="text">{{ message }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "ErrorBar",
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
  color: red;
  font-size: 16px;
  margin: 0;
}

.icon {
  color: red;
  font-weight: bold;
  font-size: 25px;
}
</style>
