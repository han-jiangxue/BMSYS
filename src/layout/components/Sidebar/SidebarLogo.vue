<script lang="ts" setup>
const props = defineProps({
  collapse: {
    type: Boolean,
    default: true
  }
})
</script>

<template>
  <div class="sidebar-logo-container" :class="{ collapse: props.collapse }">
    <transition name="sidebar-logo-fade">
      <router-link v-if="props.collapse" key="collapse" to="/">
        <img src="@/assets/layout/CUMT.png" class="sidebar-logo" />
      </router-link>
      <router-link v-else key="expand" to="/">
        <img width="70" src="@/assets/layout/CUMT.png" class="sidebar-logo-text" />
        <span class="sidebar-logo-text">报名系统</span>
      </router-link>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: var(--v3-header-height);
  line-height: var(--v3-header-height);
  background-color: var(--v3-sidebarlogo-bg-color);
  text-align: start;
  overflow: hidden;
  .sidebar-logo {
    display: none;
    margin-left: 0.8rem;
  }
  .sidebar-logo-text {
    vertical-align: middle;
    font-size: 1.5rem;
    font-weight: 800;
    color: azure;
  }
}

.collapse {
  .sidebar-logo {
    width: 32px;
    height: 32px;
    vertical-align: middle;
    display: inline-block;
  }
  .sidebar-logo-text {
    display: none;
  }
}
</style>
<!--
<script lang="ts" setup>
const props = defineProps({
  collapse: {
    type: Boolean,
    default: true
  }
})
</script>

<template>
  <div class="sidebar-logo-container" :class="{ collapse: props.collapse }">
    <transition name="sidebar-logo-fade">
      <router-link v-if="props.collapse" key="collapse" to="/">
        <div class="flex items-center justify-items-center w-full h-full">
          <img width="50" src="@/assets/layout/CUMT.png" />
        </div>
      </router-link>
      <router-link v-else key="expand" to="/">
        <div class="flex items-center justify-items-start">
          <img width="70" src="@/assets/layout/CUMT.png" />
          <span class="color-#FFF text-7 font-800">报名系统</span>
        </div>
      </router-link>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: var(--v3-header-height);
  line-height: var(--v3-header-height);
  background-color: var(--v3-sidebarlogo-bg-color);
  overflow: hidden;
}

.collapse {
  .sidebar-logo {
    width: 32px;
    height: 32px;
    vertical-align: middle;
    display: inline-block;
  }
  .sidebar-logo-text {
    display: none;
  }
}
</style>
 -->
