<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}">
    <transition name="sidebarLogoFade">
      <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">
        <img
          v-if="logo"
          src="../../../assets/G7E6_Symbol_RGB_FullColor.png"
          class="sidebar-logo"
          alt=""
        >
        <p class="ml-10 mr-10 split text" />
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <img
          v-if="logo"
          src="../../../assets/G7E6_Symbol_RGB_FullColor.png"
          class="sidebar-logo"
          alt=""
        >
        <span class="ml-5 fz-20 fb text">Laplace</span>
        <p class="ml-10 mr-10 split text" />
      </router-link>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      title: 'Laplace',
      logo: '@/assets/G7E6_Symbol_RGB_FullColor.png'
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  // 靠左显示
  position: relative;
  width: 100%;
  height: 50px;
  margin-left: 5px;
  //line-height: 50px;
  background:#fff;
  text-align: left;
  overflow: hidden;
  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    display: flex !important;
    align-items: center;
    & .sidebar-logo {
      width: 48px;
      height: 42px;
      vertical-align: middle;
      margin-right: 12px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 600;
      line-height: 50px;
      font-size: 14px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0;
    }
  }
}
.text {
  position: relative;
  top: 2px;
}

</style>
