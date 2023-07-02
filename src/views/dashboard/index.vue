<script lang="ts" setup>
import { ref } from "vue"
import { useUserStore } from "@/store/modules/user"
import AdminDashboard from "./admin/index.vue"
import UserDashboard from "./user/index.vue"

type CurrentRole = "admin" | "super" | "user"

const userStore = useUserStore()
const currentRole = ref<CurrentRole>("admin")
if (!userStore.roles.includes("admin")) {
  currentRole.value = "user"
}
</script>

<template>
  <component :is="currentRole === 'admin' || currentRole === 'super' ? AdminDashboard : UserDashboard" />
</template>
