<template>
  <div class="app-layout">
    <TheNavbar />

    <div class="app-body">
      <TheSidebar />

      <main class="app-content">
        <router-view />
      </main>
    </div>

    <TheFooter />

    <!-- Montado UMA vez: todos os toasts do app aparecem aqui -->
    <ToastContainer />
  </div>
</template>

<script setup>
import TheNavbar from './components/layout/TheNavbar.vue'
import TheSidebar from './components/layout/TheSidebar.vue'
import TheFooter from './components/layout/TheFooter.vue'
import ToastContainer from './components/ToastContainer.vue'
</script>