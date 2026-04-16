<template>
  <router-view />
  <Notification />
  <AIChatBot />
</template>

<script setup>
import Notification from './components/Shared/Notification.vue';
import AIChatBot from './components/AIChatBot.vue';
</script>

<style>
</style>
